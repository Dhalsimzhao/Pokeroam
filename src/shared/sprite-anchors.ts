import type { PetAnimState } from './types'

/**
 * PMD-Collab AnimData.xml anim names we care about. AnimData.xml ships dozens
 * more (Attack, Strike, Charge, ...) but PokéRoam only renders these nine
 * sheets, so anchor/speed metadata is only ever read/written for them.
 */
export type PmdAnimName =
  | 'Idle'
  | 'Walk'
  | 'Sleep'
  | 'Hop'
  | 'Eat'
  | 'Pose'
  | 'Charge'
  | 'Swing'
  | 'Hurt'

export const ALL_PMD_ANIMS: PmdAnimName[] = [
  'Idle', 'Walk', 'Sleep', 'Hop', 'Eat', 'Pose', 'Charge', 'Swing', 'Hurt'
]

/**
 * Per-PMD-anim metadata that lives in AnimData.xml as custom child elements
 * (`<AnchorBottom>` / `<PlaybackSpeed>`). Both are renderer-side knobs the
 * sprite asset needs but PMD's own format doesn't carry.
 */
export interface SpriteAnchorEntry {
  /** Source pixels from frame bottom up to character ground line. */
  anchorBottom: number
  /** Multiplier on native frame durations (1.0 = native; 0.5 = half-speed). */
  speed: number
}

/** What we read from / write to one species' AnimData.xml. */
export type SpriteAnchorMap = Partial<Record<PmdAnimName, SpriteAnchorEntry>>

/** Whole-cache shape (per-species map keyed by species id). */
export type SpriteAnchorStore = Record<number, SpriteAnchorMap>

/**
 * Maps the renderer's spriteKey (a PetAnimState alias for which sheet to
 * pull from — see DEFAULT_SPRITE_KEYS) to the PMD anim name, which is what
 * AnimData.xml is keyed by.
 */
export const SPRITE_KEY_TO_PMD_ANIM: Record<PetAnimState, PmdAnimName> = {
  idle: 'Idle',
  walk: 'Walk',
  sleep: 'Sleep',
  happy: 'Hop',
  eat: 'Eat',
  levelup: 'Pose',
  evolve: 'Charge',
  dragging: 'Swing',
  falling: 'Hurt'
}

/**
 * Fallback values used when an AnimData.xml lacks the custom AnchorBottom /
 * PlaybackSpeed elements. Hop / Swing / Hurt have non-zero anchors because
 * those sheets reserve vertical space for jump arc / drag swing / hurt
 * recoil; the rest draw the character at frame bottom.
 */
export const DEFAULT_SPRITE_ANCHORS: Record<PmdAnimName, SpriteAnchorEntry> = {
  Idle: { anchorBottom: 0, speed: 1.0 },
  Walk: { anchorBottom: 0, speed: 1.0 },
  Sleep: { anchorBottom: 0, speed: 1.0 },
  Hop: { anchorBottom: 32, speed: 1.0 },
  Eat: { anchorBottom: 0, speed: 1.0 },
  Pose: { anchorBottom: 0, speed: 1.0 },
  Charge: { anchorBottom: 0, speed: 1.0 },
  Swing: { anchorBottom: 24, speed: 1.0 },
  Hurt: { anchorBottom: 16, speed: 1.0 }
}

/**
 * Effective anchor entry for one (species, anim) — XML override layered over
 * the default. Returns a fresh object so callers can spread / mutate freely.
 */
export function resolveAnchor(
  perSpecies: SpriteAnchorMap | undefined,
  pmdAnim: PmdAnimName
): SpriteAnchorEntry {
  return { ...DEFAULT_SPRITE_ANCHORS[pmdAnim], ...(perSpecies?.[pmdAnim] ?? {}) }
}
