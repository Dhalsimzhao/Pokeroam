# PokéRoam Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Pokémon desktop pet game with nurturing + companion gameplay, where Pokémon roam the desktop, gain XP, level up, and evolve.

**Architecture:** Electron + electron-vite + React + TypeScript. Two windows: a transparent always-on-top pet window (Canvas sprite rendering) and a bedroom-scene main panel (React UI). Data persisted as JSON. Global keyboard monitoring via node-global-key-listener. Sprite assets from PMD Collab.

**Tech Stack:** Electron 33, electron-vite 3, React 18, TypeScript 5, node-global-key-listener, pnpm

**Reference Codebase:** `D:/dev/claude-detector/` — reuse its transparent window, sprite rendering, click-through, and drag patterns.

---

## Phase 1: Project Foundation

### Task 1: Scaffold Electron Project

**Files:**
- Create: `D:/dev/PokéRoam/package.json`
- Create: `D:/dev/PokéRoam/electron.vite.config.ts`
- Create: `D:/dev/PokéRoam/tsconfig.json`
- Create: `D:/dev/PokéRoam/tsconfig.node.json`
- Create: `D:/dev/PokéRoam/tsconfig.web.json`
- Create: `D:/dev/PokéRoam/.npmrc`
- Create: `D:/dev/PokéRoam/.gitignore`

**Step 1: Initialize git repo**

```bash
cd "D:/dev/PokéRoam"
git init
```

**Step 2: Create package.json**

Model after `D:/dev/claude-detector/package.json`. Key differences:
- Name: `pokeroam`
- Description: `Pokémon desktop pet game`
- Remove `express` dependency (no hook server needed)
- Add `node-global-key-listener` dependency
- Keep same Electron, React, electron-vite, TypeScript versions

**Step 3: Create electron.vite.config.ts**

Copy from `D:/dev/claude-detector/electron.vite.config.ts` — identical config (main externalize, preload externalize, renderer with React plugin + `@renderer` alias).

**Step 4: Create TypeScript configs**

Copy all three tsconfig files from claude-detector. Identical setup:
- `tsconfig.json` — project references
- `tsconfig.node.json` — main + preload (extends `@electron-toolkit/tsconfig/tsconfig.node.json`)
- `tsconfig.web.json` — renderer React (extends `@electron-toolkit/tsconfig/tsconfig.web.json`, JSX react-jsx, `@renderer/*` alias)

**Step 5: Create .npmrc and .gitignore**

- `.npmrc`: copy from claude-detector
- `.gitignore`: `node_modules/`, `out/`, `release/`, `dist/`

**Step 6: Install dependencies**

```bash
cd "D:/dev/PokéRoam"
pnpm install
```

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold electron-vite project"
```

---

### Task 2: Shared Types & Pokémon Data

**Files:**
- Create: `src/shared/types.ts`
- Create: `src/shared/pokemon-data.ts`
- Create: `src/shared/item-data.ts`
- Create: `src/shared/constants.ts`

**Step 1: Define core types in `src/shared/types.ts`**

```typescript
// ---- Save Data ----
export interface SaveData {
  player: PlayerData
  pokemon: OwnedPokemon[]
  activePokemonId: string | null
  backpack: BackpackItem[]
  pokedex: number[] // national dex numbers of seen/caught
}

export interface PlayerData {
  createdAt: string   // ISO date
  lastLogin: string   // ISO date
  lastDailyReward: string // ISO date (date only, e.g. "2026-04-03")
}

export interface OwnedPokemon {
  id: string           // UUID
  speciesId: number    // national dex number
  nickname: string | null
  level: number
  exp: number
  heldItemId: string | null
}

export interface BackpackItem {
  itemId: string
  quantity: number
}

// ---- Species Data ----
export interface PokemonSpecies {
  id: number           // national dex number
  name: string         // English name
  nameZh: string       // Chinese name
  types: PokemonType[]
  baseExp: number      // base experience yield
  expGroup: ExpGroup   // experience growth rate group
  evolvesFrom: number | null       // species ID it evolves from
  evolutionLevel: number | null    // level at which it evolves (null if item/trade/etc)
  evolutionItem: string | null     // item needed to evolve (e.g. "thunder-stone" for Jolteon)
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric'
  | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
  | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon'
  | 'fairy'

export type ExpGroup =
  | 'fast' | 'medium-fast' | 'medium-slow' | 'slow'

// ---- Item Data ----
export interface ItemDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  category: 'food' | 'equipment' | 'ball'
  holdable: boolean    // can a Pokémon hold this?
}

// ---- Sprite System ----
export interface SpriteSheetConfig {
  src: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  durations: number[]  // ticks per frame (1 tick ≈ 1/60s)
}

export type PetAnimState =
  | 'idle' | 'walk' | 'sleep' | 'happy' | 'eat'
  | 'levelup' | 'evolve' | 'dragging' | 'falling'

