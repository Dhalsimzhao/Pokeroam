# !!!TASK!!!

# PROBLEM DESCRIPTION

TASK No.7: Add dialogue debug menu to tray

在托盘菜单中添加「测试对话」调试子菜单，使用户可以在接入真实事件之前手动触发任意类型的对话弹窗，方便调试对话框的视觉效果、表情图显示和文字排版。

调试菜单列出所有 DialogueEventType 事件类型（idle、levelup、evolve、feed、drag、fall、fatigue、dailyReward、greeting、longIdle），点击任意一项即调用 dialogueManager.showDialogue() 触发当前桌面宝可梦的对应对话。

此菜单仅在开发调试时使用，可在后续版本中移除或保留为隐藏功能。

# UPDATES

# INSIGHTS AND REASONING

## Dependency Analysis: DialogueManager (TASK No.6) Not Implemented

TASK No.6 is marked `[x]` in Scrum.md but `src/main/dialogue-manager.ts` does **not exist**. No DialogueManager import or instantiation exists in `src/main/index.ts`. The debug menu depends on `dialogueManager.showDialogue()` to function, so **DialogueManager must be created as part of this task**.

Already implemented (verified from source):
- Types: `DialogueEventType`, `DialogueEntry`, `DialogueData` in `src/shared/types.ts`
- Data logic: `getDialogue()` and `resolveDialogueText()` in `src/shared/dialogue-data.ts` (tested)
- Window: `createDialogueWindow()` in `src/main/dialogue-window.ts`
- Renderer: `App.tsx`, `DialogueBubble.tsx`, `portraits.ts` in `src/renderer/src/dialogue/`
- Preload: `onDialogueShow` and `onDialogueHide` IPC listeners in `src/preload/index.ts`
- `dialogueWindow` created in `index.ts` line 66

Missing:
- `src/main/dialogue-manager.ts` — the orchestrator between data, window positioning, and IPC

## Part A: DialogueManager Design

### Class Responsibilities

`DialogueManager` manages the lifecycle of showing/hiding dialogue bubbles:
1. Load dialogue data (via `getDialogue()` from `src/shared/dialogue-data.ts`)
2. Resolve text placeholders (via `resolveDialogueText()`)
3. Position the dialogue window above the pet window
4. Send IPC `dialogue-show` / `dialogue-hide` to the dialogue renderer
5. Auto-close after a timer (default 4 seconds)
6. Prevent overlap (cancel previous timer when new dialogue arrives)

### Constructor Dependencies

```typescript
constructor(dialogueWindow: BrowserWindow, petWindow: BrowserWindow)
```

Holds references to both windows. No other dependencies — `getDialogue()` and `resolveDialogueText()` are pure functions imported from `dialogue-data.ts`.

### showDialogue(speciesName, eventType) Flow

1. Call `getDialogue(speciesName, eventType)` → get `DialogueEntry { emotion, text }`
2. Call `resolveDialogueText(text, { name: speciesName })` → resolved text
3. Get pet window position: `petWindow.getPosition()` → `[x, y]`
4. Compute dialogue position: `x` centered horizontally above pet, `y` offset above pet
   - Pet window is 128x128. Dialogue window is 300x100.
   - x = petX + 64 - 150 (center dialogue above pet center)
   - y = petY - 100 - 8 (8px gap above pet)
   - Clamp to screen workArea to prevent off-screen
5. Use `dialogueWindow.setBounds({ x, y, width: 300, height: 100 })` — **critical**: must use `setBounds()` not `setPosition()` per knowledge base constraint for transparent windows on Windows
6. Send IPC: `dialogueWindow.webContents.send('dialogue-show', { speciesName, emotion, text: resolvedText })`
7. Show window: `dialogueWindow.show()` then `dialogueWindow.setAlwaysOnTop(true, 'screen-saver')` — must re-apply after `show()` per project convention
8. Cancel any existing auto-close timer
9. Start new timer: 4 seconds → call `hideDialogue()`

### hideDialogue() Flow

1. Send IPC: `dialogueWindow.webContents.send('dialogue-hide')`
2. After 300ms delay (match the CSS opacity transition in App.tsx): `dialogueWindow.hide()`
3. Clear timer reference

### Positioning Edge Cases

