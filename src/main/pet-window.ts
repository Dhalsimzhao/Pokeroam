import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { PET_WINDOW_SIZE } from '../shared/constants'

export function createPetWindow(): BrowserWindow {
  const { workArea } = screen.getPrimaryDisplay()

  const win = new BrowserWindow({
    width: PET_WINDOW_SIZE,
    height: PET_WINDOW_SIZE,
    x: workArea.x + workArea.width - PET_WINDOW_SIZE - 20,
    y: workArea.y + workArea.height - PET_WINDOW_SIZE,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  if (process.platform === 'darwin') {
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  }

  // Initial click-through (will be toggled by hit-region detection)
  win.setIgnoreMouseEvents(true, { forward: true })

  // Load pet.html
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/pet.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/pet.html'))
  }

  return win
}
