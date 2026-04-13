# !!!KNOWLEDGE BASE!!!

# DESIGN REQUEST

Electron transparent window on Windows: calling `setPosition()` repeatedly causes the window to grow in width unboundedly. This was the root cause of the pet running off screen. The fix is to use `setBounds()` with explicit width/height instead.

# INSIGHT

## The Bug: `setPosition()` on Transparent Windows Grows Width

On Windows, Electron transparent frameless windows (`transparent: true, frame: false`) have a platform bug: each call to `BrowserWindow.setPosition(x, y)` increases the window's width by ~0.5px. Over time this causes unbounded growth.

### Entry Point

The pet renderer's physics loop (`usePetPhysics`) calls `window.api.setPetPosition(s.x, s.y)` every `requestAnimationFrame` tick (~60fps). The main process handler in `index.ts` receives this and calls `petWindow.setPosition(clampedX, clampedY)`.

### Core Problem

Three call sites in the main process used `setPosition()`:

1. **`set-pet-position` IPC handler** — called every animation frame by the physics engine (~60Hz)
2. **`drag-move` IPC handler** — called during user drag operations
3. **`startBoundsCheck()` interval** — periodic safety net every 5 seconds

At 60fps, the window grew at ~30px/second. After 20 seconds, a 128px window expanded to 854px.

### Why It Causes "Running Off Screen"

The sprite is rendered at 128x128 within the expanding window. As the BrowserWindow grows beyond 128px, the coordinate system drifts: the physical window extends rightward while the sprite stays at its original position within the content. The boundary detection (`clampToBounds`) uses `workArea.width - WINDOW_SIZE` where `WINDOW_SIZE` is the constant 128, but the actual BrowserWindow is now much wider, causing the pet to visually escape the screen edge.

### Evidence via Playwright

A debug script (`scripts/debug-pet-physics.mjs`) using Playwright's Electron support monitored `window.innerWidth` and `BrowserWindow.getBounds().width` every second:

- Before fix: width grew from 128px → 854px in 20 seconds (linear growth)
- After fix: width stayed stable at 128-129px (1px jitter from DPI rounding)

### The Fix: `setBounds()` with Explicit Dimensions

Replace all `setPosition()` calls with `setBounds({ x, y, width: 128, height: 128 })`. This forces the window size back to the correct dimensions every frame, counteracting the platform bug.

### Platform Scope

This bug is specific to Windows. The `startClickThroughPolling()` function already checks `process.platform !== 'win32'`, indicating other Windows-specific behaviors exist. macOS transparent windows do not exhibit this growth behavior.

# ASKS

# DRAFT

## DRAFT REQUEST

Write a design explanation for the pet window position management system, covering the transparent window bug and its fix.

## IMPROVEMENTS

## DESIGN EXPLANATION (Pet Window Position Management)

## DOCUMENT

### Overview

The pet window is a 128x128 transparent, frameless, always-on-top BrowserWindow that follows the desktop pet as it walks along the bottom of the screen. Position updates originate from the renderer's physics engine and are applied to the BrowserWindow via IPC.

### Position Update Pipeline

1. `usePetPhysics` (renderer) — runs a `requestAnimationFrame` loop computing x/y position
2. `window.api.setPetPosition(x, y)` — fires IPC to main process
3. `set-pet-position` handler (main) — clamps coordinates to work area, calls `setBounds()`
4. `drag-move` handler (main) — applies delta during user drag, calls `setBounds()`
5. `startBoundsCheck()` (main) — periodic 5-second safety net, calls `setBounds()`

### Critical Constraint: `setBounds()` Not `setPosition()`

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

### Boundary Clamping

Position clamping happens at two levels:

1. **Renderer-side** (`clampToBounds` in `usePetPhysics`): reverses velocity when hitting screen edges, keeps physics simulation in bounds
2. **Main-side** (`set-pet-position` handler): `Math.max/Math.min` clamp to `workArea` boundaries before applying to BrowserWindow

The `startBoundsCheck()` interval provides a safety net that pulls the pet back if it somehow escapes (e.g., display configuration change).

### Click-Through Mechanism

The pet window uses `setIgnoreMouseEvents(true, { forward: true })` by default. A 16ms polling interval in `startClickThroughPolling()` checks cursor position against hit regions reported by the renderer every 500ms. This is Windows-specific (`process.platform === 'win32'` guard).

### Debug Tooling

- **Tray menu toggle**: Debug overlay in the pet window showing animation state, direction, velocity, position, grounded status
- **Playwright script** (`scripts/debug-pet-physics.mjs`): Monitors `window.innerWidth`, `document.documentElement.scrollWidth`, `BrowserWindow.getBounds()`, and `getContentSize()` to detect dimension drift
