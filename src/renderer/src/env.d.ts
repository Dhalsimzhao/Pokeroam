/// <reference types="vite/client" />

interface ElectronAPI {
  platform: string

  // Pet state query
  getPetState: () => Promise<{ speciesId: number; level: number; nickname: string | null } | null>

  // Pet window events (returns unsubscribe function)
  onPetStateUpdate: (cb: (data: unknown) => void) => () => void
  onDragChange: (cb: (data: unknown) => void) => () => void
  onFatigueWarning: (cb: (data: unknown) => void) => () => void
  onLevelUp: (cb: (data: unknown) => void) => () => void
  onEvolve: (cb: (data: unknown) => void) => () => void

  // Pet window commands
  setClickThrough: (ignore: boolean) => void
  dragMove: (dx: number, dy: number) => void
  setPetPosition: (x: number, y: number) => void
  getWorkArea: () => Promise<{ x: number; y: number; width: number; height: number }>
  updateHitRegions: (
    regions: Array<{ x: number; y: number; width: number; height: number }>
  ) => void

  // Panel window events
  onSaveDataChanged: (cb: (data: unknown) => void) => () => void

  // Panel window commands
  getSaveData: () => Promise<unknown>
  chooseStarter: (speciesId: number) => Promise<unknown>
  releasePokemon: (pokemonId: string) => Promise<boolean>
  recallPokemon: () => Promise<boolean>
  equipItem: (pokemonId: string, itemId: string) => Promise<boolean>
  unequipItem: (pokemonId: string) => Promise<boolean>
  useItem: (itemId: string, pokemonId: string) => Promise<boolean>
  claimDailyReward: () => Promise<unknown>
  isDailyRewardAvailable: () => Promise<boolean>
  showContextMenu: () => void
  openPanel: () => void
  setLocale: (lang: string) => void
  onLocaleChanged: (cb: (data: unknown) => void) => () => void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}

export {}
