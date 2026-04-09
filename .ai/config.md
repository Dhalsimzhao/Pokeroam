# Project Config — PokéRoam

> All paths in this file are relative to the repository root.

## Project Overview

PokéRoam is an Electron desktop pet app with two BrowserWindows (pet overlay + panel UI), built with TypeScript, electron-vite, and React.

Full game design: `docs/plans/2026-04-03-pokeroam-design.md`
Implementation plan: `docs/plans/2026-04-03-pokeroam-implementation.md`

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

## Code Conventions

- **Language**: TypeScript (strict mode)
- **Naming**: camelCase for variables/functions, PascalCase for types/components
- **UI text**: Chinese (`nameZh`) for display, English identifiers in code
- **Imports**: Use `@renderer` path alias for renderer-side imports
- **IPC**: Always go through preload bridge (`window.api`), update `env.d.ts` for types
- **Sprites**: From PMD Collab (`resources/sprites/`). Each species has PNG sheets + AnimData.xml parsed by `tools/generate-sprite-config.py` into `src/renderer/src/shared/sprite-config.ts`. Do NOT hand-edit sprite-config.ts — regenerate it.
- **Save file**: Lives at `~/.pokeroam/save.json`, managed by SaveManager.
- **Build**: `electron-vite` builds three targets (main/preload/renderer) with separate tsconfig files. The renderer config has a `@renderer` path alias.
- **Pet window**: Must re-apply `setAlwaysOnTop(true, 'screen-saver')` after every `show()` call.

- **Lint**: ESLint with light rules — no `any`, no unused vars, consistent imports. Don't over-restrict; keep it pragmatic.

## Accessing Task Documents

Task documents live in `.ai/TaskLogs/`:

| File | Purpose |
|------|---------|
| `Copilot_Scrum.md` | Task breakdown / scrum document |
| `Copilot_Task.md` | Architecture design document |
| `Copilot_Planning.md` | Implementation planning document |
| `Copilot_Execution.md` | Execution summary with code changes |
| `Copilot_Execution_Finding.md` | Findings from comparing user edits |
| `Copilot_Investigate.md` | Bug investigation document |
| `Copilot_KB.md` | Knowledge base draft document |
| `Copilot_Review.md` | Consolidated review feedback |

These are working documents managed by the workflow. Do NOT create them manually — they are created and archived by workflow scripts and prompts.

## Accessing Script Files

Helper scripts in `.ai/scripts/`:

- `prepare.sh` — Prepare, backup, and clean up task documents
  - No args: Clear all task documents for a fresh start
  - `--backup`: Archive current task documents to a timestamped backup folder in `.ai/Learning/`
  - `--earliest`: Print the path to the earliest unprocessed backup folder
- `prepare-review.sh` — Manage review board files
  - Renames `Copilot_Review_Writing_*.md` → `Copilot_Review_Finished_*.md`
  - Deletes old `Copilot_Review_Finished_*.md` before renaming

## External Tools Environment and Context

### Building

- Type check (preferred for validation): `pnpm typecheck`
  - Node side: `pnpm typecheck:node`
  - Web side: `pnpm typecheck:web`
- Full build: `pnpm build`
- Dev mode: `pnpm dev`
- Errors appear as TypeScript diagnostics in stderr. Check exit code for success/failure.

- Lint: `pnpm lint`

### Testing

- Unit test: `pnpm test` (vitest)
  - Run a single test: `pnpm test -- --filter "test name"`
  - Test files: `src/**/*.test.ts`, `src/**/*.test.tsx`
  - Failures show as FAIL lines with assertion diffs in output
- E2E test: `pnpm test:e2e` (Playwright + electron)
  - Test files: `e2e/**/*.spec.ts`
  - Failures show as step-by-step trace with screenshots

### Debugging

- **Main process**: Use `console.log()` or attach Node.js debugger
- **Renderer process**: Use Electron DevTools (automatically opens in dev mode)
- **Pet window**: Transparent/click-through — use main process logging or IPC to debug


### Code Generation

- Sprite config regeneration: `python tools/generate-sprite-config.py`
  - Parses `resources/sprites/*/AnimData.xml` into `src/renderer/src/shared/sprite-config.ts`
  - Do NOT hand-edit `sprite-config.ts` — always regenerate


## Leveraging the Knowledge Base

The knowledge base index is at `.ai/KnowledgeBase/Index.md`.

Organized by component. Each entry has:
- A descriptive title with bullet points covering key design decisions
- A link to a detailed document (API or Design explanation)

When working on a task:
1. Search the index for relevant topics
2. Read linked documents for detailed understanding
3. After completing work, identify what should be added or updated
