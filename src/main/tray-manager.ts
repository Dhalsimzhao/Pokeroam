import { Tray, Menu, nativeImage, BrowserWindow } from 'electron'
import { join } from 'path'
import { getLocale, type LangCode } from '../shared/i18n'

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

export function buildTrayMenu(
  tray: Tray,
  panelWindow: BrowserWindow,
  lang: LangCode,
  onLangChange: (lang: LangCode) => void,
  options?: {
    debugEnabled?: boolean
    onDebugToggle?: (enabled: boolean) => void
    onTestDialogue?: (eventType: string) => void
    isDev?: boolean
    onOpenDebugPanel?: () => void
  }
): void {
  const t = getLocale(lang)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: t.openPokeroam,
      click: () => {
        panelWindow.show()
        panelWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: t.debugOverlay,
      type: 'checkbox',
      checked: options?.debugEnabled ?? false,
      click: (item) => options?.onDebugToggle?.(item.checked)
    },
    ...(options?.onTestDialogue
      ? [
          {
            label: t.testDialogue,
            submenu: (
              [
                'idle',
                'levelup',
                'evolve',
                'feed',
                'drag',
                'fall',
                'fatigue',
                'dailyReward',
                'greeting',
                'longIdle'
              ] as const
            ).map((eventType) => ({
              label: eventType,
              click: () => options.onTestDialogue!(eventType)
            }))
          }
        ]
      : []),
    ...(options?.isDev && options?.onOpenDebugPanel
      ? [
          {
            label: t.debugPanel,
            click: () => options.onOpenDebugPanel!()
          }
        ]
      : []),
    {
      label: t.language,
      submenu: [
        {
          label: t.langZh,
          type: 'radio',
          checked: lang === 'zh',
          click: () => onLangChange('zh')
        },
        {
          label: t.langEn,
          type: 'radio',
          checked: lang === 'en',
          click: () => onLangChange('en')
        }
      ]
    },
    { type: 'separator' },
    {
      label: t.quit,
      click: () => {
        panelWindow.destroy()
        const { app } = require('electron')
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

export function createTray(
  panelWindow: BrowserWindow,
  lang: LangCode,
  onLangChange: (lang: LangCode) => void
): Tray {
  const tray = new Tray(createTrayIcon())
  tray.setToolTip('PokéRoam')

  buildTrayMenu(tray, panelWindow, lang, onLangChange)

  // Left-click opens panel (Windows / Linux)
  tray.on('click', () => {
    panelWindow.show()
    panelWindow.focus()
  })

  return tray
}
