import { useEffect, useState } from 'react'
import type { PetAnimState, AnimParams, PetTuning } from '../../../shared/types'
import { ALL_ANIM_STATES, DEFAULT_PET_TUNING } from '../../../shared/types'

// Mutable live tuning read by usePetPhysics and useAnimationLoop each tick.
// Starts at defaults and is kept in sync with the main-process state via IPC.
export const petTuning: PetTuning = {
  ...DEFAULT_PET_TUNING,
  animParams: cloneAnimParams(DEFAULT_PET_TUNING.animParams)
}

function cloneAnimParams(src: Record<PetAnimState, AnimParams>): Record<PetAnimState, AnimParams> {
  const out = {} as Record<PetAnimState, AnimParams>
  for (const s of ALL_ANIM_STATES) out[s] = { ...src[s] }
  return out
}

/**
 * Per-state shallow-merge of an incoming tuning over an existing one.
 *
 * We merge `animParams` per state (instead of wholesale replacing) so a stale
 * main process that strips unknown AnimParams fields from its broadcast can't
 * silently undo an optimistic update the renderer just made. Without this,
 * swapping e.g. `spriteKey` would snap back the moment main echoes — exactly
 * the "need to restart dev server after adding a field" pain.
 */
function mergeAnimParamsInto(
  target: Record<PetAnimState, AnimParams>,
  patch: Partial<Record<PetAnimState, Partial<AnimParams>>> | undefined
): void {
  if (!patch) return
  for (const state of ALL_ANIM_STATES) {
    const incoming = patch[state]
    if (incoming) target[state] = { ...target[state], ...incoming }
  }
}

function mergeTuningInto(target: PetTuning, patch: PetTuning): void {
  mergeAnimParamsInto(target.animParams, patch.animParams)
  if (typeof patch.walkSpeed === 'number') target.walkSpeed = patch.walkSpeed
  if (typeof patch.gravity === 'number') target.gravity = patch.gravity
  // animOverride explicitly allows `null`, so only skip `undefined`.
  if (patch.animOverride !== undefined) target.animOverride = patch.animOverride
}

export function initPetTuning(): () => void {
  window.api.getPetTuning().then((t) => mergeTuningInto(petTuning, t as PetTuning))
  return window.api.onPetTuningUpdate((t) => mergeTuningInto(petTuning, t as PetTuning))
}

/**
 * React-facing view of petTuning. Use this when a component needs to re-render
 * on tuning changes. Physics-layer hooks that read each frame should stick to
 * `petTuning` directly.
 */
export function usePetTuning(): PetTuning {
  const [snapshot, setSnapshot] = useState<PetTuning>(() => ({
    ...petTuning,
    animParams: cloneAnimParams(petTuning.animParams)
  }))
  useEffect(() => {
    const apply = (t: PetTuning): void => {
      setSnapshot((prev) => {
        const next: PetTuning = {
          ...prev,
          animParams: cloneAnimParams(prev.animParams)
        }
        mergeTuningInto(next, t)
        return next
      })
    }
    window.api.getPetTuning().then((t) => apply(t as PetTuning))
    return window.api.onPetTuningUpdate((t) => apply(t as PetTuning))
  }, [])
  return snapshot
}
