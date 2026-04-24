import type { Locale } from '../types'

export const en: Locale = {
  // Common
  back: 'Back',
  comingSoon: 'Coming soon...',

  // Bedroom
  pokeroamTitle: 'PokéRoam',
  pc: 'PC',
  pokemonPC: 'Pokemon PC',
  pokedex: 'Pokedex',
  backpack: 'Backpack',
  dailyReward: 'Daily Reward',

  // Pokemon PC
  actions: 'Actions',
  recall: 'Recall',
  release: 'Release',
  unequip: 'Unequip',
  equip: 'Equip',
  pokemonCount: '{count} Pokemon',
  onDesktop: 'ON DESKTOP',

  // Pokedex
  list: 'List',
  discovered: 'discovered',
  evolutionChain: 'Evolution Chain',
  lv: 'Lv.',
  individualInfo: 'Individual Info',
  baseExp: 'Base Exp',
  expGroup: 'Exp Group',
  expGroupFast: 'Fast',
  expGroupMediumFast: 'Medium Fast',
  expGroupMediumSlow: 'Medium Slow',
  expGroupSlow: 'Slow',

  // Backpack
  items: 'items',
  backpackEmpty: 'Backpack is empty',
  quantity: 'Quantity: ',
  giveTo: 'Give to...',
  useOn: 'Use on...',

  // Daily Reward
  clickToOpen: 'Click to open!',
  itemsReceived: 'Items received!',
  noRewardToday: 'No reward available today',
  nice: 'Nice!',
  rewardHint: 'New rewards available daily after 8 AM',
  joinedTeam: 'joined your team!',

  // Starter Select
  choosePartner: 'Choose Your Partner!',
  starterHint: 'Click a Poké Ball to begin your journey',
  choseYou: 'chose you!',

  // Pet window
  noSprite: 'No sprite',

  // Tray / Context menu
  openPokeroam: 'Open PokéRoam',
  quit: 'Quit',
  feed: 'Feed',
  noFoodItems: 'No food items',

  // Debug
  debugOverlay: 'Debug Overlay',
  testDialogue: 'Test Dialogue',
  debugPanel: 'Debug Panel',
  debugTabPokemon: 'Pokemon',
  debugTabBackpack: 'Backpack',
  debugAddPokemon: 'Add Pokemon',
  debugAddItem: 'Add Item',
  debugLevel: 'Level',
  debugHeldItem: 'Held Item',
  debugHeldItemNone: 'None',
  debugRemove: 'Remove',
  debugEditPokemon: 'Edit Pokemon',
  debugConfirm: 'Confirm',
  debugCancel: 'Cancel',
  debugQuantity: 'Quantity',
  debugUnsavedChanges: 'Unsaved changes',
  debugTabTuning: 'Tuning',
  debugTabAnim: 'Anim',
  debugAnimSpecies: 'Pokemon',
  debugAnimHint: 'All animations loop here; slide params to preview live.',
  debugTuningWalkSpeed: 'Walk Speed (px/frame)',
  debugTuningGravity: 'Gravity (px/frame²)',
  debugTuningAnimSpeed: 'Speed',
  debugTuningAnimAnchorBottom: 'Foot anchor',
  debugAnimUpdateXml: 'Update XML',
  debugAnimUpdateXmlHint: 'Write the current foot anchor + native speed values back to this species\' AnimData.xml and push the change to the pet window',
  debugAnimRevertDraft: 'Revert',
  debugAnimRevertDraftHint: 'Reset all sliders to the values currently saved in XML',
  debugAnimCopyCodeDefaults: 'Copy code defaults',
  debugAnimCopyCodeDefaultsHint: 'Copy current row / spriteKey choices as TS literals you can paste into DEFAULT_ANIM_ROWS / DEFAULT_SPRITE_KEYS in shared/types.ts',
  debugTuningAnimDirection: 'Facing',
  debugAnimSource: 'Sheet',
  debugTuningAnimOverride: 'Force animation',
  debugTuningAnimOverrideHint: 'Pin the pet to a specific animation for preview. Set to "auto" to resume physics control.',
  debugTuningAnimAuto: 'auto',
  debugTuningReset: 'Reset to defaults',
  debugTuningHint: 'Changes apply live and reset on restart.',
  debugAnimDirDown: 'Down (facing player)',
  debugAnimDirDownRight: 'Down-Right',
  debugAnimDirRight: 'Right',
  debugAnimDirUpRight: 'Up-Right',
  debugAnimDirUp: 'Up (back to player)',
  debugAnimDirUpLeft: 'Up-Left',
  debugAnimDirLeft: 'Left',
  debugAnimDirDownLeft: 'Down-Left',

  // Language
  language: 'Language',
  langZh: '中文',
  langEn: 'English'
}
