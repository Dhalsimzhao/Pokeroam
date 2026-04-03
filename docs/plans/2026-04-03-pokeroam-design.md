# PokéRoam - Desktop Pet Game Design Document

## Overview

PokéRoam is a Pokémon-themed desktop pet game combining nurturing (养成) and companion (陪伴) gameplay. Players raise Pokémon that roam their desktop, gain experience through idle time and keyboard activity, level up, evolve, and collect new Pokémon through daily rewards.

## Tech Stack

- **Framework**: Electron + electron-vite (based on claude-detector architecture)
- **Frontend**: React + TypeScript
- **Data**: JSON file persistence (`~/.pokeroam/save.json`)
- **Keyboard Monitoring**: node-global-key-listener (global, cross-platform, no native compile)
- **Sprite Source**: PMD Collab (https://sprites.pmdcollab.org/) — unified art style throughout

## First Version Pokémon Roster

Gen1 only. 10 evolution lines (~27 forms):

| Base | Evolution Chain |
|------|----------------|
| Bulbasaur | Bulbasaur → Ivysaur → Venusaur |
| Charmander | Charmander → Charmeleon → Charizard |
| Squirtle | Squirtle → Wartortle → Blastoise |
| Pikachu | Pichu → Pikachu → Raichu |
| Jigglypuff | Jigglypuff → Wigglytuff |
| Eevee | Eevee → Vaporeon / Jolteon / Flareon |
| Gastly | Gastly → Haunter → Gengar |
| Psyduck | Psyduck → Golduck |
| Slowpoke | Slowpoke → Slowbro |

## Core Systems

### 1. Initial Experience

First launch: bedroom scene with 3 Poké Balls on the desk (Bulbasaur / Charmander / Squirtle). Player clicks to choose. Ball open animation plays, then the chosen Pokémon appears on the desktop. After selection, the 3 balls are replaced by the normal desk objects.

### 2. Desktop Pet Window

- Transparent, frameless, always-on-top Electron window (same approach as claude-detector)
- Pokémon walks left/right along the screen bottom (above taskbar)
- Drag & drop support: player can pick up the Pokémon, release to trigger free-fall with gravity back to the bottom
- Random idle events: cute animations (yawning, spinning, sleeping, etc.)
- Only 1 active Pokémon on desktop at a time

### 3. Growth System

**Experience Sources:**
- **Idle XP**: slow passive gain while the app is running
- **Keyboard XP**: global keyboard listener detects keystrokes → faster XP accumulation (we only count "user is typing" signals, not specific keys)

**Leveling & Evolution:**
- XP thresholds, level-up stats, and evolution levels reference Pokémon wiki data (https://wiki.52poke.com/)
- Level-up triggers a celebration animation on the desktop pet
- Evolution triggers a dedicated evolution animation sequence

### 4. Fatigue Detection

- Track keyboard activity patterns via node-global-key-listener
- Define fatigue rules: e.g., continuous typing for 45+ minutes without a 5-minute break
- When triggered: the desktop Pokémon performs a special animation + shows a rest reminder notification
- Non-intrusive: visual cue from the pet, not a system modal

### 5. Feeding & Interaction

- Right-click the desktop Pokémon → context menu with "Feed" option (or drag food from backpack onto pet)
- Feeding triggers a special happy/eating animation
- Different foods may grant XP bonus, happiness, or other effects (details TBD in backpack system design)

### 6. Daily Reward System

- Refreshes at 8:00 AM daily
- The Poké Ball on the desk plays a bouncing animation (referencing the capture ball-shake animation from the games) to notify the player
- Click the Poké Ball → open animation → reveals either:
  - A new Pokémon (from the available Gen1 roster, with rarity tiers)
  - A treasure chest containing items (Poké Balls, food, equipment)
- If the player already owns the Pokémon drawn, convert to candy/item

### 7. Backpack System

- Stores food items and equipment
- Items include: Moomoo Milk, Rare Candy, Exp. Share, etc.
- Detailed item abilities TBD (player will provide specific design later)
- UI: click the backpack on the chair → opens inventory panel

### 8. Pokédex System

- Displays all unlocked Pokémon with basic info
- Shows evolution chains with visual connections
- Data references: https://wiki.52poke.com/ or https://tw.portal-pokemon.com/play/pokedex
- Locked Pokémon shown as silhouettes
- UI: click the Pokédex on the desk → opens Pokédex panel

### 9. Pokémon PC (Storage & Management)

- Click the computer on the desk → opens PC interface
- Shows all owned Pokémon in a grid/list
- Per-Pokémon actions:
  - **Release to desktop** (放出): set as the active desktop Pokémon
  - **Recall** (收回): remove from desktop, return to storage
  - **Equip item** (装备道具): attach a held item from backpack
  - **Remove item** (取出道具): return held item to backpack
- Only 1 Pokémon can be active on desktop at a time

### 10. Item / Equipment System

- Pokémon can hold 1 item at a time
- **Exp. Share** (学习装置): the holding Pokémon gains the same XP as the active desktop Pokémon, even while in storage
- Other held item effects TBD

## UI Architecture

### Desktop Pet Window
- Transparent, frameless, click-through (except on the pet sprite)
- Canvas-based sprite rendering (sprite sheet + frame animation, same as claude-detector)
- Always on top, positioned at screen bottom
- Right-click context menu for quick actions

### Main Panel (Bedroom Scene)
Opened from system tray icon or right-click menu on the pet.

**Scene Layout:**
```
+--------------------------------------------------+
|  [Window with curtains blowing in wind]           |
|                                                   |
|  +--------+  +------+  +------+                   |
|  |Computer|  |Pokédex|  |Poké  |   <- Desk        |
|  |   PC   |  |      |  |Ball  |                   |
|  +--------+  +------+  +------+                   |
|                                                   |
|           +--------+                              |
|           | Chair  |                               |
|           |+------+|                               |
|           ||Bag   ||                               |
|           |+------+|                               |
|           +--------+                              |
+--------------------------------------------------+
```

**Interactive Objects:**
| Object | Location | Click Action |
|--------|----------|-------------|
| Computer | Desk | Opens Pokémon PC (storage & management) |
| Pokédex | Desk | Opens Pokédex panel |
| Poké Ball | Desk | Opens daily reward (bounces at 8 AM when available) |
| Backpack | Chair | Opens inventory panel |

**Animations:**
- Window curtains: gentle CSS/Canvas wind animation (continuous)
- Poké Ball: bounce/shake animation when daily reward is available
- Object hover: subtle highlight or scale effect
- Panel transitions: slide-in from the clicked object's position

## Data Model

```typescript
// Save file structure (~/.pokeroam/save.json)
interface SaveData {
  player: {
    createdAt: string
    lastLogin: string
    lastDailyReward: string // ISO date
  }
  pokemon: OwnedPokemon[]
  activePokemonId: string | null // ID of the Pokémon currently on desktop
  backpack: BackpackItem[]
  pokedex: number[] // array of seen/caught Pokémon national dex numbers
}

interface OwnedPokemon {
  id: string // unique instance ID
  speciesId: number // national dex number
  name: string // nickname or species name
  level: number
  exp: number
  heldItemId: string | null
}

interface BackpackItem {
  itemId: string
  quantity: number
}
```

## Project Structure

```
PokéRoam/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts           # App entry, window management
│   │   ├── keyboard.ts        # Global keyboard listener
│   │   ├── fatigue.ts         # Fatigue detection logic
│   │   ├── daily-reward.ts    # Daily reward scheduler
│   │   └── save-manager.ts    # JSON save/load
│   ├── renderer/       # React frontend
│   │   ├── pet/               # Desktop pet window
│   │   │   ├── PetWindow.tsx
│   │   │   ├── SpriteCanvas.tsx
│   │   │   └── physics.ts     # Gravity, drag & drop
│   │   ├── bedroom/           # Main panel - bedroom scene
│   │   │   ├── BedroomScene.tsx
│   │   │   ├── DeskComputer.tsx
│   │   │   ├── DeskPokedex.tsx
│   │   │   ├── DeskPokeball.tsx
│   │   │   ├── ChairBackpack.tsx
│   │   │   └── WindowCurtain.tsx  # Animated curtain
│   │   ├── panels/            # Sub-panels opened from bedroom
│   │   │   ├── PokemonPC.tsx
│   │   │   ├── Pokedex.tsx
│   │   │   ├── Backpack.tsx
│   │   │   └── DailyReward.tsx
│   │   ├── starter/           # First-time starter selection
│   │   │   └── StarterSelect.tsx
│   │   └── shared/            # Shared components
│   │       ├── SpriteRenderer.tsx
│   │       └── animations.ts
│   ├── preload/        # IPC bridge
│   │   └── index.ts
│   └── shared/         # Shared types & data
│       ├── types.ts
│       ├── pokemon-data.ts    # Species stats, evolution rules
│       └── item-data.ts       # Item definitions
├── resources/
│   └── sprites/        # PMD Collab sprite sheets
├── docs/
│   └── plans/
├── package.json
├── electron-vite.config.ts
└── tsconfig.*.json
```

## Cross-Platform Notes

- **Windows**: pet window sits above taskbar; taskbar interaction deferred to v2
- **macOS**: pet window sits above Dock; Dock interaction deferred to v2
- First version focuses on screen-bottom walking which works identically on both platforms

## Future Iterations (Not in v1)

- Window/taskbar climbing and interaction (B/C tier physics)
- Multi-monitor support
- More Gen1 Pokémon
- Pokémon battles
- Trading system
- More held items and food effects
- Achievement system
