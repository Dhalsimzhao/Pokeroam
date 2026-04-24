import { app, BrowserWindow, ipcMain, Menu, screen, Tray } from 'electron'
import { SaveManager } from './save-manager'
import { createPetWindow } from './pet-window'
import { createPanelWindow } from './panel-window'
import { createDialogueWindow } from './dialogue-window'
import { createTray, buildTrayMenu } from './tray-manager'
import { GrowthManager } from './growth-manager'
import { KeyboardMonitor } from './keyboard-monitor'
import { FatigueDetector } from './fatigue-detector'
import { DailyRewardManager } from './daily-reward'
import { DialogueManager } from './dialogue-manager'
import {
  getSpriteAnchorStore,
  getSpriteAnchorsForSpecies,
  initSpriteAnchors,
  updateSpriteAnchors
} from './sprite-anchors'
import type {
  AnimParams,
  DialogueEventType,
  OwnedPokemon,
  PetTuning,
  SaveData
} from '../shared/types'
import type { SpriteAnchorMap } from '../shared/sprite-anchors'
import { ALL_PMD_ANIMS } from '../shared/sprite-anchors'
import { ALL_ANIM_STATES, DEFAULT_PET_TUNING } from '../shared/types'
import { POKEMON_SPECIES, getSpeciesById, getExpForLevel } from '../shared/pokemon-data'
import { getItemById } from '../shared/item-data'
import {
  MAX_LEVEL,
  IDLE_CHAT_MIN_MS,
  IDLE_CHAT_MAX_MS,
  LONG_IDLE_THRESHOLD_MS,
  GREETING_DELAY_MS,
  PET_WINDOW_SIZE
} from '../shared/constants'
import { getLocale, localeName, type LangCode } from '../shared/i18n'
import { is } from '@electron-toolkit/utils'

let petWindow: BrowserWindow | null = null
let panelWindow: BrowserWindow | null = null
let dialogueWindow: BrowserWindow | null = null
let _tray: Tray | null = null
let saveManager: SaveManager
let growthManager: GrowthManager
let keyboardMonitor: KeyboardMonitor
let fatigueDetector: FatigueDetector
let dailyRewardManager: DailyRewardManager
let dialogueManager: DialogueManager
let saveData: SaveData | null = null
let currentLang: LangCode = 'zh'
let debugEnabled = false
let petTuning: PetTuning = { ...DEFAULT_PET_TUNING }
let lastInteractionTime = Date.now()
let longIdleTriggered = false

function rebuildTray(): void {
  if (_tray && panelWindow) {
    buildTrayMenu(_tray, panelWindow, currentLang, handleLangChange, {
      debugEnabled,
      onDebugToggle: handleDebugToggle,
      onTestDialogue: (eventType: string) => {
        if (!saveData?.activePokemonId) return
        const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
        if (!pokemon) return
        const species = getSpeciesById(pokemon.speciesId)
        if (!species) return
        dialogueManager.showDialogue(species.name, eventType as DialogueEventType)
      },
      isDev: is.dev,
      onOpenDebugPanel: () => {
        if (!panelWindow) return
        panelWindow.show()
        panelWindow.focus()
        panelWindow.webContents.send('panel-navigate', 'debug')
      }
    })
  }
}

function handleLangChange(lang: LangCode): void {
  currentLang = lang
  rebuildTray()
  petWindow?.webContents.send('locale-changed', lang)
  panelWindow?.webContents.send('locale-changed', lang)
}

function handleDebugToggle(enabled: boolean): void {
  debugEnabled = enabled
  petWindow?.webContents.send('toggle-debug', enabled)
  rebuildTray()
}

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

/** Walk a pokemon up its level-evolution chain as far as its current level allows. */
function cascadeLevelEvolution(pokemon: OwnedPokemon, pokedex: number[]): void {
  // Guard against pathological data (cycles / > chain length); chains in this
  // project are at most 3 stages, so 10 is plenty.
  for (let i = 0; i < 10; i++) {
    const next = POKEMON_SPECIES.find(
      (s) =>
        s.evolvesFrom === pokemon.speciesId &&
        s.evolutionLevel !== null &&
        s.evolutionItem === null &&
        pokemon.level >= s.evolutionLevel
    )
    if (!next) return
    pokemon.speciesId = next.id
    if (!pokedex.includes(next.id)) pokedex.push(next.id)
    pokemon.exp = getExpForLevel(next.expGroup, pokemon.level)
  }
}

