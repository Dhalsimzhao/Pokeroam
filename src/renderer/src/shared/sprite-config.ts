import type { PetAnimState, PokemonSpriteSet } from '../../../shared/types'

// Charmander (PMD Collab #0004)
import charmanderIdle from '../../../../resources/sprites/charmander/Idle-Anim.png'
import charmanderWalk from '../../../../resources/sprites/charmander/Walk-Anim.png'
import charmanderSleep from '../../../../resources/sprites/charmander/Sleep-Anim.png'
import charmanderHappy from '../../../../resources/sprites/charmander/Hop-Anim.png'
import charmanderEat from '../../../../resources/sprites/charmander/Eat-Anim.png'
import charmanderLevelup from '../../../../resources/sprites/charmander/Pose-Anim.png'
import charmanderEvolve from '../../../../resources/sprites/charmander/Charge-Anim.png'
import charmanderDragging from '../../../../resources/sprites/charmander/Swing-Anim.png'
import charmanderFalling from '../../../../resources/sprites/charmander/Hurt-Anim.png'

// PMD Collab direction rows: 0=Down 1=DownRight 2=Right 3=UpRight 4=Up 5=UpLeft 6=Left 7=DownLeft
// We use row 2 (Right) as default and canvas-flip for left-facing.
// Animations with only 1 row (Sleep, Eat) use row 0.
const RIGHT = 2

const CHARMANDER_SPRITES: PokemonSpriteSet = {
  idle: {
    src: charmanderIdle,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 4,
    durations: [12, 8, 8, 8],
    row: RIGHT
  },
  walk: {
    src: charmanderWalk,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: RIGHT
  },
  sleep: {
    src: charmanderSleep,
    frameWidth: 32,
    frameHeight: 24,
    frameCount: 2,
    durations: [30, 35],
    row: 0
  },
  happy: {
    src: charmanderHappy,
    frameWidth: 32,
    frameHeight: 88,
    frameCount: 10,
    durations: [2, 1, 2, 3, 4, 4, 3, 2, 1, 2],
    row: RIGHT
  },
  eat: {
    src: charmanderEat,
    frameWidth: 24,
    frameHeight: 32,
    frameCount: 4,
    durations: [6, 8, 6, 8],
    row: 0
  },
  levelup: {
    src: charmanderLevelup,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 3,
    durations: [12, 2, 8],
    row: RIGHT
  },
  evolve: {
    src: charmanderEvolve,
    frameWidth: 32,
    frameHeight: 40,
    frameCount: 10,
    durations: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    row: RIGHT
  },
  dragging: {
    src: charmanderDragging,
    frameWidth: 72,
    frameHeight: 80,
    frameCount: 9,
    durations: [2, 1, 2, 2, 3, 2, 2, 1, 1],
    row: RIGHT
  },
  falling: {
    src: charmanderFalling,
    frameWidth: 48,
    frameHeight: 56,
    frameCount: 2,
    durations: [2, 8],
    row: RIGHT
  }
}

/**
 * Registry of all Pokémon sprite sets, keyed by species ID.
 * More species will be added in Task 16.
 */
export const POKEMON_SPRITES: Record<number, PokemonSpriteSet> = {
  4: CHARMANDER_SPRITES // Charmander
}

/** Get the sprite config for a given species and animation state. */
export function getSpriteConfig(
  speciesId: number,
  animState: PetAnimState
): import('../../../shared/types').SpriteSheetConfig | null {
  const spriteSet = POKEMON_SPRITES[speciesId]
  if (!spriteSet) return null
  return spriteSet[animState] ?? spriteSet['idle'] ?? null
}
