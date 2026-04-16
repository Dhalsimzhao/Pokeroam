import type { BrowserWindow } from 'electron'
import type { SaveData, OwnedPokemon } from '../shared/types'
import { POKEMON_SPECIES, getSpeciesById, getExpForLevel } from '../shared/pokemon-data'
import { IDLE_XP_PER_MINUTE, KEYBOARD_XP_PER_KEYSTROKE, MAX_LEVEL } from '../shared/constants'

export class GrowthManager {
  private petWindow: BrowserWindow | null = null
  onLevelUp?: (pokemonId: string) => void
  onEvolve?: (pokemonId: string) => void

  setPetWindow(win: BrowserWindow): void {
    this.petWindow = win
  }

  /** Called every 60 seconds. Returns true if save data was mutated. */
  tickIdle(save: SaveData): boolean {
    return this.distributeXp(save, IDLE_XP_PER_MINUTE)
  }

  /** Called on keyboard activity. Returns true if save data was mutated. */
  addKeyboardXp(save: SaveData): boolean {
    return this.distributeXp(save, KEYBOARD_XP_PER_KEYSTROKE)
  }

  /** Add XP to active Pokémon and Exp. Share holders. */
  private distributeXp(save: SaveData, amount: number): boolean {
    if (!save.activePokemonId) return false

    let changed = false

    // Active Pokémon gets XP
    const active = save.pokemon.find((p) => p.id === save.activePokemonId)
    if (active) {
      const result = this.addXp(active, amount, save)
      if (result) changed = true
    }

    // Exp. Share holders also get XP
    for (const pokemon of save.pokemon) {
      if (pokemon.id === save.activePokemonId) continue
      if (pokemon.heldItemId === 'exp-share') {
        const result = this.addXp(pokemon, amount, save)
        if (result) changed = true
      }
    }

    return changed
  }

  /** Add XP to a single Pokémon. Returns true if anything changed. */
  private addXp(pokemon: OwnedPokemon, amount: number, save: SaveData): boolean {
    if (pokemon.level >= MAX_LEVEL) return false

    pokemon.exp += amount
    let changed = true

    // Check for level ups (may level up multiple times with large XP gains)
    while (pokemon.level < MAX_LEVEL) {
      const species = getSpeciesById(pokemon.speciesId)
      if (!species) break
      const nextLevelExp = getExpForLevel(species.expGroup, pokemon.level + 1)
      if (pokemon.exp < nextLevelExp) break

      pokemon.level++
      this.petWindow?.webContents.send('pet-level-up', { level: pokemon.level })
      this.onLevelUp?.(pokemon.id)

      // Check level-based evolution
      const evolved = this.checkEvolution(pokemon, save)
      if (evolved) {
        this.petWindow?.webContents.send('pet-evolve', { speciesId: pokemon.speciesId })
        this.onEvolve?.(pokemon.id)
      }
    }

    return changed
  }

  /** Check and apply level-based evolution. Returns true if evolved. */
  private checkEvolution(pokemon: OwnedPokemon, save: SaveData): boolean {
    const species = getSpeciesById(pokemon.speciesId)
    if (!species) return false

    // Find evolution by level
    const evolution = POKEMON_SPECIES.find(
      (s) =>
        s.evolvesFrom === pokemon.speciesId &&
        s.evolutionLevel !== null &&
        pokemon.level >= s.evolutionLevel
    )

    if (!evolution) return false

    pokemon.speciesId = evolution.id
    if (!save.pokedex.includes(evolution.id)) {
      save.pokedex.push(evolution.id)
    }

    return true
  }
}
