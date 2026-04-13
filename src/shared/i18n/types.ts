export type LangCode = 'zh' | 'en'

export interface Locale {
  // Common
  back: string
  comingSoon: string

  // Bedroom
  pokeroamTitle: string
  pc: string
  pokemonPC: string
  pokedex: string
  backpack: string
  dailyReward: string

  // Pokemon PC
  actions: string
  recall: string
  release: string
  unequip: string
  equip: string
  pokemonCount: string
  onDesktop: string

  // Pokedex
  list: string
  discovered: string
  evolutionChain: string
  lv: string
  individualInfo: string
  baseExp: string
  expGroup: string
  expGroupFast: string
  expGroupMediumFast: string
  expGroupMediumSlow: string
  expGroupSlow: string

  // Backpack
  items: string
  backpackEmpty: string
  quantity: string
  giveTo: string
  useOn: string

  // Daily Reward
  clickToOpen: string
  itemsReceived: string
  noRewardToday: string
  nice: string
  rewardHint: string
  joinedTeam: string

  // Starter Select
  choosePartner: string
  starterHint: string
  choseYou: string

  // Pet window
  noSprite: string

  // Tray / Context menu
  openPokeroam: string
  quit: string
  feed: string
  noFoodItems: string

  // Debug
  debugOverlay: string

  // Language
  language: string
  langZh: string
  langEn: string
}
