# !!!SCRUM!!!

# DESIGN REQUEST

修复宠物走出屏幕边界的 bug。根据调查报告（Copilot_Investigate.md），确认两个独立根因：
1. WorkArea 缓存过期：`usePetPhysics.ts` 中 `workAreaRef` 仅在初始化时获取一次，显示器变化后边界失效。
2. 拖拽无边界检查：`index.ts` 的 `drag-move` IPC handler 直接 `setPosition(x+dx, y+dy)` 无 clamp，快速拖拽或 mouseup 丢失时宠物出界。

# UPDATES

# TASKS

- [ ] TASK No.1: Add periodic workArea refresh in physics tick
- [ ] TASK No.2: Add boundary clamping to drag-move IPC handler

## TASK No.1: Add periodic workArea refresh in physics tick

The pet physics loop in `usePetPhysics.ts` fetches `workArea` once during `useEffect` initialization and stores it in `workAreaRef`. The `tick()` function uses this cached value for boundary clamping every frame, but never refreshes it. When the display environment changes (resolution change, taskbar repositioned, monitor connected/disconnected), the cached bounds become stale and the pet clamps to a phantom boundary that no longer matches the actual screen.

The fix adds a lightweight periodic refresh: every ~120 frames (~2 seconds at 60fps), `tick()` asynchronously fetches fresh workArea via `window.api.getWorkArea()` and updates `workAreaRef`. The IPC call is cheap (just returns `screen.getPrimaryDisplay().workArea` from main process) and the async nature means it won't block the animation frame.

### what to be done

- In `src/renderer/src/pet/usePetPhysics.ts`, inside the `tick()` function, add a frame counter check that calls `window.api.getWorkArea()` every 120 frames and updates `workAreaRef.current` with the result.
- The existing `frameCount` variable (already present at line 48) can be reused for this purpose.

### rationale

- This is the higher-likelihood root cause. Any user who changes their display setup while PokéRoam is running will hit this bug.
- The fix is minimal (3 lines) and has negligible performance impact — one async IPC call every 2 seconds.
- This task should come first because it addresses the more common trigger scenario (display changes happen more often than mouseup-loss during drag).
- Evidence: `usePetPhysics.ts` line 124 — `workAreaRef` is set once in `getWorkArea().then()`. The `tick()` function (line 79-121) reads `workAreaRef.current` every frame but never writes to it. Only `endDrag()` (line 154) also refreshes it, but that only runs after a drag operation.

## TASK No.2: Add boundary clamping to drag-move IPC handler

The `drag-move` IPC handler in the main process (`src/main/index.ts`) directly calculates `x + dx, y + dy` and calls `petWindow.setPosition()` without any bounds checking. While the renderer's `endDrag()` function does clamp after the drag ends, two failure modes exist: (1) during the drag itself the window is visually off-screen, and (2) if `mouseup` fails to fire (mouse exits the 128x128 window boundary during fast drag), `endDrag()` never executes and the pet stays off-screen permanently.

The fix adds `Math.max/Math.min` clamping in the main process handler using the live `screen.getPrimaryDisplay().workArea` (always fresh, no caching concern since this runs in main process with direct access to `screen`).

### what to be done

- In `src/main/index.ts`, modify the `drag-move` IPC handler to clamp the new position within `screen.getPrimaryDisplay().workArea` bounds before calling `petWindow.setPosition()`.
- The `screen` import already exists at line 1 of the file.

### rationale

- This is the secondary root cause but produces the most severe symptom: the pet can be permanently stuck off-screen with no self-recovery.
- The fix is minimal (3 lines changed within the existing handler) and has no performance concern — `screen.getPrimaryDisplay()` is synchronous and fast in the main process.
- This task comes second because it's a less common trigger (requires specific mouse behavior) but has worse consequences.
- Evidence: `index.ts` lines 362-366 — `petWindow.setPosition(x + dx, y + dy)` with no bounds check. Compare with `set-pet-position` handler (line 352) which also has no clamp but is protected by the renderer's `clampToBounds()` in the tick loop.

# Impact to the Knowledge Base

## Main Process

The investigation revealed important details about the pet window position management architecture — how `workArea` is cached vs live-fetched, the split between renderer-side clamping (tick loop) and main-process-side positioning (IPC handlers), and the drag flow across processes. Once these fixes are implemented, a knowledge base entry about Pet Window Position Management would help future work understand this design.

# !!!FINISHED!!!
