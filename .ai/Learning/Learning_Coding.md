# !!!LEARNING!!!

# Orders

- Electron transparent window: use setBounds() not setPosition() on Windows [1]
- React animation sync: dual ref/state pattern for frame-critical rendering [1]
- Auto-download portraits when adding new Pokémon species [1]
- Debug overlay in constrained windows: must set overflow:hidden on all ancestors [1]

# Refinements

## Electron transparent window: use setBounds() not setPosition() on Windows

On Windows, calling `BrowserWindow.setPosition()` on a transparent frameless window causes the width to grow by ~0.5px per call. At 60fps this means ~30px/second of unbounded growth. Always use `setBounds({ x, y, width, height })` to force size restoration. This applies to every call site that moves the window: physics ticks, drag handlers, and periodic checks.

## React animation sync: dual ref/state pattern for frame-critical rendering

When a value is both read in `requestAnimationFrame` callbacks (needs immediate access) and drives React re-renders (needs state), maintain two copies: a `useRef` for the RAF loop and a `useState` for the component tree. Only call the state setter when the value actually changes to avoid unnecessary re-renders. Example: `facingLeftRef` (immediate, for canvas) + `facingLeft` state (for React).

## Auto-download portraits when adding new Pokémon species

When adding a new Pokémon species to `POKEMON_SPECIES` in `src/shared/pokemon-data.ts`, the corresponding PMD Collab portrait images must also be downloaded. Run `python tools/download-portraits.py` after adding the species entry — the script reads from a hardcoded `SPECIES` dict mapping lowercase name → Pokédex number (zero-padded 4-digit). Steps: (1) add species to `pokemon-data.ts`, (2) add its `name.lower(): "XXXX"` entry to `tools/download-portraits.py` `SPECIES` dict, (3) run the script to download all 16 emotion PNGs to `resources/portraits/{name}/`. The script skips already-downloaded files and tolerates 404s (some species lack certain emotions in PMD Collab). Sprites (`resources/sprites/`) also need AnimData.xml + sheet PNGs with `python tools/generate-sprite-config.py` regeneration — portrait download is an additional step that's easy to forget.

## Debug overlay in constrained windows: must set overflow:hidden on all ancestors

In a fixed-size window (e.g., 128x128 pet window), any text content that overflows will expand the document layout, which on Windows transparent windows can trigger additional BrowserWindow size growth. Set `overflow: hidden` on the container, body, html, and `#root` to prevent this cascade.
