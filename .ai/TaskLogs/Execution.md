# !!!EXECUTION!!!

# UPDATES

# AFFECTED PROJECTS

- Typecheck: `pnpm typecheck`
- Unit tests: `pnpm test`
- Manual test: launch app with `pnpm dev`, use tray debug menu to verify all dialogue triggers

# EXECUTION PLAN

## Step 1. Add dialogue timing constants [DONE]

**File**: `src/shared/constants.ts`

Add at the end of file:

```typescript
export const IDLE_CHAT_MIN_MS = 120_000 // 2 minutes
export const IDLE_CHAT_MAX_MS = 300_000 // 5 minutes
export const LONG_IDLE_THRESHOLD_MS = 600_000 // 10 minutes
export const GREETING_DELAY_MS = 2000
```

## Step 2. Add new IPC channels (renderer → main) [DONE]

Two new fire-and-forget channels: `pet-drag-end` and `pet-landed`.

### 2a. Preload

**File**: `src/preload/index.ts`

Add after the `dragMove` entry (around line 29):

```typescript
notifyDragEnd: (): void => {
  ipcRenderer.send('pet-drag-end')
},
notifyLanded: (): void => {
  ipcRenderer.send('pet-landed')
},
```

### 2b. Type declarations

**File**: `src/renderer/src/env.d.ts`

Add after `dragMove` in the `ElectronAPI` interface:

```typescript
notifyDragEnd: () => void
notifyLanded: () => void
```

## Step 3. Send drag-end and landing events from pet renderer [DONE]

### 3a. Drag end notification

**File**: `src/renderer/src/pet/usePetDrag.ts`

In `onMouseUp`, add `window.api.notifyDragEnd()` after the drag end callback:

```typescript
const onMouseUp = (): void => {
  if (!isDragging.current) return
  isDragging.current = false
  cbRef.current.onDragEnd()
  window.api.notifyDragEnd()
}
```

### 3b. Landing notification

**File**: `src/renderer/src/pet/usePetPhysics.ts`

In the `tick` function's landing check (inside `if (s.y >= groundY)`), add `window.api.notifyLanded()` when transitioning from airborne to grounded:

```typescript
// Landing check
const groundY = wa.y + wa.height - WINDOW_SIZE
if (s.y >= groundY) {
  s.y = groundY
  s.vy = 0
  s.grounded = true
  s.animState = 'idle'
  s.vx = 0
  nextActionRef.current = frameCount + Math.round(randomBetween(60, 120))
  window.api.notifyLanded()
}
```

## Step 4. Add callbacks to GrowthManager [DONE]

**File**: `src/main/growth-manager.ts`

### 4a. Add callback properties

Add two optional callback properties to the class, after `private petWindow`:

```typescript
onLevelUp?: (pokemonId: string) => void
onEvolve?: (pokemonId: string) => void
```

### 4b. Invoke callbacks

In the `addXp` method, after `this.petWindow?.webContents.send('pet-level-up', ...)` (line 63), add:

```typescript
this.onLevelUp?.(pokemon.id)
```

After `this.petWindow?.webContents.send('pet-evolve', ...)` (line 68), add:

```typescript
this.onEvolve?.(pokemon.id)
```

## Step 5. Wire up all dialogue triggers in index.ts [DONE]

**File**: `src/main/index.ts`

### 5a. Add imports

Add to the constants import:

```typescript
import { IDLE_CHAT_MIN_MS, IDLE_CHAT_MAX_MS, LONG_IDLE_THRESHOLD_MS, GREETING_DELAY_MS } from '../shared/constants'
```

(Merge with the existing `MAX_LEVEL` import.)

### 5b. Add module-level state for long idle tracking

After the `let debugEnabled = false` line, add:

```typescript
let lastInteractionTime = Date.now()
let longIdleTriggered = false
```

### 5c. Add helper function

Add after the `handleDebugToggle` function:

```typescript
function getActiveSpeciesName(): string | null {
  if (!saveData?.activePokemonId) return null
  const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
  if (!pokemon) return null
  const species = getSpeciesById(pokemon.speciesId)
  return species?.name ?? null
}

function onUserInteraction(): void {
  lastInteractionTime = Date.now()
  longIdleTriggered = false
}
```

### 5d. Wire GrowthManager callbacks

In `app.whenReady().then(...)`, after `growthManager.setPetWindow(petWindow)` (line 80), add:

```typescript
growthManager.onLevelUp = (pokemonId) => {
  if (pokemonId !== saveData?.activePokemonId) return
  const name = getActiveSpeciesName()
  if (name) dialogueManager.showDialogue(name, 'levelup')
}
growthManager.onEvolve = (pokemonId) => {
  if (pokemonId !== saveData?.activePokemonId) return
  const name = getActiveSpeciesName()
  if (name) dialogueManager.showDialogue(name, 'evolve')
}
```

### 5e. Add greeting dialogue on pet window load

In the `petWindow.webContents.on('did-finish-load', ...)` callback, after `sendPetState()`, add:

```typescript
setTimeout(() => {
  const name = getActiveSpeciesName()
  if (name) dialogueManager.showDialogue(name, 'greeting')
}, GREETING_DELAY_MS)
```

### 5f. Add dialogue triggers in use-item handler

In the `use-item` handler, after the rare-candy evolution `petWindow?.webContents.send('pet-evolve', ...)` (around line 253), add:

