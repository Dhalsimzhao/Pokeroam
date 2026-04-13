# !!!INVESTIGATE!!!

# PROBLEM DESCRIPTION

宠物偶尔会走出屏幕边界

# UPDATES

## UPDATE

只试方案1和2，跳过方案3。

# TESTS

This is a physics/window-position issue that cannot be reliably unit-tested because it depends on Electron `BrowserWindow.setPosition()` and `screen.getPrimaryDisplay().workArea`. The issue manifests visually at runtime.

Verification approach:
- Add temporary `console.log` in `clampToBounds()` and `tick()` to log when position exceeds bounds
- Manually trigger edge cases: drag to screen edge then release, resize display, connect/disconnect monitor
- Success criteria: pet always stays fully visible within the screen work area

# PROPOSALS

## PROPOSAL No.1: WorkArea staleness — cached workArea never refreshes [CONFIRMED]

`usePetPhysics.ts` fetches `workArea` once at initialization (line ~124) and stores it in `workAreaRef`. If the user changes display resolution, moves the taskbar, or connects/disconnects an external monitor, the cached `workArea` becomes stale. The pet keeps clamping to the old boundaries which may no longer match the actual screen.

### CODE CHANGE

In `src/renderer/src/pet/usePetPhysics.ts`, add periodic workArea refresh inside `tick()`:

```typescript
// Refresh workArea every ~2 seconds (120 frames at 60fps)
let frameCount = 0
// Inside tick:
frameCount++
if (frameCount % 120 === 0) {
  window.api.getWorkArea().then((wa) => { workAreaRef.current = wa })
}
```

Or listen for display-change event from main process:

```typescript
// Main process (src/main/index.ts):
screen.on('display-metrics-changed', () => {
  petWindow?.webContents.send('display-changed', screen.getPrimaryDisplay().workArea)
})

// Renderer: update workAreaRef on event
window.api.onDisplayChanged((wa) => { workAreaRef.current = wa })
```

### RESULT

- Code change compiles cleanly (`pnpm typecheck` passes).
- The root cause is confirmed by code review: `workAreaRef` is set once in `useEffect` init (line 124) and only refreshed in `endDrag()`. The main `tick()` loop never refreshes it. Any display change (resolution, taskbar move, monitor connect/disconnect) will leave the pet clamping to stale bounds.
- The fix adds a lightweight async refresh every ~2 seconds (120 frames). The `getWorkArea()` IPC is cheap (just returns `screen.getPrimaryDisplay().workArea`), so the overhead is negligible.
- **CONFIRMED**: This is a real bug that can cause the pet to walk off screen boundaries.

## PROPOSAL No.2: Drag-move handler has no boundary clamping [CONFIRMED]

The `drag-move` IPC handler in `src/main/index.ts` (lines ~362-366) directly adds dx/dy to the current position without bounds checking:

```typescript
ipcMain.on('drag-move', (_e, dx, dy) => {
  const [x, y] = petWindow.getPosition()
  petWindow.setPosition(x + dx, y + dy)
})
```

During fast dragging, the pet can be moved beyond screen bounds. Although `endDrag()` in `usePetPhysics.ts` does clamp after drag ends (lines ~145-175), if mouseup fails to fire (e.g., fires outside window), the pet stays off-screen.

### CODE CHANGE

In `src/main/index.ts`, add bounds clamping in the `drag-move` handler:

```typescript
ipcMain.on('drag-move', (_e, dx: number, dy: number) => {
  if (!petWindow) return
  const [x, y] = petWindow.getPosition()
  const { workArea } = screen.getPrimaryDisplay()
  const newX = Math.max(workArea.x, Math.min(x + dx, workArea.x + workArea.width - 128))
  const newY = Math.max(workArea.y, Math.min(y + dy, workArea.y + workArea.height - 128))
  petWindow.setPosition(newX, newY)
})
```

### RESULT

