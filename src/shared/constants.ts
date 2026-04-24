export const IDLE_XP_PER_MINUTE = 2
export const KEYBOARD_XP_PER_KEYSTROKE = 1
export const KEYBOARD_XP_COOLDOWN_MS = 500
export const FATIGUE_ACTIVE_MINUTES = 45
export const FATIGUE_BREAK_MINUTES = 5
export const DAILY_REWARD_HOUR = 8
export const MAX_LEVEL = 100
export const SAVE_DIR = '.pokeroam'
export const SAVE_FILE = 'save.json'
export const STARTER_SPECIES = [1, 4, 7] as const
export const IDLE_CHAT_MIN_MS = 120_000 // 2 minutes
export const IDLE_CHAT_MAX_MS = 300_000 // 5 minutes
export const LONG_IDLE_THRESHOLD_MS = 600_000 // 10 minutes
export const GREETING_DELAY_MS = 2000

// Square size of the pet BrowserWindow in CSS px. Must be >= the scaled
// bounding box of every animation frame across all species; the sprite is
// bottom-center anchored inside and can use the full area for tall poses
// (hop/swing/charge). Shared so main & renderer agree on physics math.
export const PET_WINDOW_SIZE = 224