export interface PokemonSpriteSet {
  [key: string]: SpriteSheetConfig // keyed by PetAnimState
}

// ---- IPC Events ----
export interface PetWindowState {
  speciesId: number
  level: number
  animState: PetAnimState
  facingLeft: boolean
}

// ---- Daily Reward ----
export type RewardType = 'pokemon' | 'item'
export interface DailyReward {
  type: RewardType
  pokemonSpeciesId?: number
  items?: BackpackItem[]
}
```

**Step 2: Create Pokémon data in `src/shared/pokemon-data.ts`**

Define the 10 evolution lines (~27 species). Reference Pokémon wiki for accurate data.
Include: id, name, nameZh, types, baseExp, expGroup, evolvesFrom, evolutionLevel, evolutionItem.

Key data points:
| Species | Dex# | Evolution | Level/Item |
|---------|------|-----------|------------|
| Bulbasaur | 1 | → Ivysaur | Lv.16 |
| Ivysaur | 2 | → Venusaur | Lv.32 |
| Venusaur | 3 | — | — |
| Charmander | 4 | → Charmeleon | Lv.16 |
| Charmeleon | 5 | → Charizard | Lv.36 |
| Charizard | 6 | — | — |
| Squirtle | 7 | → Wartortle | Lv.16 |
| Wartortle | 8 | → Blastoise | Lv.36 |
| Blastoise | 9 | — | — |
| Pichu | 172 | → Pikachu | Happiness (use Lv.15 for simplicity) |
| Pikachu | 25 | → Raichu | Thunder Stone |
| Raichu | 26 | — | — |
| Psyduck | 54 | → Golduck | Lv.33 |
| Golduck | 55 | — | — |
| Slowpoke | 79 | → Slowbro | Lv.37 |
| Slowbro | 80 | — | — |
| Gastly | 92 | → Haunter | Lv.25 |
| Haunter | 93 | → Gengar | Trade (use Lv.38 for simplicity) |
| Gengar | 94 | — | — |
| Jigglypuff | 39 | → Wigglytuff | Moon Stone |
| Wigglytuff | 40 | — | — |
| Eevee | 133 | → Vaporeon/Jolteon/Flareon | Water/Thunder/Fire Stone |
| Vaporeon | 134 | — | — |
| Jolteon | 135 | — | — |
| Flareon | 136 | — | — |

All Gen1 starters and Psyduck/Slowpoke/Gastly use `medium-slow` exp group.
Pikachu line uses `medium-fast`. Eevee line uses `medium-fast`. Jigglypuff uses `fast`.

Include a helper: `getExpForLevel(group: ExpGroup, level: number): number` using the standard Pokémon formulas:
- Fast: `0.8 * n^3`
- Medium-Fast: `n^3`
- Medium-Slow: `1.2 * n^3 - 15 * n^2 + 100 * n - 140`
- Slow: `1.25 * n^3`

Also include: `getSpeciesById(id)`, `getEvolutionChain(id)`, `canEvolve(pokemon, backpack)`.

**Step 3: Create item data in `src/shared/item-data.ts`**

First version items:
```typescript
export const ITEMS: ItemDefinition[] = [
  { id: 'moomoo-milk', name: 'Moomoo Milk', nameZh: '哞哞牛奶', description: 'Heals and makes Pokémon happy', category: 'food', holdable: false },
  { id: 'rare-candy', name: 'Rare Candy', nameZh: '神奇糖果', description: 'Instantly raises level by 1', category: 'food', holdable: false },
  { id: 'exp-share', name: 'Exp. Share', nameZh: '学习装置', description: 'Holder gains same XP as active Pokémon', category: 'equipment', holdable: true },
  { id: 'fire-stone', name: 'Fire Stone', nameZh: '火之石', description: 'Evolves certain Pokémon', category: 'equipment', holdable: false },
  { id: 'water-stone', name: 'Water Stone', nameZh: '水之石', description: 'Evolves certain Pokémon', category: 'equipment', holdable: false },
  { id: 'thunder-stone', name: 'Thunder Stone', nameZh: '雷之石', description: 'Evolves certain Pokémon', category: 'equipment', holdable: false },
  { id: 'moon-stone', name: 'Moon Stone', nameZh: '月之石', description: 'Evolves certain Pokémon', category: 'equipment', holdable: false },
]
```

**Step 4: Create constants in `src/shared/constants.ts`**

```typescript
export const IDLE_XP_PER_MINUTE = 2        // XP gained per minute while idle
export const KEYBOARD_XP_PER_KEYSTROKE = 1  // XP per keystroke detected
export const KEYBOARD_XP_COOLDOWN_MS = 500  // Min interval between XP-granting keystrokes
export const FATIGUE_ACTIVE_MINUTES = 45    // Minutes of continuous typing before fatigue warning
export const FATIGUE_BREAK_MINUTES = 5      // Minutes of no typing to reset fatigue
export const DAILY_REWARD_HOUR = 8          // 8 AM
export const MAX_LEVEL = 100
export const SAVE_DIR = '.pokeroam'         // In user home directory
export const SAVE_FILE = 'save.json'
export const STARTER_SPECIES = [1, 4, 7]    // Bulbasaur, Charmander, Squirtle
```

**Step 5: Commit**

```bash
git add src/shared/
git commit -m "feat: add shared types, Pokémon data, item data, and constants"
```

---

### Task 3: Save/Load System

**Files:**
- Create: `src/main/save-manager.ts`

**Step 1: Implement SaveManager**

```typescript
// Reads/writes ~/.pokeroam/save.json
// Methods:
//   load(): SaveData | null — returns null if no save exists (first launch)
//   save(data: SaveData): void — write to disk
//   createNewSave(starterSpeciesId: number): SaveData — create fresh save after starter selection
//   getPath(): string — resolve save file path
```

Key behaviors:
- Use `app.getPath('home')` + `SAVE_DIR` + `SAVE_FILE`
- `fs.mkdirSync` with `recursive: true` on first save
- Write with `JSON.stringify(data, null, 2)` for readability
- `load()` uses `try/catch` — corrupted file returns null (treat as fresh start)
- Auto-generate UUID for new Pokémon instances using `crypto.randomUUID()`

**Step 2: Commit**

```bash
git add src/main/save-manager.ts
git commit -m "feat: add JSON save/load manager"
```

---

### Task 4: Main Process & Pet Window

**Files:**
- Create: `src/main/index.ts`
- Create: `src/main/pet-window.ts`
- Create: `src/main/panel-window.ts`
- Create: `src/preload/index.ts`
- Create: `src/renderer/index.html`
- Create: `src/renderer/src/main.tsx`
- Create: `src/renderer/src/App.tsx`
- Create: `src/renderer/src/env.d.ts`

**Step 1: Create preload bridge (`src/preload/index.ts`)**

Reference: `D:/dev/claude-detector/src/preload/index.ts`

Expose API surface for PokéRoam:
```typescript
window.api = {
  platform: process.platform,

  // Pet window
  onPetStateUpdate: (cb) => onIpc('pet-state-update', cb),
  onDragChange: (cb) => onIpc('drag-change', cb),
  setClickThrough: (ignore) => ipcRenderer.send('set-click-through', ignore),
  dragMove: (dx, dy) => ipcRenderer.send('drag-move', dx, dy),
  updateHitRegions: (regions) => ipcRenderer.send('update-hit-regions', regions),

  // Panel window
  getSaveData: () => ipcRenderer.invoke('get-save-data'),
  chooseStarter: (speciesId) => ipcRenderer.invoke('choose-starter', speciesId),
  releasePokemon: (pokemonId) => ipcRenderer.invoke('release-pokemon', pokemonId),
  recallPokemon: () => ipcRenderer.invoke('recall-pokemon'),
  equipItem: (pokemonId, itemId) => ipcRenderer.invoke('equip-item', pokemonId, itemId),
  unequipItem: (pokemonId) => ipcRenderer.invoke('unequip-item', pokemonId),
  useItem: (itemId, pokemonId) => ipcRenderer.invoke('use-item', itemId, pokemonId),
  claimDailyReward: () => ipcRenderer.invoke('claim-daily-reward'),
  onSaveDataChanged: (cb) => onIpc('save-data-changed', cb),

  // Window management
  openPanel: () => ipcRenderer.send('open-panel'),
}
```

**Step 2: Create pet window manager (`src/main/pet-window.ts`)**

Reference: `D:/dev/claude-detector/src/main/index.ts` (window creation + click-through polling)

- Create transparent, frameless, always-on-top BrowserWindow
- Size: 128×128 initially (sprite display area)
- Position: bottom-right of screen, above taskbar (`screen.getPrimaryDisplay().workArea`)
- `skipTaskbar: true`, `hasShadow: false`
- Windows click-through: cursor polling at 16ms interval (same pattern as claude-detector)
- macOS click-through: via renderer `set-click-through` IPC
- Drag handling: `drag-move` IPC updates window position

**Step 3: Create panel window manager (`src/main/panel-window.ts`)**

- Separate BrowserWindow for the bedroom scene panel
- NOT transparent, has frame, resizable
- Size: ~800×600
- Opens centered on screen
- Hidden by default, shown via tray or pet right-click
- Loads a separate renderer entry point (or same entry with route param)

Note: electron-vite supports multiple renderer entry points. Configure in `electron.vite.config.ts`:
```typescript
renderer: {
  build: {
    rollupOptions: {
      input: {
        pet: resolve(__dirname, 'src/renderer/pet.html'),
        panel: resolve(__dirname, 'src/renderer/panel.html'),
      }
    }
  }
}
```

**Step 4: Create main process entry (`src/main/index.ts`)**

Reference: `D:/dev/claude-detector/src/main/index.ts`

- `app.whenReady()` → create pet window + load save data + set up tray
- Register IPC handlers for all `invoke` calls from preload
- Game loop: `setInterval` every 60s for idle XP tick
- Save data changes → notify both windows via `save-data-changed` IPC
- `app.on('window-all-closed')` → don't quit (tray app stays alive)

**Step 5: Create renderer entry files**

- `src/renderer/pet.html` — transparent background (`background: transparent`), loads pet React app
- `src/renderer/panel.html` — normal background, loads panel React app
- `src/renderer/src/pet/main.tsx` — React entry for pet window
- `src/renderer/src/pet/App.tsx` — Pet window root (sprite canvas only)
- `src/renderer/src/panel/main.tsx` — React entry for panel window
- `src/renderer/src/panel/App.tsx` — Panel window root (bedroom scene)
- `src/renderer/src/env.d.ts` — `window.api` type definitions

**Step 6: Verify app launches**

```bash
cd "D:/dev/PokéRoam"
pnpm dev
```

Expected: transparent pet window appears at bottom-right with placeholder content. Panel window hidden.

**Step 7: Commit**

```bash
git add src/ electron.vite.config.ts
git commit -m "feat: add main process, pet window, panel window, preload bridge"
```

---

## Phase 2: Desktop Pet Core

### Task 5: Sprite Rendering System

**Files:**
- Create: `src/renderer/src/pet/SpriteCanvas.tsx`
- Create: `src/renderer/src/pet/useAnimationLoop.ts`
- Create: `src/renderer/src/shared/sprite-config.ts`

**Step 1: Port sprite canvas from claude-detector**

Reference: `D:/dev/claude-detector/src/renderer/src/components/PetSprite.tsx`

Create `SpriteCanvas.tsx`:
- Props: `spriteConfig: SpriteSheetConfig`, `facingLeft: boolean`, `scale?: number`
- Canvas element with `imageRendering: 'pixelated'`
- Load sprite sheet image, draw current frame using `drawImage()`
- Flip horizontally via `ctx.scale(-1, 1)` when `facingLeft`

Create `useAnimationLoop.ts`:
- Tick-based animation system (same as claude-detector)
- Input: `SpriteSheetConfig`
- Output: `{ frameIndex: number }`
- Uses `requestAnimationFrame` with tick counting

**Step 2: Create initial sprite config for one Pokémon (Charmander for testing)**

In `src/renderer/src/shared/sprite-config.ts`:
- Download Charmander sprite sheets from PMD Collab
- Place in `resources/sprites/charmander/`
- Define `SpriteSheetConfig` for at least: `idle`, `walk`
- PMD Collab format: each action is a separate PNG sprite sheet, frames in a grid
- Need to parse PMD Collab's `AnimData.xml` for frame dimensions and timing

**Step 3: Display Charmander idle animation in pet window**

Wire `SpriteCanvas` into `src/renderer/src/pet/App.tsx`. Verify animation plays.

**Step 4: Commit**

```bash
git add src/renderer/ resources/sprites/
git commit -m "feat: add Canvas sprite rendering system with Charmander test"
```

---

### Task 6: Desktop Walking & Physics

**Files:**
- Create: `src/renderer/src/pet/usePetPhysics.ts`
- Create: `src/renderer/src/pet/usePetDrag.ts`
- Modify: `src/renderer/src/pet/App.tsx`
- Modify: `src/main/pet-window.ts`

**Step 1: Implement walking physics (`usePetPhysics.ts`)**

```typescript
// State: { x, y, vx, vy, grounded, animState }
// Behavior:
//   - When grounded: walk left/right at constant speed
//   - Random direction changes every 3-8 seconds
//   - Random pauses (switch to idle) for 2-5 seconds
//   - Clamp X to screen bounds (0 to workArea.width - spriteWidth)
//   - Y fixed at bottom when grounded
//   - When not grounded: apply gravity (vy += 0.5 per frame), update Y
//   - Landing: when Y reaches bottom, set grounded = true, switch to idle briefly
```

Physics loop runs in `requestAnimationFrame`, updates pet window position via IPC.

**Step 2: Implement drag system (`usePetDrag.ts`)**

Reference: `D:/dev/claude-detector/src/renderer/src/hooks/usePetDrag.ts`

- `mousedown` on pet → start drag, set animState to `dragging`
- `mousemove` → send `drag-move` IPC to move window
- `mouseup` → release, set `grounded = false`, animState to `falling`
- Gravity kicks in, pet falls back to screen bottom

**Step 3: Wire physics into pet window App**

- `usePetPhysics` drives position + animState
- `usePetDrag` overrides position during drag
- AnimState determines which sprite config to use (idle/walk/dragging/falling)
- Pet window moves with the sprite (main process updates window position)

**Step 4: Implement click-through**

Reference: `D:/dev/claude-detector/src/renderer/src/hooks/useClickThrough.ts`

Port the Windows cursor-polling and macOS element-detection patterns. The hit region is the sprite canvas bounding rect.

**Step 5: Verify**

```bash
pnpm dev
```

Expected: Pokémon walks left/right at screen bottom. Can be dragged and dropped. Falls back down with gravity.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add desktop walking, drag & drop, gravity physics"
```

