import { useEffect, useRef } from 'react'
import type { PetAnimState } from '../../../shared/types'

type IdleEvent = 'sleep' | 'happy' | 'eat'

const IDLE_EVENTS: IdleEvent[] = ['sleep', 'happy', 'eat']
const MIN_INTERVAL = 30_000 // 30 seconds
const MAX_INTERVAL = 120_000 // 2 minutes

/** Duration in ms for each idle event animation before returning to previous state */
const EVENT_DURATIONS: Record<IdleEvent, number> = {
  sleep: 5000,
  happy: 2000,
  eat: 3000
}

/**
 * Triggers random idle events (yawn, sleep, jump, etc.)
 * Only fires when the pet is in 'idle' or 'walk' state.
 */
export function useIdleEvents(
  currentState: PetAnimState,
  onEvent: (state: PetAnimState) => void,
  onEventEnd: () => void
): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(false)

  useEffect(() => {
    const canTrigger = currentState === 'idle' || currentState === 'walk'

    // Clear any pending timer when state changes
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!canTrigger || activeRef.current) return

    const scheduleNext = (): void => {
      const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)
      timerRef.current = setTimeout(() => {
        // Pick random event
        const event = IDLE_EVENTS[Math.floor(Math.random() * IDLE_EVENTS.length)]
        activeRef.current = true
        onEvent(event)

        // Return to normal after duration
        setTimeout(() => {
          activeRef.current = false
          onEventEnd()
        }, EVENT_DURATIONS[event])
      }, delay)
    }

    scheduleNext()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [currentState, onEvent, onEventEnd])
}
