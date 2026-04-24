import { useEffect, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'
import {
  resolveAnchor,
  SPRITE_KEY_TO_PMD_ANIM,
  type SpriteAnchorEntry,
  type SpriteAnchorMap,
  type SpriteAnchorStore
} from '../../../shared/sprite-anchors'

/**
 * Mutable singleton mirroring the main process's sprite-anchor cache. Pet
 * physics / animation hooks read this every frame; we keep it as a plain
 * object so reads are zero-overhead and don't trigger React state churn.
 *
 * Kept in sync via initSpriteAnchorsStore (one-shot fetch on startup) and the
 * `sprite-anchors-update` IPC channel (broadcast after a dev-mode XML write).
 */
export const spriteAnchors: SpriteAnchorStore = {}

function applyUpdate(speciesId: number, anchors: SpriteAnchorMap): void {
  spriteAnchors[speciesId] = anchors
}

/**
 * Pull the entire anchor store from main and subscribe to live updates.
 * Returns an unsubscribe so callers in React effects can clean up.
 */
export function initSpriteAnchorsStore(): () => void {
  void window.api.getSpriteAnchors().then((store) => {
    Object.assign(spriteAnchors, store)
  })
  return window.api.onSpriteAnchorsUpdate((payload) => {
    applyUpdate(payload.speciesId, payload.anchors)
  })
}

/**
 * Resolve effective anchor for one (species, spriteKey) — XML override layered
 * over the package defaults. spriteKey is the PetAnimState alias the renderer
 * actually pulls a sheet from (see DEFAULT_SPRITE_KEYS), not the playing
 * animation state — anchors are intrinsic to the sheet.
 */
export function getAnchorFor(
  speciesId: number | null,
  spriteKey: PetAnimState
): SpriteAnchorEntry {
  const pmd = SPRITE_KEY_TO_PMD_ANIM[spriteKey]
  if (speciesId == null) return resolveAnchor(undefined, pmd)
  return resolveAnchor(spriteAnchors[speciesId], pmd)
}

/**
 * React-facing snapshot of `spriteAnchors[speciesId]`. Re-renders the caller
 * whenever main pushes an update for that species. Use this in the dev panel
 * (which needs to reflect XML writes immediately); the runtime pet renderer
 * should read `spriteAnchors` directly to stay off the React re-render path.
 */
export function useSpeciesAnchors(speciesId: number | null): SpriteAnchorMap {
  const [snapshot, setSnapshot] = useState<SpriteAnchorMap>(
    () => (speciesId != null ? { ...(spriteAnchors[speciesId] ?? {}) } : {})
  )
  useEffect(() => {
    if (speciesId == null) {
      setSnapshot({})
      return
    }
    let cancelled = false
    void window.api.getSpriteAnchors(speciesId).then((m) => {
      if (cancelled) return
      spriteAnchors[speciesId] = m
      setSnapshot({ ...m })
    })
    const unsub = window.api.onSpriteAnchorsUpdate((payload) => {
      if (payload.speciesId !== speciesId) return
      applyUpdate(payload.speciesId, payload.anchors)
      setSnapshot({ ...payload.anchors })
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [speciesId])
  return snapshot
}