---

### Task 7: System Tray

**Files:**
- Create: `src/main/tray-manager.ts`
- Create or obtain: `resources/icon.ico` (Windows), `resources/icon.png` (macOS)

**Step 1: Implement tray manager**

Reference: `D:/dev/claude-detector/src/main/trayManager.ts`

Context menu items:
- **Open PokéRoam** → show panel window (bedroom scene)
- **Separator**
- **Quit** → `app.quit()`

Tray icon: use a Poké Ball icon (create simple 16×16 placeholder, replace with proper art later).

Left-click (Windows) / click (macOS) → open panel window.

**Step 2: Commit**

```bash
git add src/main/tray-manager.ts resources/
git commit -m "feat: add system tray with context menu"
```

---

## Phase 3: Bedroom Scene & Panels

### Task 8: Bedroom Scene

**Files:**
- Create: `src/renderer/src/panel/bedroom/BedroomScene.tsx`
- Create: `src/renderer/src/panel/bedroom/WindowCurtain.tsx`
- Create: `src/renderer/src/panel/bedroom/DeskArea.tsx`
- Create: `src/renderer/src/panel/bedroom/ChairArea.tsx`
- Create: `src/renderer/src/panel/bedroom/styles.css`

**Step 1: Build bedroom scene layout**

The bedroom is a 2D illustrated scene rendered with React + CSS. Not pixel art — use a warm, stylized illustrated look for the room itself (the Pokémon sprites from PMD Collab will be pixel art, but the room UI can be more modern/illustrated).

