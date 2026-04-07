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
