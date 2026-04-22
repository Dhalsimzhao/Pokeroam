import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export function createPanelWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    show: false,
    frame: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.setMenuBarVisibility(false)

  // Load panel.html
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/panel.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/panel.html'))
  }

  // Prevent window from being destroyed, just hide it
  win.on('close', (e) => {
    e.preventDefault()
    win.hide()
  })

  return win
}