Layout:
- Background: warm bedroom walls, floor
- Top area: window opening with sky visible, curtains on each side
- Middle: desk with objects on it (computer, Pokédex book, Poké Ball)
- Lower: chair with backpack hanging on it
- Subtle ambient elements: warm lighting, maybe a small lamp

**Step 2: Implement curtain animation (`WindowCurtain.tsx`)**

CSS keyframe animation:
```css
@keyframes curtain-blow {
  0%, 100% { transform: skewX(0deg) translateX(0); }
  25% { transform: skewX(-3deg) translateX(5px); }
  75% { transform: skewX(2deg) translateX(-3px); }
}
```

Two curtain elements (left and right), slightly different timing for natural look.

**Step 3: Make desk objects interactive**

Each object (`DeskComputer`, `DeskPokedex`, `DeskPokeball`, `ChairBackpack`) is a clickable element with:
- Hover effect: subtle glow or scale(1.05)
- Click: opens corresponding panel (passed as callback from parent)
- The Poké Ball has additional bounce animation when daily reward is available

**Step 4: Implement panel routing in panel App**

`src/renderer/src/panel/App.tsx`:
```typescript
type PanelView = 'bedroom' | 'starter' | 'pc' | 'pokedex' | 'backpack' | 'daily-reward'

// First launch (no save) → show 'starter'
// Normal → show 'bedroom'
// Click object → show corresponding panel with back button
```