- Code change compiles cleanly (`pnpm typecheck` passes).
- The root cause is confirmed by code review: `drag-move` IPC handler directly does `setPosition(x + dx, y + dy)` with no bounds check. Although `endDrag()` in the renderer does clamp after drag ends, two gaps exist:
  1. During the drag itself, the window is visually off-screen.
  2. If `mouseup` fails to fire (mouse leaves window boundary during fast drag), `endDrag()` never runs and the pet stays off-screen permanently.
- The fix adds `Math.max/Math.min` clamping using the live `screen.getPrimaryDisplay().workArea` (always fresh, no caching issue). The `screen` import already exists in the file.
- **CONFIRMED**: This is a real bug that can leave the pet off-screen after dragging.

## PROPOSAL No.3: Frame drop causes position overshoot [PENDING]

In `tick()`, velocity is applied (`s.x += s.vx`) then clamped. With `WALK_SPEED = 1.5` at 60fps this is fine. But `requestAnimationFrame` doesn't guarantee consistent timing — under system lag, the pet could overshoot boundaries before clamping corrects on the next frame. The visual result: pet briefly flickers at the edge.

This is lower-likelihood than Proposals 1 and 2.

### CODE CHANGE

Cap effective movement per frame in `src/renderer/src/pet/usePetPhysics.ts` `tick()`:

```typescript
const maxStep = WALK_SPEED * 2
s.x += Math.max(-maxStep, Math.min(s.vx, maxStep))
```

### RESULT

未测试（按用户要求跳过）。

# REPORT

## 问题根因

「宠物偶尔走出屏幕边界」由两个独立 bug 共同导致，任一都可单独触发此问题：

### Bug 1: WorkArea 缓存过期（Proposal No.1 — CONFIRMED）

- **位置**: `src/renderer/src/pet/usePetPhysics.ts`
- **原因**: `workAreaRef` 在 `useEffect` 初始化时获取一次，之后 `tick()` 循环中从不刷新。当用户改变显示分辨率、移动任务栏、或接入/断开外接显示器时，缓存的边界不再匹配实际屏幕。
- **触发条件**: 改分辨率、移动任务栏、插拔显示器。
- **修复**: 在 `tick()` 中每 ~2 秒异步刷新 `workAreaRef`。`getWorkArea()` IPC 开销极小。
- **影响范围**: 仅 `usePetPhysics.ts`，改动 3 行。

### Bug 2: 拖拽无边界检查（Proposal No.2 — CONFIRMED）

- **位置**: `src/main/index.ts` 的 `drag-move` IPC handler
- **原因**: `petWindow.setPosition(x + dx, y + dy)` 直接设置位置，无 clamp。虽然 `endDrag()` 会在松手后修正，但两个间隙导致问题：(1) 拖拽过程中宠物已经在屏幕外；(2) 如果 `mouseup` 丢失（快速拖出窗口边界），`endDrag()` 不会触发，宠物永久留在屏幕外。
- **触发条件**: 快速拖拽宠物到屏幕边缘。
- **修复**: 在 `drag-move` handler 中加 `Math.max/Math.min` 边界夹持，使用实时 `screen.getPrimaryDisplay().workArea`。
- **影响范围**: 仅 `index.ts`，改动 3 行。

### 未测试: 掉帧越界（Proposal No.3 — PENDING）

低概率问题。`WALK_SPEED = 1.5` px/frame，即使掉帧也只是 1-2 像素的瞬间越界，`clampToBounds` 会立即修正。若 Bug 1 和 Bug 2 修复后问题仍存在，再考虑。

## 推荐修复方案

**两个 bug 应同时修复**，它们是独立的代码路径，互不影响，且改动都很小：
- Bug 1: `usePetPhysics.ts` — 加 workArea 定时刷新（3 行）
- Bug 2: `index.ts` — 加拖拽边界夹持（3 行）

两处修复都已通过 `pnpm typecheck` 验证。

# !!!FINISHED!!!