// Hit regions for Windows click-through polling
let hitRegions: Array<{ x: number; y: number; width: number; height: number }> = []
let cursorInside = false

app.whenReady().then(async () => {
  saveManager = new SaveManager()
  growthManager = new GrowthManager()
  keyboardMonitor = new KeyboardMonitor()
  fatigueDetector = new FatigueDetector()
  dailyRewardManager = new DailyRewardManager()
  saveData = saveManager.load()
  // Parse all AnimData.xml files up-front so renderer's first request returns
  // synchronously from the in-memory cache.
  await initSpriteAnchors()

  petWindow = createPetWindow()
  panelWindow = createPanelWindow()
  dialogueWindow = createDialogueWindow()
  dialogueManager = new DialogueManager(dialogueWindow, petWindow)
  _tray = createTray(panelWindow, currentLang, handleLangChange)
  rebuildTray()
  growthManager.setPetWindow(petWindow)
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

  // Always send pet state once pet window finishes loading
  petWindow.webContents.on('did-finish-load', () => {
    sendPetState()
    setTimeout(() => {
      const name = getActiveSpeciesName()
      if (name) dialogueManager.showDialogue(name, 'greeting')
    }, GREETING_DELAY_MS)
  })

  // If no save (first launch), show panel for starter selection
  if (!saveData) {
    petWindow.hide()
    panelWindow.show()
  } else {
    // Update lastLogin
    saveData.player.lastLogin = new Date().toISOString()
    saveManager.save(saveData)
  }

  setupIpcHandlers()
  startClickThroughPolling()
  startBoundsCheck()
  startIdleXpTick()
  startKeyboardMonitoring()
  startIdleChatTimer()
  startLongIdleTracker()
})

// Don't quit when all windows closed (tray app)
app.on('window-all-closed', () => {
  // Do nothing — app stays alive for the tray/pet window
})

// Save on quit
app.on('before-quit', () => {
  if (saveData) {
    saveManager.save(saveData)
  }
  keyboardMonitor.stop()
})

function broadcastSaveData(): void {
  panelWindow?.webContents.send('save-data-changed', saveData)
  sendPetState()
}

function sendPetState(): void {
  if (!saveData?.activePokemonId) {
    petWindow?.hide()
    petWindow?.webContents.send('pet-state-update', null)
    return
  }
  const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
  if (pokemon) {
    petWindow?.show()
    petWindow?.setAlwaysOnTop(true, 'screen-saver')
    petWindow?.webContents.send('pet-state-update', {
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      nickname: pokemon.nickname
    })
  } else {
    petWindow?.hide()
  }
}