**Step 5: Verify**

```bash
pnpm dev
```

Expected: clicking tray → bedroom scene with animated curtains. Objects highlight on hover. Clicking opens placeholder panels.

**Step 6: Commit**

```bash
git add src/renderer/src/panel/
git commit -m "feat: add bedroom scene with interactive objects and curtain animation"
```

---

### Task 9: Starter Selection

**Files:**
- Create: `src/renderer/src/panel/starter/StarterSelect.tsx`
- Modify: `src/renderer/src/panel/App.tsx`
- Modify: `src/main/index.ts` (IPC handler for `choose-starter`)

**Step 1: Build starter selection UI**

Reuse the bedroom scene as backdrop. On first launch, the desk shows 3 Poké Balls instead of the normal objects. Each ball is labeled (hover shows Pokémon name silhouette).

**Step 2: Implement selection flow**

1. Player clicks a Poké Ball
2. Ball open animation plays (CSS: ball splits, white flash, Pokémon sprite fades in)
3. After animation: IPC call `choose-starter(speciesId)`
4. Main process: `SaveManager.createNewSave(speciesId)` → save to disk → notify renderer
5. Panel transitions to normal bedroom scene
6. Pet window shows the chosen Pokémon on desktop

**Step 3: Verify first-launch flow**

Delete save file, launch app. Expected: bedroom with 3 balls → select → Pokémon appears on desktop + bedroom becomes normal.

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: add starter Pokémon selection flow"
```

---

### Task 10: Pokémon PC Panel

**Files:**
- Create: `src/renderer/src/panel/panels/PokemonPC.tsx`
- Create: `src/renderer/src/panel/panels/PokemonCard.tsx`

**Step 1: Build PC panel UI**

- Grid layout showing all owned Pokémon
- Each card: PMD Collab sprite (idle frame), name, level, held item icon
- Active Pokémon has a "on desktop" badge/indicator
- Click a card → show action buttons

**Step 2: Implement actions**

- **Release (放出)**: IPC `release-pokemon(id)` → main process sets `activePokemonId`, saves, notifies pet window
- **Recall (收回)**: IPC `recall-pokemon()` → main process sets `activePokemonId = null`, saves
- **Equip (装备道具)**: shows item picker from backpack (only holdable items), IPC `equip-item(pokemonId, itemId)`
- **Unequip (取出道具)**: IPC `unequip-item(pokemonId)` → item returns to backpack

**Step 3: Wire IPC handlers in main process**

Each handler: validate → mutate save data → write to disk → broadcast `save-data-changed` to both windows.

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: add Pokémon PC panel with release/recall/equip actions"
```

