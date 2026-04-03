import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import type { OwnedPokemon, SaveData } from '../shared/types'
import { SAVE_DIR, SAVE_FILE } from '../shared/constants'
import { getExpForLevel, getSpeciesById } from '../shared/pokemon-data'

export class SaveManager {
  private savePath: string

  constructor() {
    const homeDir = app.getPath('home')
    this.savePath = path.join(homeDir, SAVE_DIR, SAVE_FILE)
  }

  /** Returns the absolute path to the save file. */
  getPath(): string {
    return this.savePath
  }

  /**
   * Load save data from disk.
   * Returns null if the file does not exist (first launch) or if the
   * contents are corrupted / not valid JSON.
   */
  load(): SaveData | null {
    try {
      const raw = fs.readFileSync(this.savePath, 'utf-8')
      return JSON.parse(raw) as SaveData
    } catch {
      return null
    }
  }

  /**
   * Persist save data to disk.
   * Creates the parent directory tree if it does not already exist.
   */
  save(data: SaveData): void {
    const dir = path.dirname(this.savePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(this.savePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  /**
   * Create a brand-new save after the player picks their starter.
   *
   * The starter Pokemon begins at level 5 with the correct cumulative
   * experience for that level in its species' experience group.
   */
  createNewSave(starterSpeciesId: number): SaveData {
    const species = getSpeciesById(starterSpeciesId)
    if (!species) {
      throw new Error(`Unknown species id: ${starterSpeciesId}`)
    }

    const pokemonId = crypto.randomUUID()
    const level = 5
    const exp = getExpForLevel(species.expGroup, level)

    const starter: OwnedPokemon = {
      id: pokemonId,
      speciesId: starterSpeciesId,
      nickname: null,
      level,
      exp,
      heldItemId: null
    }

    const now = new Date().toISOString()

    const data: SaveData = {
      player: {
        createdAt: now,
        lastLogin: now,
        lastDailyReward: ''
      },
      pokemon: [starter],
      activePokemonId: pokemonId,
      backpack: [],
      pokedex: [starterSpeciesId]
    }

    return data
  }
}
