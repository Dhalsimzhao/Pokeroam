# !!!EXECUTION!!!

# UPDATES

# AFFECTED PROJECTS

- Type check: `pnpm typecheck`
- No tests configured yet — skip test step.

# EXECUTION PLAN

## Step 1. Add periodic workArea refresh in usePetPhysics.ts [DONE]

**File**: `src/renderer/src/pet/usePetPhysics.ts`
**Location**: Inside `tick()` function, after `frameCount++` and before the `if (s.grounded)` block.

Add workArea refresh every ~120 frames:

```typescript
      // Refresh workArea every ~2 seconds to handle display changes
      if (frameCount % 120 === 0) {
        window.api.getWorkArea().then((freshWa) => {
          workAreaRef.current = freshWa
        })
      }
```

## Step 2. ~~Add boundary clamping to drag-move IPC handler~~ → Add periodic bounds safety net [DONE]

**Original plan**: Clamp position in `drag-move` handler. **Reverted** — caused pet to stop mid-screen during drag (likely DPI scaling coordinate mismatch between `screen.getPrimaryDisplay().workArea` and `petWindow.getPosition()`).

**Revised approach**: Add a periodic bounds check (every 5 seconds) in main process that pulls an off-screen pet back. Does not interfere with drag.

**File**: `src/main/index.ts`

```typescript
function startBoundsCheck(): void {
  setInterval(() => {
    if (!petWindow) return
    const [x, y] = petWindow.getPosition()
    const { workArea } = screen.getPrimaryDisplay()
    const maxX = workArea.x + workArea.width - 128
    const maxY = workArea.y + workArea.height - 128
    if (x < workArea.x || x > maxX || y < workArea.y || y > maxY) {
      const newX = Math.max(workArea.x, Math.min(x, maxX))
      const newY = Math.max(workArea.y, Math.min(y, maxY))
      petWindow.setPosition(newX, newY)
    }
  }, 5000)
}
```

Called from `app.whenReady()` alongside `startClickThroughPolling()`.

# !!!VERIFIED!!!