---

### Task 11: Pokédex Panel

**Files:**
- Create: `src/renderer/src/panel/panels/Pokedex.tsx`
- Create: `src/renderer/src/panel/panels/PokedexEntry.tsx`
- Create: `src/renderer/src/panel/panels/EvolutionChain.tsx`

**Step 1: Build Pokédex grid**

- Show all Gen1 Pokémon from the v1 roster (the 27 species in pokemon-data)
- Unlocked: show sprite + name + dex number
- Locked: show silhouette (apply CSS `filter: brightness(0)` on sprite) + `???`
- Click an unlocked entry → detail view

**Step 2: Build detail view**

- Large sprite (animated idle)
- Name (EN + ZH), types, dex number
- Evolution chain visualization: `EvolutionChain.tsx`
  - Horizontal chain: sprite → arrow → sprite → arrow → sprite
  - Show level or item requirement on the arrow
  - Locked stages shown as silhouettes
  - For Eevee: branching layout (Eevee → 3 branches)

**Step 3: Commit**

```bash
git add src/
git commit -m "feat: add Pokédex panel with evolution chains"
```

---

### Task 12: Backpack Panel

**Files:**
- Create: `src/renderer/src/panel/panels/Backpack.tsx`
- Create: `src/renderer/src/panel/panels/ItemCard.tsx`

**Step 1: Build backpack grid**

- Grid of owned items, each showing: icon, name, quantity
- Click an item → show description + use button
- Consumable items (Rare Candy, Moomoo Milk, evolution stones): "Use on..." → shows Pokémon picker
- Equipment (Exp. Share): "Give to..." → shows Pokémon picker (only those without held items)

**Step 2: Wire IPC handler for `use-item`**

Main process logic:
- Rare Candy: increment Pokémon level by 1, recalculate exp, check evolution
- Evolution stones: if target Pokémon can evolve with this stone, trigger evolution
- Moomoo Milk: placeholder effect for now (maybe happiness or small XP boost)
- Decrement item quantity, remove if 0

**Step 3: Commit**

```bash
git add src/
git commit -m "feat: add backpack panel with item usage"
```

---

## Phase 4: Growth & Interaction Systems

### Task 13: Growth System (XP, Level, Evolution)

**Files:**
- Create: `src/main/growth-manager.ts`
- Modify: `src/main/index.ts` (integrate growth ticks)
- Modify: `src/renderer/src/pet/App.tsx` (level-up and evolution animations)

**Step 1: Implement growth manager**

```typescript
class GrowthManager {
  // Called every 60 seconds by main process
  tickIdle(save: SaveData): boolean // returns true if save changed

  // Called on keyboard activity
  addKeyboardXp(save: SaveData): boolean

  // Core logic
  private addXp(pokemon: OwnedPokemon, amount: number): { leveledUp: boolean, evolved: boolean }
  private checkEvolution(pokemon: OwnedPokemon): number | null // returns new speciesId or null
  private checkLevelUp(pokemon: OwnedPokemon): boolean
}
```

Key behaviors:
- Idle tick: add `IDLE_XP_PER_MINUTE` to active Pokémon + any Pokémon holding Exp. Share
- Keyboard XP: add `KEYBOARD_XP_PER_KEYSTROKE` (with cooldown) to active + Exp. Share holders
- Level-up: when `pokemon.exp >= getExpForLevel(group, pokemon.level + 1)`, increment level
- Evolution: when `pokemon.level >= species.evolutionLevel` and evolution is level-based, auto-evolve
  - Stone evolutions handled separately via item use
- On level-up: send IPC `pet-level-up` to pet window (triggers celebration animation)
- On evolution: send IPC `pet-evolve` to pet window (triggers evolution animation sequence)

**Step 2: Integrate into main process**

```typescript
// In index.ts
setInterval(() => {
  if (growthManager.tickIdle(saveData)) {
    saveManager.save(saveData)
    broadcastSaveData()
  }
}, 60_000)
```