function setupIpcHandlers(): void {
  // Get save data (for panel window)
  ipcMain.handle('get-save-data', () => saveData)

  // Get pet state (for pet window to pull on mount)
  ipcMain.handle('get-pet-state', () => {
    if (!saveData?.activePokemonId) return null
    const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
    if (!pokemon) return null
    return {
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      nickname: pokemon.nickname
    }
  })

  // Choose starter
  ipcMain.handle('choose-starter', (_e, speciesId: number) => {
    saveData = saveManager.createNewSave(speciesId)
    saveManager.save(saveData)
    broadcastSaveData()
    return saveData
  })

  // Release Pokemon to desktop
  ipcMain.handle('release-pokemon', (_e, pokemonId: string) => {
    if (!saveData) return false
    const pokemon = saveData.pokemon.find((p) => p.id === pokemonId)
    if (!pokemon) return false
    saveData.activePokemonId = pokemonId
    saveManager.save(saveData)
    broadcastSaveData()
    return true
  })

  // Recall Pokemon from desktop
  ipcMain.handle('recall-pokemon', () => {
    if (!saveData) return false
    saveData.activePokemonId = null
    saveManager.save(saveData)
    broadcastSaveData()
    return true
  })

  // Equip item to Pokemon
  ipcMain.handle('equip-item', (_e, pokemonId: string, itemId: string) => {
    if (!saveData) return false
    const pokemon = saveData.pokemon.find((p) => p.id === pokemonId)
    if (!pokemon) return false
    // Remove item from backpack
    const bpItem = saveData.backpack.find((b) => b.itemId === itemId)
    if (!bpItem || bpItem.quantity <= 0) return false
    // If Pokemon already holds something, return it to backpack
    if (pokemon.heldItemId) {
      const existing = saveData.backpack.find((b) => b.itemId === pokemon.heldItemId)
      if (existing) existing.quantity++
      else saveData.backpack.push({ itemId: pokemon.heldItemId, quantity: 1 })
    }
    bpItem.quantity--
    if (bpItem.quantity <= 0) {
      saveData.backpack = saveData.backpack.filter((b) => b.quantity > 0)
    }
    pokemon.heldItemId = itemId
    saveManager.save(saveData)
    broadcastSaveData()
    return true
  })

  // Unequip item from Pokemon
  ipcMain.handle('unequip-item', (_e, pokemonId: string) => {
    if (!saveData) return false
    const pokemon = saveData.pokemon.find((p) => p.id === pokemonId)
    if (!pokemon || !pokemon.heldItemId) return false
    const existing = saveData.backpack.find((b) => b.itemId === pokemon.heldItemId)
    if (existing) existing.quantity++
    else saveData.backpack.push({ itemId: pokemon.heldItemId, quantity: 1 })
    pokemon.heldItemId = null
    saveManager.save(saveData)
    broadcastSaveData()
    return true
  })

  // Use item on Pokemon
  ipcMain.handle('use-item', (_e, itemId: string, pokemonId: string) => {
    if (!saveData) return false
    const pokemon = saveData.pokemon.find((p) => p.id === pokemonId)
    if (!pokemon) return false
    const bpItem = saveData.backpack.find((b) => b.itemId === itemId)
    if (!bpItem || bpItem.quantity <= 0) return false

    const species = getSpeciesById(pokemon.speciesId)
    if (!species) return false

    let used = false

    if (itemId === 'rare-candy') {
      // Level up by 1
      if (pokemon.level < MAX_LEVEL) {
        pokemon.level++
        pokemon.exp = getExpForLevel(species.expGroup, pokemon.level)
        used = true
        // Check level-based evolution
        if (species.evolutionLevel && pokemon.level >= species.evolutionLevel) {
          const nextSpecies = POKEMON_SPECIES.find(
            (s) => s.evolvesFrom === species.id && s.evolutionLevel === species.evolutionLevel
          )
          if (nextSpecies) {
            pokemon.speciesId = nextSpecies.id
            if (!saveData.pokedex.includes(nextSpecies.id)) {
              saveData.pokedex.push(nextSpecies.id)
            }
            petWindow?.webContents.send('pet-evolve', { speciesId: nextSpecies.id })
            if (pokemonId === saveData!.activePokemonId) {
              dialogueManager.showDialogue(nextSpecies.name, 'evolve')
            }
          }
        }
        petWindow?.webContents.send('pet-level-up', { level: pokemon.level })
        if (pokemonId === saveData!.activePokemonId) {
          dialogueManager.showDialogue(species.name, 'levelup')
        }
      }
    } else if (['fire-stone', 'water-stone', 'thunder-stone', 'moon-stone'].includes(itemId)) {
      // Evolution stone — find matching evolution
      const evolution = POKEMON_SPECIES.find(
        (s) => s.evolvesFrom === pokemon.speciesId && s.evolutionItem === itemId
      )
      if (evolution) {
        pokemon.speciesId = evolution.id
        if (!saveData.pokedex.includes(evolution.id)) {
          saveData.pokedex.push(evolution.id)
        }
        petWindow?.webContents.send('pet-evolve', { speciesId: evolution.id })
        if (pokemonId === saveData!.activePokemonId) {
          dialogueManager.showDialogue(evolution.name, 'evolve')
        }
        used = true
      }
    } else if (itemId === 'moomoo-milk') {
      // Small XP boost
      pokemon.exp += 50
      // Check if enough for level up
      if (pokemon.level < MAX_LEVEL) {
        const nextLevelExp = getExpForLevel(species.expGroup, pokemon.level + 1)
        if (pokemon.exp >= nextLevelExp) {
          pokemon.level++
          petWindow?.webContents.send('pet-level-up', { level: pokemon.level })
          if (pokemonId === saveData!.activePokemonId) {
            dialogueManager.showDialogue(species.name, 'levelup')
          }
        }
      }
      used = true
    }

    if (used) {
      bpItem.quantity--
      saveData.backpack = saveData.backpack.filter((b) => b.quantity > 0)
      saveManager.save(saveData)
      broadcastSaveData()
    }
    return used
  })

  // Claim daily reward
  ipcMain.handle('claim-daily-reward', () => {
    if (!saveData || !dailyRewardManager.isAvailable(saveData)) return null
    const reward = dailyRewardManager.generateReward(saveData)
    dailyRewardManager.claimReward(saveData, reward)
    saveManager.save(saveData)
    broadcastSaveData()
    const rewardName = getActiveSpeciesName()
    if (rewardName) dialogueManager.showDialogue(rewardName, 'dailyReward')
    return reward
  })

  // Check daily reward availability
  ipcMain.handle('is-daily-reward-available', () => {
    if (!saveData) return false
    return dailyRewardManager.isAvailable(saveData)
  })

  // Locale setting from renderer
  ipcMain.on('set-locale', (_event, lang: string) => {
    if (lang === 'zh' || lang === 'en') {
      handleLangChange(lang)
    }
  })

  // Right-click context menu on pet
  ipcMain.on('show-context-menu', () => {
    if (!petWindow || !saveData?.activePokemonId) return
    const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
    if (!pokemon) return
    const species = getSpeciesById(pokemon.speciesId)
    const t = getLocale(currentLang)

    // Food items in backpack
    const foodItems = saveData.backpack
      .filter((b) => {
        const item = getItemById(b.itemId)
        return item && item.category === 'food' && b.quantity > 0
      })
      .map((b) => {
        const item = getItemById(b.itemId)!
        return {
          label: `${localeName(item.nameZh, item.name, currentLang)} ×${b.quantity}`,
          click: (): void => {
            petWindow?.webContents.send('context-menu-feed', b.itemId)
            const feedName = getActiveSpeciesName()
            if (feedName) dialogueManager.showDialogue(feedName, 'feed')
          }
        }
      })

    const speciesLabel = species
      ? localeName(species.nameZh, species.name, currentLang)
      : 'Pokemon'

    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: `${speciesLabel} Lv.${pokemon.level}`,
        enabled: false
      },
      { type: 'separator' },
      {
        label: t.feed,
        submenu: foodItems.length > 0 ? foodItems : [{ label: t.noFoodItems, enabled: false }]
      },
      { type: 'separator' },
      {
        label: t.openPokeroam,
        click: (): void => {
          panelWindow?.show()
          panelWindow?.focus()
        }
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: petWindow })
  })

  // Open panel window
  ipcMain.on('open-panel', () => {
    panelWindow?.show()
    panelWindow?.focus()
  })

  // Pet window position control
  ipcMain.handle('get-work-area', () => {
    return screen.getPrimaryDisplay().workArea
  })

  ipcMain.on('set-pet-position', (_e, x: number, y: number) => {
    if (!petWindow) return
    const { workArea } = screen.getPrimaryDisplay()
    const clampedX = Math.max(workArea.x, Math.min(Math.round(x), workArea.x + workArea.width - PET_WINDOW_SIZE))
    const clampedY = Math.max(workArea.y, Math.min(Math.round(y), workArea.y + workArea.height - PET_WINDOW_SIZE))
    petWindow.setBounds({ x: clampedX, y: clampedY, width: PET_WINDOW_SIZE, height: PET_WINDOW_SIZE })
    dialogueManager.updatePosition()
  })

  // Click-through control
  ipcMain.on('set-click-through', (_e, ignore: boolean) => {
    petWindow?.setIgnoreMouseEvents(ignore, { forward: true })
  })

  // Window drag
  ipcMain.on('drag-move', (_e, dx: number, dy: number) => {
    if (!petWindow) return
    const [x, y] = petWindow.getPosition()
    petWindow.setBounds({ x: x + dx, y: y + dy, width: PET_WINDOW_SIZE, height: PET_WINDOW_SIZE })
    dialogueManager.updatePosition()
  })

  // Update hit regions (for Windows click-through polling). The renderer
  // reports the sprite's own bounding box (in pet-window client coords), so
  // we also forward it to the dialogue manager — it anchors the bubble to
  // the sprite's actual top rather than the full window top.
  ipcMain.on('update-hit-regions', (_e, regions) => {
    hitRegions = regions
    dialogueManager?.setSpriteBounds(regions?.[0] ?? null)
  })

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

  // Dev-mode probe for renderer
  ipcMain.handle('is-dev-mode', () => is.dev)

  // Live pet-physics tuning (dev only). Not persisted — resets each launch.
  ipcMain.handle('get-pet-tuning', () => petTuning)
  ipcMain.handle('set-pet-tuning', (_e, patch: Partial<PetTuning>) => {
    if (!is.dev) return petTuning
    if (!patch || typeof patch !== 'object') return petTuning
    const next: PetTuning = {
      ...petTuning,
      animParams: { ...petTuning.animParams }
    }
    if (typeof patch.walkSpeed === 'number' && Number.isFinite(patch.walkSpeed)) {
      next.walkSpeed = patch.walkSpeed
    }
    if (typeof patch.gravity === 'number' && Number.isFinite(patch.gravity)) {
      next.gravity = patch.gravity
    }
    if ('animOverride' in patch) {
      const v = patch.animOverride
      next.animOverride =
        v === null || (typeof v === 'string' && (ALL_ANIM_STATES as string[]).includes(v))
          ? (v as PetTuning['animOverride'])
          : null
    }
    if (patch.animParams && typeof patch.animParams === 'object') {
      // Dev-only: shallow-merge whatever the renderer sent for each animation
      // state. Intentionally not whitelisting AnimParams fields — when a field
      // is added to shared/types, forgetting to teach this validator about it
      // means stale main silently drops the field and forces a restart. We
      // trust the (type-checked) renderer instead; only sanity-clamp the two
      // numeric fields physics actually reads.
      for (const state of ALL_ANIM_STATES) {
        const incoming = (patch.animParams as Record<string, unknown>)[state]
        if (!incoming || typeof incoming !== 'object') continue
        const current =
          next.animParams[state] ?? { ...DEFAULT_PET_TUNING.animParams[state] }
        const merged: AnimParams = { ...current, ...(incoming as Partial<AnimParams>) }
        merged.row =
          typeof merged.row === 'number' && Number.isFinite(merged.row)
            ? Math.max(0, Math.min(7, Math.round(merged.row)))
            : current.row
        next.animParams[state] = merged
      }
    }
    petTuning = next
    petWindow?.webContents.send('pet-tuning-update', petTuning)
    panelWindow?.webContents.send('pet-tuning-update', petTuning)
    return petTuning
  })

  // Sprite anchors (per-species AnchorBottom/PlaybackSpeed read from each
  // species' AnimData.xml). Shipped as an in-memory cache populated at boot;
  // dev-only writeback updates both the file and the cache, then broadcasts
  // the new map so the pet window can re-anchor without a restart.
  ipcMain.handle('get-sprite-anchors', (_e, speciesId?: number) => {
    if (typeof speciesId === 'number') return getSpriteAnchorsForSpecies(speciesId)
    return getSpriteAnchorStore()
  })
  ipcMain.handle(
    'update-sprite-anchors',
    async (_e, speciesId: number, patch: SpriteAnchorMap) => {
      if (!is.dev) return null
      if (typeof speciesId !== 'number' || !patch || typeof patch !== 'object') return null
      // Sanity-clamp incoming values per anim — renderer is type-checked but
      // keep main defensive against malformed IPC payloads.
      const sanitized: SpriteAnchorMap = {}
      for (const anim of ALL_PMD_ANIMS) {
        const entry = patch[anim]
        if (!entry || typeof entry !== 'object') continue
        const anchor = (entry as { anchorBottom?: unknown }).anchorBottom
        const speed = (entry as { speed?: unknown }).speed
        const cleaned: { anchorBottom?: number; speed?: number } = {}
        if (typeof anchor === 'number' && Number.isFinite(anchor)) {
          cleaned.anchorBottom = Math.max(0, Math.min(96, Math.round(anchor)))
        }
        if (typeof speed === 'number' && Number.isFinite(speed)) {
          cleaned.speed = Math.max(0.05, Math.min(5, Number(speed.toFixed(2))))
        }
        if (Object.keys(cleaned).length > 0) {
          sanitized[anim] = cleaned as { anchorBottom: number; speed: number }
        }
      }
      const next = await updateSpriteAnchors(speciesId, sanitized)
      if (next) {
        const payload = { speciesId, anchors: next }
        petWindow?.webContents.send('sprite-anchors-update', payload)
        panelWindow?.webContents.send('sprite-anchors-update', payload)
      }
      return next
    }
  )

  // Debug panel: atomically replace save data
  ipcMain.handle('debug-apply-save-data', (_e, incoming: SaveData) => {
    if (!is.dev) return false
    if (!incoming || typeof incoming !== 'object') return false

    // Cascade level-based evolutions (stone evolutions require manual item use).
    for (const p of incoming.pokemon) {
      cascadeLevelEvolution(p, incoming.pokedex)
    }

    // Sanity-fix activePokemonId — if it no longer refers to an owned pokemon, clear it.
    const ids = new Set(incoming.pokemon.map((p) => p.id))
    if (incoming.activePokemonId && !ids.has(incoming.activePokemonId)) {
      incoming.activePokemonId = null
    }

    // Keep pokedex consistent with current pokemon list.
    for (const p of incoming.pokemon) {
      if (!incoming.pokedex.includes(p.speciesId)) {
        incoming.pokedex.push(p.speciesId)
      }
    }

    saveData = incoming
    saveManager.save(saveData)
    broadcastSaveData()
    return true
  })
}

