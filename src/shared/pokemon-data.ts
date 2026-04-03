import type { BackpackItem, ExpGroup, OwnedPokemon, PokemonSpecies } from './types'

export const POKEMON_SPECIES: PokemonSpecies[] = [
  // ---- Bulbasaur line ----
  {
    id: 1,
    name: 'Bulbasaur',
    nameZh: '妙蛙种子',
    types: ['grass', 'poison'],
    baseExp: 64,
    expGroup: 'medium-slow',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 2,
    name: 'Ivysaur',
    nameZh: '妙蛙草',
    types: ['grass', 'poison'],
    baseExp: 142,
    expGroup: 'medium-slow',
    evolvesFrom: 1,
    evolutionLevel: 16,
    evolutionItem: null
  },
  {
    id: 3,
    name: 'Venusaur',
    nameZh: '妙蛙花',
    types: ['grass', 'poison'],
    baseExp: 236,
    expGroup: 'medium-slow',
    evolvesFrom: 2,
    evolutionLevel: 32,
    evolutionItem: null
  },

  // ---- Charmander line ----
  {
    id: 4,
    name: 'Charmander',
    nameZh: '小火龙',
    types: ['fire'],
    baseExp: 62,
    expGroup: 'medium-slow',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 5,
    name: 'Charmeleon',
    nameZh: '火恐龙',
    types: ['fire'],
    baseExp: 142,
    expGroup: 'medium-slow',
    evolvesFrom: 4,
    evolutionLevel: 16,
    evolutionItem: null
  },
  {
    id: 6,
    name: 'Charizard',
    nameZh: '喷火龙',
    types: ['fire', 'flying'],
    baseExp: 240,
    expGroup: 'medium-slow',
    evolvesFrom: 5,
    evolutionLevel: 36,
    evolutionItem: null
  },

  // ---- Squirtle line ----
  {
    id: 7,
    name: 'Squirtle',
    nameZh: '杰尼龟',
    types: ['water'],
    baseExp: 63,
    expGroup: 'medium-slow',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 8,
    name: 'Wartortle',
    nameZh: '卡咪龟',
    types: ['water'],
    baseExp: 142,
    expGroup: 'medium-slow',
    evolvesFrom: 7,
    evolutionLevel: 16,
    evolutionItem: null
  },
  {
    id: 9,
    name: 'Blastoise',
    nameZh: '水箭龟',
    types: ['water'],
    baseExp: 239,
    expGroup: 'medium-slow',
    evolvesFrom: 8,
    evolutionLevel: 36,
    evolutionItem: null
  },

  // ---- Pikachu line ----
  {
    id: 172,
    name: 'Pichu',
    nameZh: '皮丘',
    types: ['electric'],
    baseExp: 41,
    expGroup: 'medium-fast',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 25,
    name: 'Pikachu',
    nameZh: '皮卡丘',
    types: ['electric'],
    baseExp: 112,
    expGroup: 'medium-fast',
    evolvesFrom: 172,
    evolutionLevel: 15,
    evolutionItem: null
  },
  {
    id: 26,
    name: 'Raichu',
    nameZh: '雷丘',
    types: ['electric'],
    baseExp: 218,
    expGroup: 'medium-fast',
    evolvesFrom: 25,
    evolutionLevel: null,
    evolutionItem: 'thunder-stone'
  },

  // ---- Jigglypuff line ----
  {
    id: 39,
    name: 'Jigglypuff',
    nameZh: '胖丁',
    types: ['normal', 'fairy'],
    baseExp: 95,
    expGroup: 'fast',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 40,
    name: 'Wigglytuff',
    nameZh: '胖可丁',
    types: ['normal', 'fairy'],
    baseExp: 196,
    expGroup: 'fast',
    evolvesFrom: 39,
    evolutionLevel: null,
    evolutionItem: 'moon-stone'
  },

  // ---- Psyduck line ----
  {
    id: 54,
    name: 'Psyduck',
    nameZh: '可达鸭',
    types: ['water'],
    baseExp: 64,
    expGroup: 'medium-fast',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 55,
    name: 'Golduck',
    nameZh: '哥达鸭',
    types: ['water'],
    baseExp: 175,
    expGroup: 'medium-fast',
    evolvesFrom: 54,
    evolutionLevel: 33,
    evolutionItem: null
  },

  // ---- Slowpoke line ----
  {
    id: 79,
    name: 'Slowpoke',
    nameZh: '呆呆兽',
    types: ['water', 'psychic'],
    baseExp: 63,
    expGroup: 'medium-fast',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 80,
    name: 'Slowbro',
    nameZh: '呆壳兽',
    types: ['water', 'psychic'],
    baseExp: 172,
    expGroup: 'medium-fast',
    evolvesFrom: 79,
    evolutionLevel: 37,
    evolutionItem: null
  },

  // ---- Gastly line ----
  {
    id: 92,
    name: 'Gastly',
    nameZh: '鬼斯',
    types: ['ghost', 'poison'],
    baseExp: 62,
    expGroup: 'medium-slow',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 93,
    name: 'Haunter',
    nameZh: '鬼斯通',
    types: ['ghost', 'poison'],
    baseExp: 142,
    expGroup: 'medium-slow',
    evolvesFrom: 92,
    evolutionLevel: 25,
    evolutionItem: null
  },
  {
    id: 94,
    name: 'Gengar',
    nameZh: '耿鬼',
    types: ['ghost', 'poison'],
    baseExp: 225,
    expGroup: 'medium-slow',
    evolvesFrom: 93,
    evolutionLevel: 38,
    evolutionItem: null
  },

  // ---- Eevee line ----
  {
    id: 133,
    name: 'Eevee',
    nameZh: '伊布',
    types: ['normal'],
    baseExp: 65,
    expGroup: 'medium-fast',
    evolvesFrom: null,
    evolutionLevel: null,
    evolutionItem: null
  },
  {
    id: 134,
    name: 'Vaporeon',
    nameZh: '水伊布',
    types: ['water'],
    baseExp: 184,
    expGroup: 'medium-fast',
    evolvesFrom: 133,
    evolutionLevel: null,
    evolutionItem: 'water-stone'
  },
  {
    id: 135,
    name: 'Jolteon',
    nameZh: '雷伊布',
    types: ['electric'],
    baseExp: 184,
    expGroup: 'medium-fast',
    evolvesFrom: 133,
    evolutionLevel: null,
    evolutionItem: 'thunder-stone'
  },
  {
    id: 136,
    name: 'Flareon',
    nameZh: '火伊布',
    types: ['fire'],
    baseExp: 184,
    expGroup: 'medium-fast',
    evolvesFrom: 133,
    evolutionLevel: null,
    evolutionItem: 'fire-stone'
  }
]