- Pet window might be near the top of screen → dialogue y would go negative. Clamp y to `workArea.y`.
- Pet window near left/right edge → dialogue x could overflow. Clamp to `[workArea.x, workArea.x + workArea.width - 300]`.
- Use `screen.getPrimaryDisplay().workArea` for bounds (same as existing clamping in `set-pet-position` handler).

## Part B: Tray Debug Menu Design

### Extending buildTrayMenu options

Current `options` parameter in `buildTrayMenu()`:
```typescript
options?: { debugEnabled?: boolean; onDebugToggle?: (enabled: boolean) => void }
```

Add a new callback:
```typescript
options?: {
  debugEnabled?: boolean
  onDebugToggle?: (enabled: boolean) => void
  onTestDialogue?: (eventType: string) => void
}
```

This follows the existing extension pattern — optional callbacks in the `options` bag.

### Menu Structure

Insert a "Test Dialogue" submenu **after** the Debug Overlay checkbox, **before** the Language submenu. This groups all debug-related items together.

The submenu contains one item per `DialogueEventType`:
- `idle`, `levelup`, `evolve`, `feed`, `drag`, `fall`, `fatigue`, `dailyReward`, `greeting`, `longIdle`

Each item's click handler calls `options.onTestDialogue(eventType)`.

The submenu is conditionally shown only when `onTestDialogue` is provided (always provide it, but this keeps the API flexible).

### i18n

Add one new field to the `Locale` interface:
```
testDialogue: string
```

Values:
- zh: `'测试对话'`
- en: `'Test Dialogue'`

Individual event type names in the submenu do NOT need i18n — they are developer-facing debug labels, using the raw `DialogueEventType` string values is appropriate for a debug menu.

### Wiring in index.ts

In `rebuildTray()`, pass the `onTestDialogue` callback:

```typescript
onTestDialogue: (eventType: string) => {
  if (!saveData?.activePokemonId || !dialogueManager) return
  const pokemon = saveData.pokemon.find(p => p.id === saveData!.activePokemonId)
  if (!pokemon) return
  const species = getSpeciesById(pokemon.speciesId)
  if (!species) return
  dialogueManager.showDialogue(species.name, eventType as DialogueEventType)
}
```

This pattern matches how `handleDebugToggle` works — a local function that closes over module-level state and delegates to a manager.

`dialogueManager` must be declared as a module-level variable and initialized after window creation in `app.whenReady()`.

## Files to Modify

| File | Change |
|------|--------|
| `src/main/dialogue-manager.ts` | **NEW** — DialogueManager class |
| `src/main/index.ts` | Import & instantiate DialogueManager; pass `onTestDialogue` to `rebuildTray()` |
| `src/main/tray-manager.ts` | Add `onTestDialogue` to options; add submenu |
| `src/shared/i18n/types.ts` | Add `testDialogue` field |
| `src/shared/i18n/locales/zh.ts` | Add `testDialogue: '测试对话'` |
| `src/shared/i18n/locales/en.ts` | Add `testDialogue: 'Test Dialogue'` |

## Design Decisions

**Why not a separate debug window?** A tray submenu reuses existing infrastructure (tray-manager.ts) and matches the Debug Overlay toggle pattern. No new windows or UI needed.

**Why not conditionally hide the debug menu in production?** The Scrum says "可在后续版本中移除或保留为隐藏功能". For now, always show it — keeping it simple. Future task can gate it behind `is.dev` if desired.

**Why use species.name (English) not nameZh?** `getDialogue()` takes `speciesName` which is the key for the `species` record in dialogue-data.json. The JSON uses English species names as keys (matching `PokemonSpecies.name`), so we pass `species.name`.

# AFFECTED PROJECTS

## Build Verification

- `pnpm typecheck` — verifies all TypeScript changes compile (new file + modified files)
- `pnpm typecheck:node` — specifically checks main process + preload + shared
- `pnpm typecheck:web` — checks renderer (unchanged but depends on shared types)

## Test Verification

- `pnpm test` — run existing dialogue-data tests to ensure no regressions

## Manual Verification

1. `pnpm dev` — launch app
2. Right-click tray icon → verify "Test Dialogue" submenu appears with 10 event types
3. Release a Pokemon to desktop
4. Click each event type → verify dialogue bubble appears above the pet, auto-closes after ~4 seconds
5. Rapidly click multiple event types → verify no overlapping dialogues (new replaces old)
6. Move pet to screen edge → trigger dialogue → verify it clamps within screen bounds

# !!!FINISHED!!!
