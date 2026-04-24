import { useState, useEffect } from 'react'
import type { PetAnimState, SpriteSheetConfig } from '../../../shared/types'

const TICK_MS = 1000 / 60

/**
 * Tick-based animation loop that advances frame index according to per-frame
 * durations in the sprite config.
 *
 * `speed` is the sheet's `<PlaybackSpeed>` from AnimData.xml (tunable per
 * species via the dev panel's Update XML button). Caller resolves it because
 * this hook doesn't know the speciesId / spriteKey needed to look it up.
 */
export function useAnimationLoop(
  config: SpriteSheetConfig | null,
  animState?: PetAnimState | null,
  speed = 1.0
): { frameIndex: number } {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    setFrameIndex(0)

    if (!config || config.frameCount <= 1) return

    let currentFrame = 0
    let ticksRemaining = config.durations[0]
    let lastTime = performance.now()
    // Fractional tick carry-over: at low speeds each frame contributes < 1 tick,
    // so we must accumulate the remainder instead of rounding per frame
    // (which would collapse to 0 for any speed below ~0.5 and freeze the animation).
    let tickAccumulator = 0

    let rafId: number
    const tick = (now: number): void => {
      const elapsed = now - lastTime
      lastTime = now

      tickAccumulator += (elapsed / TICK_MS) * speed
      while (tickAccumulator >= 1) {
        tickAccumulator -= 1
        ticksRemaining--
        if (ticksRemaining <= 0) {
          currentFrame = (currentFrame + 1) % config.frameCount
          ticksRemaining = config.durations[currentFrame]
          setFrameIndex(currentFrame)
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [config, animState, speed])

  return { frameIndex }
}