**Step 3: Add level-up and evolution animations to pet window**

- Level-up: brief sparkle/glow effect around the sprite, level number floats up
- Evolution: white flash → old sprite fades → new sprite appears (classic Pokémon evolution style)
- After evolution: update save data with new speciesId, update Pokédex

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: add growth system with XP, leveling, and evolution"
```

---

### Task 14: Keyboard Monitoring & Fatigue Detection

**Files:**
- Create: `src/main/keyboard-monitor.ts`
- Create: `src/main/fatigue-detector.ts`
- Modify: `src/main/index.ts`

**Step 1: Implement keyboard monitor**

```typescript
import { GlobalKeyboardListener } from 'node-global-key-listener'

class KeyboardMonitor {
  private listener: GlobalKeyboardListener
  private lastXpTime = 0
  private onKeystroke: () => void

  start(onKeystroke: () => void) {
    this.onKeystroke = onKeystroke
    this.listener = new GlobalKeyboardListener()
    this.listener.addListener((e) => {
      if (e.state === 'DOWN') {
        const now = Date.now()
        if (now - this.lastXpTime >= KEYBOARD_XP_COOLDOWN_MS) {
          this.lastXpTime = now
          this.onKeystroke()
        }
      }
    })
  }

  stop() {
    this.listener?.kill()
  }
}
```

**Step 2: Implement fatigue detector**

```typescript
class FatigueDetector {
  private activeStart: number | null = null
  private lastKeyTime = 0
  private warned = false

  onKeystroke() {
    const now = Date.now()
    if (now - this.lastKeyTime > FATIGUE_BREAK_MINUTES * 60_000) {
      // Break detected, reset
      this.activeStart = now
      this.warned = false
    }
    if (!this.activeStart) this.activeStart = now
    this.lastKeyTime = now
  }

  check(): boolean {
    // Returns true if should warn
    if (this.warned || !this.activeStart) return false
    const activeMinutes = (Date.now() - this.activeStart) / 60_000
    if (activeMinutes >= FATIGUE_ACTIVE_MINUTES) {
      this.warned = true
      return true
    }
    return false
  }
}
```

**Step 3: Wire into main process**

- Keystroke → `growthManager.addKeyboardXp()` + `fatigueDetector.onKeystroke()`
- Check fatigue every 60s → if triggered, send IPC `fatigue-warning` to pet window
- Pet window: Pokémon shows tired animation + speech bubble "Take a break!"

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: add global keyboard monitoring and fatigue detection"
```

---

### Task 15: Daily Reward System

**Files:**
- Create: `src/main/daily-reward.ts`
- Create: `src/renderer/src/panel/panels/DailyReward.tsx`
- Modify: `src/renderer/src/panel/bedroom/DeskPokeball.tsx` (bounce animation)

**Step 1: Implement daily reward logic**

```typescript
class DailyRewardManager {
  isAvailable(save: SaveData): boolean {
    const today = new Date().toISOString().split('T')[0]
    return save.player.lastDailyReward !== today && new Date().getHours() >= DAILY_REWARD_HOUR
  }

  generateReward(save: SaveData): DailyReward {
    // 40% chance: new Pokémon (from roster not yet owned, or random if all owned)
    // 60% chance: item bundle (1-3 random items)
    // Rarity tiers for Pokémon: common (starters, Pikachu, Psyduck) vs rare (Eevee evolutions, Gengar)
  }

  claimReward(save: SaveData, reward: DailyReward): void {
    save.player.lastDailyReward = new Date().toISOString().split('T')[0]
    if (reward.type === 'pokemon' && reward.pokemonSpeciesId) {
      // Add new Pokémon to save, update Pokédex
    } else if (reward.items) {
      // Add items to backpack
    }
  }
}
```

**Step 2: Poké Ball bounce animation on desk**

When `isAvailable()` is true, the Poké Ball in the bedroom scene plays a CSS bounce animation:
```css
@keyframes pokeball-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  20% { transform: translateY(-15px) rotate(-10deg); }
  40% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
  65% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-4px) rotate(-3deg); }
  85% { transform: translateY(0) rotate(0deg); }
}
```

Three shakes with decreasing amplitude, then pause, then repeat — mimicking the capture animation.

**Step 3: Build DailyReward panel**

Click bouncing Poké Ball → panel opens showing:
1. Ball opening animation (CSS: ball halves split apart, white light burst)
2. Reveal: Pokémon sprite appears (if Pokémon reward) or item icons appear (if item reward)
3. Confirmation button → claim, update save, return to bedroom

**Step 4: Schedule check**

