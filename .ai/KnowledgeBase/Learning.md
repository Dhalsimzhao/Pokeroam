# !!!LEARNING!!!

# Orders

- Use Playwright Electron support for runtime dimension debugging [1]
- Investigate visual symptoms by measuring, not guessing [1]

# Refinements

## Use Playwright Electron support for runtime dimension debugging

When debugging visual anomalies in Electron (windows growing, misaligned overlays, etc.), write a Playwright script that launches the app via `_electron.launch()` and periodically logs `window.innerWidth`, `document.documentElement.scrollWidth`, `BrowserWindow.getBounds()`, and `getContentSize()`. This reveals runtime dimension drift that is invisible in DevTools snapshots. The script `scripts/debug-pet-physics.mjs` is a working template.

## Investigate visual symptoms by measuring, not guessing

When a pet "runs off screen", the root cause might not be in the physics/boundary logic at all. The actual culprit was the BrowserWindow itself growing in size. Always verify assumptions about window dimensions with actual measurements before changing boundary-checking code. A Playwright monitoring script that samples dimensions over 20 seconds is more reliable than one-time DevTools inspection.
