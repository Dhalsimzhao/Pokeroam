import { useState, useEffect } from 'react'
import type { SpriteSheetConfig } from '../../../shared/types'
import { petTuning } from './pet-tuning'

const TICK_MS = 1000 / 60

/**
 * Tick-based animation loop that advances frame index
 * according to per-frame durations in the sprite config.
 */
export function useAnimationLoop(config: SpriteSheetConfig | null): { frameIndex: number } {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    setFrameIndex(0)

    if (!config || config.frameCount <= 1) return

    let currentFrame = 0
    let ticksRemaining = config.durations[0]
    let lastTime = performance.now()

    let rafId: number
    const tick = (now: number): void => {
      const elapsed = now - lastTime
      lastTime = now

      let ticksToProcess = Math.round((elapsed / TICK_MS) * petTuning.animationSpeed)
      while (ticksToProcess > 0) {
        ticksRemaining--
        ticksToProcess--
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
  }, [config])

  return { frameIndex }
}
