import { useEffect, useState } from 'react'
import type { PetTuning } from '../../../shared/types'
import { DEFAULT_PET_TUNING } from '../../../shared/types'

// Mutable live tuning read by usePetPhysics and useAnimationLoop each tick.
// Starts at defaults and is kept in sync with the main-process state via IPC.
export const petTuning: PetTuning = { ...DEFAULT_PET_TUNING }

export function initPetTuning(): () => void {
  window.api.getPetTuning().then((t) => Object.assign(petTuning, t))
  return window.api.onPetTuningUpdate((t) => Object.assign(petTuning, t))
}

/**
 * React-facing view of petTuning. Use this when a component needs to re-render
 * on tuning changes (e.g. sprite config depending on idle ticks or animOverride).
 * Physics-layer hooks that read each frame should stick to `petTuning` directly.
 */
export function usePetTuning(): PetTuning {
  const [snapshot, setSnapshot] = useState<PetTuning>(() => ({ ...petTuning }))
  useEffect(() => {
    window.api.getPetTuning().then((t) => setSnapshot({ ...t }))
    return window.api.onPetTuningUpdate((t) => setSnapshot({ ...t }))
  }, [])
  return snapshot
}