```typescript
if (pokemonId === saveData!.activePokemonId) {
  dialogueManager.showDialogue(nextSpecies.name, 'evolve')
}
```

After the rare-candy level-up `petWindow?.webContents.send('pet-level-up', ...)` (around line 256), add:

```typescript
if (pokemonId === saveData!.activePokemonId) {
  dialogueManager.showDialogue(species.name, 'levelup')
}
```

After the evolution stone `petWindow?.webContents.send('pet-evolve', ...)` (around line 269), add:

```typescript
if (pokemonId === saveData!.activePokemonId) {
  dialogueManager.showDialogue(evolution.name, 'evolve')
}
```

After the moomoo-milk level-up `petWindow?.webContents.send('pet-level-up', ...)` (around line 279), add:

```typescript
if (pokemonId === saveData!.activePokemonId) {
  dialogueManager.showDialogue(species.name, 'levelup')
}
```

### 5g. Add feed dialogue in context menu

In `show-context-menu` handler, in the food item `click` callback, after `petWindow?.webContents.send('context-menu-feed', b.itemId)`, add:

```typescript
const feedName = getActiveSpeciesName()
if (feedName) dialogueManager.showDialogue(feedName, 'feed')
```

### 5h. Add fatigue dialogue

In `startIdleXpTick`, after `petWindow?.webContents.send('fatigue-warning', null)`, add:

```typescript
const fatigueName = getActiveSpeciesName()
if (fatigueName) dialogueManager.showDialogue(fatigueName, 'fatigue')
```

### 5i. Add daily reward dialogue

In the `claim-daily-reward` handler, after `broadcastSaveData()` and before `return reward`, add:

```typescript
const rewardName = getActiveSpeciesName()
if (rewardName) dialogueManager.showDialogue(rewardName, 'dailyReward')
```

### 5j. Add drag-end and landing IPC handlers

In `setupIpcHandlers()`, after the `update-hit-regions` handler, add:

```typescript
// Dialogue triggers from pet renderer
ipcMain.on('pet-drag-end', () => {
  onUserInteraction()
  const name = getActiveSpeciesName()
  if (name) dialogueManager.showDialogue(name, 'drag')
})

ipcMain.on('pet-landed', () => {
  const name = getActiveSpeciesName()
  if (name) dialogueManager.showDialogue(name, 'fall')
})
```

### 5k. Update keyboard monitoring to track interaction

In `startKeyboardMonitoring`, add `onUserInteraction()` call inside the keystroke callback:

```typescript
function startKeyboardMonitoring(): void {
  keyboardMonitor.start(() => {
    if (!saveData) return
    onUserInteraction()
    fatigueDetector.onKeystroke()
    if (growthManager.addKeyboardXp(saveData)) {
      saveManager.save(saveData)
      broadcastSaveData()
    }
  })
}
```

### 5l. Add idle chat timer

Add new function after `startKeyboardMonitoring`:

```typescript
function startIdleChatTimer(): void {
  const scheduleNext = (): void => {
    const delay = IDLE_CHAT_MIN_MS + Math.random() * (IDLE_CHAT_MAX_MS - IDLE_CHAT_MIN_MS)
    setTimeout(() => {
      const name = getActiveSpeciesName()
      if (name) dialogueManager.showDialogue(name, 'idle')
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}
```

### 5m. Add long idle tracker

Add new function after `startIdleChatTimer`:

```typescript
function startLongIdleTracker(): void {
  setInterval(() => {
    if (!saveData?.activePokemonId) return
    const elapsed = Date.now() - lastInteractionTime
    if (elapsed >= LONG_IDLE_THRESHOLD_MS && !longIdleTriggered) {
      longIdleTriggered = true
      const name = getActiveSpeciesName()
      if (name) dialogueManager.showDialogue(name, 'longIdle')
    }
  }, 60_000)
}
```

### 5n. Start new timers in app.whenReady

In `app.whenReady().then(...)`, after `startKeyboardMonitoring()` (line 101), add:

```typescript
startIdleChatTimer()
startLongIdleTracker()
```

# FIXING ATTEMPTS

## Fixing attempt No.1

**Errors found by `pnpm typecheck`:** 4 errors across 4 files.

### Fix 1: `src/main/daily-reward.ts` (TS2305 + TS6133)
- Removed unused import `POKEMON` (does not exist in `pokemon-data.ts`; the export is `POKEMON_SPECIES`)
- Changed: `import { POKEMON, getExpForLevel, getSpeciesById }` → `import { getExpForLevel, getSpeciesById }`

### Fix 2: `src/main/index.ts` (TS6133)
- Removed unused import `ITEMS`
- Changed: `import { getItemById, ITEMS }` → `import { getItemById }`

### Fix 3: `src/main/keyboard-monitor.ts` (TS6133)
- Removed unused import `UiohookKey`
- Changed: `import { uIOhook, UiohookKey }` → `import { uIOhook }`

### Fix 4: `src/renderer/src/panel/panels/DailyReward.tsx` (TS6133)
- Prefixed unused state variable with underscore
- Changed: `const [claimed, setClaimed]` → `const [_claimed, setClaimed]`
- Note: pre-existing issue, not caused by dialogue integration

**Result:** `pnpm typecheck` passes cleanly after all fixes.

# !!!FINISHED!!!
