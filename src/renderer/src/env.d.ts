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
  notifyDragEnd: () => void
  notifyLanded: () => void
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
  // Dialogue window events
  onDialogueShow: (cb: (data: unknown) => void) => () => void
  onDialogueHide: (cb: (data: unknown) => void) => () => void

  onToggleDebug: (cb: (enabled: boolean) => void) => () => void

  // Debug panel
  onPanelNavigate: (cb: (view: string) => void) => () => void
  applyDebugSaveData: (data: unknown) => Promise<boolean>
  isDevMode: () => Promise<boolean>

  // Dev-only pet physics tuning
  getPetTuning: () => Promise<import('../../shared/types').PetTuning>
  setPetTuning: (
    patch: Partial<import('../../shared/types').PetTuning>
  ) => Promise<import('../../shared/types').PetTuning>
  onPetTuningUpdate: (
    cb: (tuning: import('../../shared/types').PetTuning) => void
  ) => () => void

  // Sprite anchors (per-species AnchorBottom/PlaybackSpeed in AnimData.xml)
  getSpriteAnchors: {
    (): Promise<import('../../shared/sprite-anchors').SpriteAnchorStore>
    (speciesId: number): Promise<import('../../shared/sprite-anchors').SpriteAnchorMap>
  }
  updateSpriteAnchors: (
    speciesId: number,
    patch: import('../../shared/sprite-anchors').SpriteAnchorMap
  ) => Promise<import('../../shared/sprite-anchors').SpriteAnchorMap | null>
  onSpriteAnchorsUpdate: (
    cb: (payload: {
      speciesId: number
      anchors: import('../../shared/sprite-anchors').SpriteAnchorMap
    }) => void
  ) => () => void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}

export {}