// Windows click-through polling (same pattern as claude-detector)
function startClickThroughPolling(): void {
  if (process.platform !== 'win32') return

  setInterval(() => {
    if (!petWindow) return
    const cursor = screen.getCursorScreenPoint()
    const [winX, winY] = petWindow.getPosition()
    const rx = cursor.x - winX
    const ry = cursor.y - winY

    const inside = hitRegions.some(
      (r) => rx >= r.x && rx <= r.x + r.width && ry >= r.y && ry <= r.y + r.height
    )

    if (inside !== cursorInside) {
      cursorInside = inside
      petWindow.setIgnoreMouseEvents(!inside, { forward: true })
    }
  }, 16)
}

// Periodic bounds safety net — pull pet back if it's off-screen
function startBoundsCheck(): void {
  setInterval(() => {
    if (!petWindow) return
    const [x, y] = petWindow.getPosition()
    const { workArea } = screen.getPrimaryDisplay()
    const maxX = workArea.x + workArea.width - PET_WINDOW_SIZE
    const maxY = workArea.y + workArea.height - PET_WINDOW_SIZE
    if (x < workArea.x || x > maxX || y < workArea.y || y > maxY) {
      const newX = Math.max(workArea.x, Math.min(x, maxX))
      const newY = Math.max(workArea.y, Math.min(y, maxY))
      petWindow.setBounds({ x: newX, y: newY, width: PET_WINDOW_SIZE, height: PET_WINDOW_SIZE })
    }
  }, 5000)
}

// Idle XP tick — every 60 seconds
function startIdleXpTick(): void {
  setInterval(() => {
    if (!saveData) return
    if (growthManager.tickIdle(saveData)) {
      saveManager.save(saveData)
      broadcastSaveData()
    }
    // Check fatigue
    if (fatigueDetector.check()) {
      petWindow?.webContents.send('fatigue-warning', null)
      const fatigueName = getActiveSpeciesName()
      if (fatigueName) dialogueManager.showDialogue(fatigueName, 'fatigue')
    }
  }, 60_000)
}

// Keyboard monitoring for XP and fatigue
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
