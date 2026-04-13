# Design Explanation — Pet Window Position Management

## Overview

The pet window is a 128x128 transparent, frameless, always-on-top BrowserWindow that follows the desktop pet as it walks along the bottom of the screen. Position updates originate from the renderer's physics engine and are applied to the BrowserWindow via IPC.

## Position Update Pipeline

1. `usePetPhysics` (renderer) — runs a `requestAnimationFrame` loop computing x/y position
2. `window.api.setPetPosition(x, y)` — fires IPC to main process
3. `set-pet-position` handler (main) — clamps coordinates to work area, calls `setBounds()`
4. `drag-move` handler (main) — applies delta during user drag, calls `setBounds()`
5. `startBoundsCheck()` (main) — periodic 5-second safety net, calls `setBounds()`

## Critical Constraint: `setBounds()` Not `setPosition()`

On Windows, transparent frameless BrowserWindows have a platform bug where `setPosition()` causes the window width to grow by ~0.5px per call. At 60fps this means ~30px/second of unbounded width growth.

**All position updates must use `setBounds()` with explicit width and height:**

```typescript
// CORRECT — forces size restoration every frame
petWindow.setBounds({ x, y, width: 128, height: 128 })

// WRONG — causes width growth on Windows
petWindow.setPosition(x, y)
```

This applies to all three call sites:
- `set-pet-position` IPC handler (physics tick, ~60Hz)
- `drag-move` IPC handler (drag operations)
- `startBoundsCheck()` interval (5-second safety net)

## Boundary Clamping

Position clamping happens at two levels:

1. **Renderer-side** (`clampToBounds` in `usePetPhysics`): reverses velocity when hitting screen edges, keeps physics simulation in bounds
2. **Main-side** (`set-pet-position` handler): `Math.max/Math.min` clamp to `workArea` boundaries before applying to BrowserWindow

The `startBoundsCheck()` interval provides a safety net that pulls the pet back if it somehow escapes (e.g., display configuration change).

## Click-Through Mechanism

The pet window uses `setIgnoreMouseEvents(true, { forward: true })` by default. A 16ms polling interval in `startClickThroughPolling()` checks cursor position against hit regions reported by the renderer every 500ms. This is Windows-specific (`process.platform === 'win32'` guard).

## Debug Tooling

- **Tray menu toggle**: Debug overlay in the pet window showing animation state, direction, velocity, position, grounded status
- **Playwright script** (`scripts/debug-pet-physics.mjs`): Monitors `window.innerWidth`, `document.documentElement.scrollWidth`, `BrowserWindow.getBounds()`, and `getContentSize()` to detect dimension drift
