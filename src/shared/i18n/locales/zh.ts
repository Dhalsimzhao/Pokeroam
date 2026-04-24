import type { Locale } from '../types'

export const zh: Locale = {
  // Common
  back: '返回',
  comingSoon: '即将推出...',

  // Bedroom
  pokeroamTitle: 'PokéRoam',
  pc: 'PC',
  pokemonPC: '宝可梦 PC',
  pokedex: '图鉴',
  backpack: '背包',
  dailyReward: '每日奖励',

  // Pokemon PC
  actions: '操作',
  recall: '收回',
  release: '放出',
  unequip: '取出道具',
  equip: '装备道具',
  pokemonCount: '{count} 只宝可梦',
  onDesktop: '桌面上',

  // Pokedex
  list: '列表',
  discovered: '已发现',
  evolutionChain: '进化链',
  lv: 'Lv.',
  individualInfo: '个体信息',
  baseExp: '基础经验',
  expGroup: '经验组',
  expGroupFast: '快',
  expGroupMediumFast: '较快',
  expGroupMediumSlow: '较慢',
  expGroupSlow: '慢',

  // Backpack
  items: '件道具',
  backpackEmpty: '背包是空的',
  quantity: '数量：',
  giveTo: '给予...',
  useOn: '使用...',

  // Daily Reward
  clickToOpen: '点击打开！',
  itemsReceived: '获得了道具！',
  noRewardToday: '今天没有奖励了',
  nice: '太好了！',
  rewardHint: '每天早上 8 点后刷新奖励',
  joinedTeam: '加入了你的队伍！',

  // Starter Select
  choosePartner: '选择你的伙伴！',
  starterHint: '点击精灵球开始你的旅程',
  choseYou: '选择了你！',

  // Pet window
  noSprite: '无精灵',

  // Tray / Context menu
  openPokeroam: '打开 PokéRoam',
  quit: '退出',
  feed: '喂食',
  noFoodItems: '没有食物',

  // Debug
  debugOverlay: '调试信息',
  testDialogue: '测试对话',
  debugPanel: '调试面板',
  debugTabPokemon: '宝可梦',
  debugTabBackpack: '背包',
  debugAddPokemon: '添加宝可梦',
  debugAddItem: '添加道具',
  debugLevel: '等级',
  debugHeldItem: '持有道具',
  debugHeldItemNone: '无',
  debugRemove: '删除',
  debugEditPokemon: '编辑宝可梦',
  debugConfirm: '确认',
  debugCancel: '取消',
  debugQuantity: '数量',
  debugUnsavedChanges: '有未保存的改动',
  debugTabTuning: '调参',
  debugTabAnim: '动画',
  debugAnimSpecies: '宝可梦',
  debugAnimHint: '所有动画在此循环播放，滑动参数实时预览。',
  debugTuningWalkSpeed: '走路速度（像素/帧）',
  debugTuningGravity: '重力（像素/帧²）',
  debugTuningAnimSpeed: '播放速度',
  debugTuningAnimAnchorBottom: '脚底基线',
  debugAnimUpdateXml: '更新 XML',
  debugAnimUpdateXmlHint: '把当前调好的脚底基线和原生速度写回该宝可梦的 AnimData.xml，并即时推送给宠物窗口',
  debugAnimRevertDraft: '撤销改动',
  debugAnimRevertDraftHint: '把所有滑杆值恢复成 XML 里已保存的值',
  debugAnimCopyCodeDefaults: '复制代码默认值',
  debugAnimCopyCodeDefaultsHint: '把当前 row / spriteKey 以 TS 字面量形式拷到剪贴板，粘进 shared/types.ts 的 DEFAULT_ANIM_ROWS / DEFAULT_SPRITE_KEYS',
  debugTuningAnimDirection: '朝向',
  debugAnimSource: '素材',
  debugTuningAnimOverride: '强制动画',
  debugTuningAnimOverrideHint: '选择后将强制播放指定动画，方便预览各帧效果。设为“自动”恢复物理驱动。',
  debugTuningAnimAuto: '自动',
  debugTuningReset: '恢复默认',
  debugTuningHint: '改动实时生效，重启后恢复默认。',
  debugAnimDirDown: '朝下（面向玩家）',
  debugAnimDirDownRight: '右下',
  debugAnimDirRight: '朝右',
  debugAnimDirUpRight: '右上',
  debugAnimDirUp: '朝上（背向玩家）',
  debugAnimDirUpLeft: '左上',
  debugAnimDirLeft: '朝左',
  debugAnimDirDownLeft: '左下',

  // Language
  language: '语言',
  langZh: '中文',
  langEn: 'English'
}
