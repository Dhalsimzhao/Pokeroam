import { contextBridge, ipcRenderer } from 'electron'

type Callback<T = unknown> = (data: T) => void

function onIpc<T>(channel: string, cb: Callback<T>): () => void {
  const handler = (_event: Electron.IpcRendererEvent, data: T): void => cb(data)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

contextBridge.exposeInMainWorld('api', {
  platform: process.platform,

  // Pet window events
  onPetStateUpdate: (cb: Callback) => onIpc('pet-state-update', cb),
  onDragChange: (cb: Callback) => onIpc('drag-change', cb),
  onFatigueWarning: (cb: Callback) => onIpc('fatigue-warning', cb),
  onLevelUp: (cb: Callback) => onIpc('pet-level-up', cb),
  onEvolve: (cb: Callback) => onIpc('pet-evolve', cb),

  // Pet state query (pull model)
  getPetState: () => ipcRenderer.invoke('get-pet-state'),

  // Pet window commands
  setClickThrough: (ignore: boolean): void => {
    ipcRenderer.send('set-click-through', ignore)
  },
  dragMove: (dx: number, dy: number): void => {
    ipcRenderer.send('drag-move', dx, dy)
  },
  notifyDragEnd: (): void => {
    ipcRenderer.send('pet-drag-end')
  },
  notifyLanded: (): void => {
    ipcRenderer.send('pet-landed')
  },
  setPetPosition: (x: number, y: number): void => {
    ipcRenderer.send('set-pet-position', x, y)
  },
  getWorkArea: () => ipcRenderer.invoke('get-work-area'),
  updateHitRegions: (
    regions: Array<{ x: number; y: number; width: number; height: number }>
  ): void => {
    ipcRenderer.send('update-hit-regions', regions)
  },

  // Panel window events
  onSaveDataChanged: (cb: Callback) => onIpc('save-data-changed', cb),

  // Panel window commands (invoke = async, returns promise)
  getSaveData: () => ipcRenderer.invoke('get-save-data'),
  chooseStarter: (speciesId: number) => ipcRenderer.invoke('choose-starter', speciesId),
  releasePokemon: (pokemonId: string) => ipcRenderer.invoke('release-pokemon', pokemonId),
  recallPokemon: () => ipcRenderer.invoke('recall-pokemon'),
  equipItem: (pokemonId: string, itemId: string) =>
    ipcRenderer.invoke('equip-item', pokemonId, itemId),
  unequipItem: (pokemonId: string) => ipcRenderer.invoke('unequip-item', pokemonId),
  useItem: (itemId: string, pokemonId: string) =>
    ipcRenderer.invoke('use-item', itemId, pokemonId),
  claimDailyReward: () => ipcRenderer.invoke('claim-daily-reward'),
  isDailyRewardAvailable: () => ipcRenderer.invoke('is-daily-reward-available'),

  // Context menu
  showContextMenu: (): void => {
    ipcRenderer.send('show-context-menu')
  },

  // Window management
  openPanel: (): void => {
    ipcRenderer.send('open-panel')
  },

  // Locale
  setLocale: (lang: string): void => {
    ipcRenderer.send('set-locale', lang)
  },
  onLocaleChanged: (cb: Callback) => onIpc('locale-changed', cb),

  // Dialogue window events
  onDialogueShow: (cb: Callback) => onIpc('dialogue-show', cb),
  onDialogueHide: (cb: Callback) => onIpc('dialogue-hide', cb),

  // Debug
  onToggleDebug: (cb: Callback<boolean>) => onIpc('toggle-debug', cb),

  // Debug panel
  onPanelNavigate: (cb: Callback<string>) => onIpc('panel-navigate', cb),
  applyDebugSaveData: (data: unknown) => ipcRenderer.invoke('debug-apply-save-data', data),
  isDevMode: () => ipcRenderer.invoke('is-dev-mode')
})
