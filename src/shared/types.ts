// ---- Save Data ----
export interface SaveData {
  player: PlayerData
  pokemon: OwnedPokemon[]
  activePokemonId: string | null
  backpack: BackpackItem[]
  pokedex: number[]
}

export interface PlayerData {
  createdAt: string
  lastLogin: string
  lastDailyReward: string // date string "YYYY-MM-DD"
}

export interface OwnedPokemon {
  id: string
  speciesId: number
  nickname: string | null
  level: number
  exp: number
  heldItemId: string | null
}

export interface BackpackItem {
  itemId: string
  quantity: number
}

// ---- Species Data ----
export interface PokemonSpecies {
  id: number
  name: string
  nameZh: string
  types: PokemonType[]
  baseExp: number
  expGroup: ExpGroup
  evolvesFrom: number | null
  evolutionLevel: number | null
  evolutionItem: string | null
}

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'fairy'

export type ExpGroup = 'fast' | 'medium-fast' | 'medium-slow' | 'slow'

// ---- Item Data ----
export interface ItemDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  category: 'food' | 'equipment' | 'ball'
  holdable: boolean
}

// ---- Sprite System ----
export interface SpriteSheetConfig {
  src: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  durations: number[]
  row?: number // grid row to render (for PMD Collab multi-direction sheets). Default: 0
}

export type PetAnimState =
  | 'idle'
  | 'walk'
  | 'sleep'
  | 'happy'
  | 'eat'
  | 'levelup'
  | 'evolve'
  | 'dragging'
  | 'falling'

export interface PokemonSpriteSet {
  [key: string]: SpriteSheetConfig
}

// ---- IPC Events ----
export interface PetWindowState {
  speciesId: number
  level: number
  animState: PetAnimState
  facingLeft: boolean
}

// ---- Daily Reward ----
export type RewardType = 'pokemon' | 'item'
export interface DailyReward {
  type: RewardType
  pokemonSpeciesId?: number
  items?: BackpackItem[]
}

// ---- Dialogue System ----
export type DialogueEmotion =
  | 'Normal'
  | 'Happy'
  | 'Pain'
  | 'Angry'
  | 'Worried'
  | 'Sad'
  | 'Crying'
  | 'Shouting'
  | 'Teary-Eyed'
  | 'Determined'
  | 'Joyous'
  | 'Inspired'
  | 'Surprised'
  | 'Dizzy'
  | 'Sigh'
  | 'Stunned'

export type DialogueEventType =
  | 'idle'
  | 'levelup'
  | 'evolve'
  | 'feed'
  | 'drag'
  | 'fall'
  | 'fatigue'
  | 'dailyReward'
  | 'greeting'
  | 'longIdle'
  | 'moodHappy'
  | 'moodEat'
  | 'moodSleep'

export interface DialogueEntry {
  emotion: DialogueEmotion
  text: string
}

export interface DialogueData {
  default: Record<DialogueEventType, DialogueEntry[]>
  species: Record<string, Partial<Record<DialogueEventType, DialogueEntry[]>>>
}

// ---- Dev-only live tuning (not persisted) ----
export interface AnimParams {
  /** Row (direction) of the sprite sheet to render, for multi-direction sheets. */
  row: number
  /**
   * Which sprite sheet to pull the animation from. Defaults to
   * `DEFAULT_SPRITE_KEYS[animState]` — e.g. idle falls back to the Hop sheet
   * so the pet jumps in place instead of standing stiff. Setting this from the
   * dev panel lets us preview any state with any of the species' available sheets.
   */
  spriteKey: PetAnimState
}

/**
 * Default mapping from the pet's PetAnimState to the sprite-set key it renders.
 * Idle redirects to Hop (facing the player); every other state uses its
 * matching sheet. Kept in sync with the filename table in sprite-config.
 */
export const DEFAULT_SPRITE_KEYS: Record<PetAnimState, PetAnimState> = {
  idle: 'happy',
  walk: 'walk',
  sleep: 'sleep',
  happy: 'happy',
  eat: 'eat',
  levelup: 'levelup',
  evolve: 'evolve',
  dragging: 'dragging',
  falling: 'falling'
}

export const ALL_ANIM_STATES: PetAnimState[] = [
  'idle', 'walk', 'sleep', 'happy', 'eat', 'levelup', 'evolve', 'dragging', 'falling'
]

export interface PetTuning {
  walkSpeed: number // pixels per frame (x axis)
  gravity: number // pixels per frame² (y axis when airborne)
  animOverride: PetAnimState | null // dev-only: force the pet into a specific animation
  animParams: Record<PetAnimState, AnimParams>
}

// Default row per animation. Idle uses the Hop sheet with row 0 (facing player);
// happy uses the same Hop sheet at row 2 (side-facing). Sleep/eat sheets only
// ship a single row of frames, so their default row is 0.
export const DEFAULT_ANIM_ROWS: Record<PetAnimState, number> = {
  idle: 0,
  walk: 2,
  sleep: 0,
  happy: 2,
  eat: 0,
  levelup: 2,
  evolve: 2,
  dragging: 2,
  falling: 2
}

function defaultAnimParams(): Record<PetAnimState, AnimParams> {
  const out = {} as Record<PetAnimState, AnimParams>
  for (const s of ALL_ANIM_STATES) {
    out[s] = {
      row: DEFAULT_ANIM_ROWS[s],
      spriteKey: DEFAULT_SPRITE_KEYS[s]
    }
  }
  return out
}

export const DEFAULT_PET_TUNING: PetTuning = {
  walkSpeed: 0.6,
  gravity: 0.5,
  animOverride: null,
  animParams: defaultAnimParams()
}

/** Which animations have more than one direction available in their sheet. */
export const MULTI_DIRECTION_ANIMS: ReadonlySet<PetAnimState> = new Set<PetAnimState>([
  'idle', 'walk', 'happy', 'levelup', 'evolve', 'dragging', 'falling'
])
