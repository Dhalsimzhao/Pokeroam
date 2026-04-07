import { app, BrowserWindow, ipcMain, screen, Tray } from 'electron'
import { SaveManager } from './save-manager'
import { createPetWindow } from './pet-window'
import { createPanelWindow } from './panel-window'
import { createTray } from './tray-manager'
import type { SaveData } from '../shared/types'

let petWindow: BrowserWindow | null = null
let panelWindow: BrowserWindow | null = null
let _tray: Tray | null = null
let saveManager: SaveManager
let saveData: SaveData | null = null

// Hit regions for Windows click-through polling
let hitRegions: Array<{ x: number; y: number; width: number; height: number }> = []
let cursorInside = false

app.whenReady().then(() => {
  saveManager = new SaveManager()
  saveData = saveManager.load()

  petWindow = createPetWindow()
  panelWindow = createPanelWindow()
  _tray = createTray(panelWindow)

  // If no save (first launch), show panel for starter selection
  if (!saveData) {
    panelWindow.show()
  } else {
    // Update lastLogin
    saveData.player.lastLogin = new Date().toISOString()
    saveManager.save(saveData)
    // Send initial pet state to pet window once it finishes loading
    petWindow.webContents.on('did-finish-load', () => {
      sendPetState()
    })
  }

  setupIpcHandlers()
  startClickThroughPolling()
})

// Don't quit when all windows closed (tray app)
app.on('window-all-closed', () => {
  // Do nothing — app stays alive for the tray/pet window
})

function broadcastSaveData(): void {
  panelWindow?.webContents.send('save-data-changed', saveData)
  sendPetState()
}

function sendPetState(): void {
  if (!saveData?.activePokemonId) {
    petWindow?.webContents.send('pet-state-update', null)
    return
  }
  const pokemon = saveData.pokemon.find((p) => p.id === saveData!.activePokemonId)
  if (pokemon) {
    petWindow?.webContents.send('pet-state-update', {
      speciesId: pokemon.speciesId,
      level: pokemon.level,
      nickname: pokemon.nickname
    })
  }
}

function setupIpcHandlers(): void {
  // Get save data (for panel window)
  ipcMain.handle('get-save-data', () => saveData)

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

  // Use item on Pokemon (will be expanded in Task 12)
  ipcMain.handle('use-item', (_e, _itemId: string, _pokemonId: string) => {
    // Placeholder - full implementation in Task 12 (Backpack Panel)
    return false
  })

  // Claim daily reward (placeholder for Task 15)
  ipcMain.handle('claim-daily-reward', () => {
    return null
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
    petWindow?.setPosition(Math.round(x), Math.round(y))
  })

  // Click-through control
  ipcMain.on('set-click-through', (_e, ignore: boolean) => {
    petWindow?.setIgnoreMouseEvents(ignore, { forward: true })
  })

  // Window drag
  ipcMain.on('drag-move', (_e, dx: number, dy: number) => {
    if (!petWindow) return
    const [x, y] = petWindow.getPosition()
    petWindow.setPosition(x + dx, y + dy)
  })

  // Update hit regions (for Windows click-through polling)
  ipcMain.on('update-hit-regions', (_e, regions) => {
    hitRegions = regions
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
