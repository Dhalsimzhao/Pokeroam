# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev mode (hot-reload)
pnpm build            # Build all targets (main + preload + renderer)
pnpm typecheck        # Run both node and web TypeScript checks
pnpm typecheck:node   # Check main + preload + shared (tsconfig.node.json)
pnpm typecheck:web    # Check renderer + shared (tsconfig.web.json)
pnpm pack             # Build + package into directory (no installer)
pnpm dist             # Build + create installer (NSIS + portable on Windows, DMG on macOS)
```

No test framework is configured. Validate changes with `pnpm typecheck`.

## Architecture

Electron app with two BrowserWindows, each with its own Vite entry point:

```
Main Process (src/main/)
  ├── pet-window: 128x128 transparent, frameless, always-on-top, click-through
  ├── panel-window: 800x600 standard frame, hidden on close
  └── managers: save, growth/XP, keyboard monitor, fatigue, daily reward, tray
         │
    IPC bridge (src/preload/index.ts) — context-isolated window.api
         │
Renderer (src/renderer/)
  ├── pet/ → pet.html: Physics sim, sprite animation, drag-drop
  └── panel/ → panel.html: Bedroom scene, starter select, PC, backpack, pokedex
         │
Shared (src/shared/)
  └── types.ts, pokemon-data.ts, item-data.ts, constants.ts
```

**IPC patterns** — all IPC goes through the preload bridge (`window.api`):
- **Push** (main → renderer): `webContents.send()` — pet-state-update, pet-level-up, pet-evolve, save-data-changed, fatigue-warning
- **Pull** (renderer → main): `ipcRenderer.invoke()` — getPetState, getSaveData, chooseStarter, releasePokemon, etc.
- **Fire-and-forget** (renderer → main): `ipcRenderer.send()` — setClickThrough, dragMove, setPetPosition, updateHitRegions

When adding new IPC: update `src/preload/index.ts`, `src/renderer/src/env.d.ts` (type), and the handler in `src/main/index.ts`.

**Pet window rendering pipeline**:
`usePetPhysics` (position/velocity/animState) → `useIdleEvents` (random override) → `getSpriteConfig` (lookup sheet) → `useAnimationLoop` (frame cycling) → `SpriteCanvas` (canvas 2D draw)

Physics tick runs via `requestAnimationFrame` and only starts after `getWorkArea()` resolves. Position is set via `setPetPosition` IPC each frame.

**Click-through on Windows**: Main process polls cursor position at 16ms intervals against hit regions reported by pet renderer every 500ms. Toggles `setIgnoreMouseEvents` based on overlap.

## Key Conventions

- Sprites are from PMD Collab (resources/sprites/). Each species has PNG sheets + AnimData.xml parsed by `tools/generate-sprite-config.py` into `src/renderer/src/shared/sprite-config.ts`. Do not hand-edit sprite-config.ts — regenerate it.
- Save file lives at `~/.pokeroam/save.json`, managed by SaveManager.
- Chinese names (`nameZh`) are used in UI display. Species/item data in `src/shared/` has both English and Chinese names.
- `electron-vite` builds three targets (main/preload/renderer) with separate tsconfig files. The renderer config has a `@renderer` path alias.
- Pet window must re-apply `setAlwaysOnTop(true, 'screen-saver')` after every `show()` call.

## Design Document

Full game design: `docs/plans/2026-04-03-pokeroam-design.md`
Implementation plan: `docs/plans/2026-04-03-pokeroam-implementation.md`
