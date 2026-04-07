import * as crypto from 'crypto'
import type { SaveData, DailyReward } from '../shared/types'
import { POKEMON, getExpForLevel, getSpeciesById } from '../shared/pokemon-data'
import { DAILY_REWARD_HOUR } from '../shared/constants'

// Species tiers for reward generation
const COMMON_SPECIES = [1, 4, 7, 25, 54, 79, 172] // starters, Pikachu, Psyduck, Slowpoke, Pichu
const RARE_SPECIES = [39, 92, 133] // Jigglypuff, Gastly, Eevee

const REWARD_ITEMS = [
  { itemId: 'moomoo-milk', weight: 40 },
  { itemId: 'rare-candy', weight: 20 },
  { itemId: 'exp-share', weight: 10 },
  { itemId: 'fire-stone', weight: 8 },
  { itemId: 'water-stone', weight: 8 },
  { itemId: 'thunder-stone', weight: 8 },
  { itemId: 'moon-stone', weight: 6 }
]

export class DailyRewardManager {
  isAvailable(save: SaveData): boolean {
    const today = new Date().toISOString().split('T')[0]
    return save.player.lastDailyReward !== today && new Date().getHours() >= DAILY_REWARD_HOUR
  }

  generateReward(save: SaveData): DailyReward {
    // 40% Pokémon, 60% items
    if (Math.random() < 0.4) {
      return this.generatePokemonReward(save)
    }
    return this.generateItemReward()
  }

  claimReward(save: SaveData, reward: DailyReward): void {
    save.player.lastDailyReward = new Date().toISOString().split('T')[0]

    if (reward.type === 'pokemon' && reward.pokemonSpeciesId) {
      const species = getSpeciesById(reward.pokemonSpeciesId)
      if (species) {
        const level = 5
        save.pokemon.push({
          id: crypto.randomUUID(),
          speciesId: reward.pokemonSpeciesId,
          nickname: null,
          level,
          exp: getExpForLevel(species.expGroup, level),
          heldItemId: null
        })
        if (!save.pokedex.includes(reward.pokemonSpeciesId)) {
          save.pokedex.push(reward.pokemonSpeciesId)
        }
      }
    } else if (reward.items) {
      for (const ri of reward.items) {
        const existing = save.backpack.find((b) => b.itemId === ri.itemId)
        if (existing) existing.quantity += ri.quantity
        else save.backpack.push({ itemId: ri.itemId, quantity: ri.quantity })
      }
    }
  }

  private generatePokemonReward(save: SaveData): DailyReward {
    const ownedSpecies = new Set(save.pokemon.map((p) => p.speciesId))

    // Prefer species not yet owned
    const unowned = [...COMMON_SPECIES, ...RARE_SPECIES].filter((id) => !ownedSpecies.has(id))
    let speciesId: number

    if (unowned.length > 0) {
      speciesId = unowned[Math.floor(Math.random() * unowned.length)]
    } else {
      // All base forms owned — give random common
      speciesId = COMMON_SPECIES[Math.floor(Math.random() * COMMON_SPECIES.length)]
    }

    return { type: 'pokemon', pokemonSpeciesId: speciesId }
  }

  private generateItemReward(): DailyReward {
    const totalWeight = REWARD_ITEMS.reduce((sum, i) => sum + i.weight, 0)
    const items: Array<{ itemId: string; quantity: number }> = []

    // Give 1-3 items
    const count = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      let roll = Math.random() * totalWeight
      for (const ri of REWARD_ITEMS) {
        roll -= ri.weight
        if (roll <= 0) {
          const existing = items.find((x) => x.itemId === ri.itemId)
          if (existing) existing.quantity++
          else items.push({ itemId: ri.itemId, quantity: 1 })
          break
        }
      }
    }

    return { type: 'item', items }
  }
}
