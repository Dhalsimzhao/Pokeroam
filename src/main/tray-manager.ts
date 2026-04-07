import { Tray, Menu, nativeImage, BrowserWindow } from 'electron'
import { join } from 'path'

function createTrayIcon(): Electron.NativeImage {
  const iconPath = join(__dirname, '../../resources/icon.png')
  const icon = nativeImage.createFromPath(iconPath)

  if (process.platform === 'darwin') {
    const resized = icon.resize({ width: 22, height: 22 })
    resized.setTemplateImage(true)
    return resized
  }

  return icon.resize({ width: 16, height: 16 })
}

export function createTray(panelWindow: BrowserWindow): Tray {
  const tray = new Tray(createTrayIcon())
  tray.setToolTip('PokéRoam')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PokéRoam',
      click: () => {
        panelWindow.show()
        panelWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        // Force quit — bypass panel window close prevention
        panelWindow.destroy()
        const { app } = require('electron')
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // Left-click opens panel (Windows / Linux)
  tray.on('click', () => {
    panelWindow.show()
    panelWindow.focus()
  })

  return tray
}