Main process: check `isAvailable()` on launch and every 30 minutes. If newly available, notify panel window to start bounce animation on the Poké Ball.

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: add daily reward system with Poké Ball animation"
```

---

## Phase 5: Sprite Assets & Polish

### Task 16: Download & Configure All Pokémon Sprites

**Files:**
- Create: `resources/sprites/{species}/` for each of the ~27 species
- Modify: `src/renderer/src/shared/sprite-config.ts`

**Step 1: Download PMD Collab sprites**

For each species in the v1 roster, download from PMD Collab:
- Idle animation sheet
- Walk animation sheet
- Sleep animation sheet (for idle events)
- Happy/Hop animation (for feeding, level-up)
- `AnimData.xml` for frame dimensions and timing

Place in `resources/sprites/{species-name}/` (e.g., `resources/sprites/bulbasaur/`).

**Step 2: Create sprite configs for all species**

Parse `AnimData.xml` to extract frameWidth, frameHeight, frameCount, and durations.
Create a `SpriteSheetConfig` map keyed by `speciesId → animState → config`.

**Step 3: Verify all animations play correctly**

Test each species in the pet window by cycling through them.

**Step 4: Commit**

```bash
git add resources/sprites/ src/renderer/src/shared/sprite-config.ts
git commit -m "feat: add PMD Collab sprites for all v1 Pokémon"
```

---

### Task 17: Random Idle Events

**Files:**
- Create: `src/renderer/src/pet/useIdleEvents.ts`
- Modify: `src/renderer/src/pet/App.tsx`

**Step 1: Implement idle event system**

```typescript
// Random events triggered every 30-120 seconds while idle
type IdleEvent = 'yawn' | 'spin' | 'sleep' | 'look-around' | 'jump'

function useIdleEvents(currentState: PetAnimState) {
  // Only trigger when in 'idle' or 'walk' state
  // Pick random event, play animation for its duration, then return to previous state
  // Each event maps to a sprite animation (if available) or a CSS transform effect
}
```

**Step 2: Commit**

```bash
git add src/renderer/src/pet/
git commit -m "feat: add random idle events for desktop pet"
```

---

### Task 18: Right-Click Context Menu & Feeding

**Files:**
- Modify: `src/renderer/src/pet/App.tsx`
- Modify: `src/main/pet-window.ts`

**Step 1: Add right-click context menu to pet window**

Options:
- **Feed** → submenu of food items from backpack (with quantities)
- **Open PokéRoam** → open panel window
- **Pokémon Info** → shows name, level, XP progress in a small tooltip

Implement using Electron's `Menu.buildFromTemplate()` + `menu.popup()` in main process.
Renderer sends `context-menu` IPC on right-click, main process builds and shows menu.

**Step 2: Implement feeding**

- Select food from context menu → IPC `use-item(itemId, activePokemonId)`
- Main process handles item effect + decrements quantity
- Pet window: plays happy/eating animation for 2-3 seconds

**Step 3: Commit**

```bash
git add src/
git commit -m "feat: add right-click context menu and feeding interaction"
```

---

## Phase 6: Final Integration & Packaging

### Task 19: First-Launch & Auto-Save Polish

**Files:**
- Modify: `src/main/index.ts`

**Step 1: Implement auto-save**

- Save on every mutation (item use, equip, XP gain batched every 60s)
- Save on `app.before-quit`
- Update `lastLogin` on each app launch

**Step 2: Handle edge cases**

- No active Pokémon on desktop → pet window hidden
- All Pokémon recalled → pet window hidden, tray tooltip shows "No active Pokémon"
- Save file corrupted → backup old file, start fresh with warning

**Step 3: Commit**

```bash
git add src/
git commit -m "fix: polish auto-save and edge case handling"
```

---

### Task 20: Electron Builder & Packaging

**Files:**
- Modify: `package.json` (build config)
- Create: `resources/icon.ico`

**Step 1: Configure electron-builder**

```json
{
  "build": {
    "appId": "com.pokeroam.app",
    "productName": "PokéRoam",
    "directories": { "output": "release" },
    "files": ["out/**/*"],
    "extraResources": [
      { "from": "resources/sprites", "to": "sprites" }
    ],
    "win": {
      "icon": "resources/icon.ico",
      "target": ["nsis", "portable"]
    },
    "mac": {
      "icon": "resources/icon.png",
      "target": ["dmg"],
      "category": "public.app-category.games"
    }
  }
}
```

**Step 2: Build and test package**

```bash
pnpm dist
```

Verify the packaged app launches correctly, sprites load from extraResources, save file works.

**Step 3: Commit**

```bash
git add package.json resources/
git commit -m "chore: configure electron-builder packaging"
```

---

## Implementation Order Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1. Foundation | 1-4 | Scaffold, types, save system, windows |
| 2. Desktop Pet | 5-7 | Sprites, walking, physics, tray |
| 3. Bedroom & Panels | 8-12 | Bedroom scene, starter, PC, Pokédex, backpack |
| 4. Growth & Interaction | 13-15 | XP, keyboard, fatigue, daily rewards |
| 5. Assets & Polish | 16-18 | All sprites, idle events, feeding |
| 6. Integration | 19-20 | Auto-save, packaging |

Estimated total: 20 tasks across 6 phases.