/** Build a map for O(1) lookups by species id */
const speciesMap = new Map<number, PokemonSpecies>(
  POKEMON_SPECIES.map((s) => [s.id, s])
)

/**
 * XP required to reach level `n` for a given experience group.
 * Uses the standard Pokemon formulas from the main-series games.
 */
export function getExpForLevel(group: ExpGroup, level: number): number {
  if (level <= 1) return 0
  const n = level
  switch (group) {
    case 'fast':
      return Math.floor(0.8 * n * n * n)
    case 'medium-fast':
      return n * n * n
    case 'medium-slow':
      return Math.floor(1.2 * n * n * n - 15 * n * n + 100 * n - 140)
    case 'slow':
      return Math.floor(1.25 * n * n * n)
  }
}

/** Look up a species by its national dex number. */
export function getSpeciesById(id: number): PokemonSpecies | undefined {
  return speciesMap.get(id)
}

/**
 * Return the full evolution chain for a given species id.
 *
 * Walks up to the base form, then collects every species reachable
 * by walking down `evolvesFrom` links. For branching evolutions like
 * Eevee the array contains all branches (e.g. [Eevee, Vaporeon, Jolteon, Flareon]).
 */
export function getEvolutionChain(speciesId: number): PokemonSpecies[] {
  const species = speciesMap.get(speciesId)
  if (!species) return []

  // Walk up to the root of the chain
  let root = species
  while (root.evolvesFrom !== null) {
    const parent = speciesMap.get(root.evolvesFrom)
    if (!parent) break
    root = parent
  }

  // BFS down from root collecting all descendants
  const chain: PokemonSpecies[] = [root]
  const queue: number[] = [root.id]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    for (const s of POKEMON_SPECIES) {
      if (s.evolvesFrom === currentId) {
        chain.push(s)
        queue.push(s.id)
      }
    }
  }

  return chain
}

/**
 * Check whether a Pokemon can evolve right now.
 *
 * Returns the target species id and, if applicable, which item is required.
 * For Eevee (multiple stone evolutions) the first matching stone in the
 * backpack determines the target.
 */
export function canEvolve(
  pokemon: OwnedPokemon,
  backpackItems: BackpackItem[]
): { canEvolve: boolean; targetSpeciesId?: number; requiresItem?: string } {
  // Find all species that evolve from this one
  const evolutions = POKEMON_SPECIES.filter((s) => s.evolvesFrom === pokemon.speciesId)
  if (evolutions.length === 0) {
    return { canEvolve: false }
  }

  for (const evo of evolutions) {
    // Level-based evolution
    if (evo.evolutionLevel !== null && evo.evolutionItem === null) {
      if (pokemon.level >= evo.evolutionLevel) {
        return { canEvolve: true, targetSpeciesId: evo.id }
      }
    }

    // Item-based evolution
    if (evo.evolutionItem !== null) {
      const hasItem = backpackItems.some(
        (item) => item.itemId === evo.evolutionItem && item.quantity > 0
      )
      if (hasItem) {
        return { canEvolve: true, targetSpeciesId: evo.id, requiresItem: evo.evolutionItem }
      }
    }
  }

  return { canEvolve: false }
}
