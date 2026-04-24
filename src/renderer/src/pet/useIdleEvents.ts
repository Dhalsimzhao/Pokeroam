import { useEffect, useRef } from 'react'
import type { PetAnimState } from '../../../shared/types'

type IdleEvent = 'happy' | 'eat' | 'sleep'

/**
 * Weighted probabilities for each random mood event (sum to 1.0).
 * `happy` is the everyday beat, `eat` is an occasional treat, `sleep` is
 * the rare longer nap so the pet feels active rather than drowsy.
 */
const EVENT_WEIGHTS: Record<IdleEvent, number> = {
  happy: 0.5,
  eat: 0.3,
  sleep: 0.2
}

const MIN_INTERVAL = 10_000 // 10 seconds
const MAX_INTERVAL = 25_000 // 25 seconds

/** Duration in ms for each idle event animation before returning to previous state */
const EVENT_DURATIONS: Record<IdleEvent, number> = {
  happy: 2000,
  eat: 3000,
  sleep: 8000
}

/** Probability that happy/eat chains into the other for a 2-beat script */
const CHAIN_PROBABILITY = 0.3
/** Pause between chained beats so the pet visibly returns to idle before the second beat */
const CHAIN_GAP_MS = 500

function pickWeighted(): IdleEvent {
  let roll = Math.random()
  for (const [event, weight] of Object.entries(EVENT_WEIGHTS) as [IdleEvent, number][]) {
    roll -= weight
    if (roll <= 0) return event
  }
  return 'happy'
}

function pickChain(prev: IdleEvent, depth: number): IdleEvent | null {
  if (depth >= 1) return null
  if (prev === 'sleep') return null
  if (Math.random() >= CHAIN_PROBABILITY) return null
  return prev === 'happy' ? 'eat' : 'happy'
}

function canTriggerState(state: PetAnimState): boolean {
  return state === 'idle' || state === 'walk'
}

/**
 * Triggers random mood moments (happy, eat, sleep) paired with a matching
 * dialogue bubble. Physics is paused for the duration so the pet stops to
 * emote, and happy/eat occasionally chain into a 2-beat script for a more
 * scripted feel.
 *
 * The scheduler runs on its own clock (not driven by the React render cycle)
 * so the 10–25s inter-beat delay isn't reset every time physics flips between
 * idle↔walk. A separate effect watches the pet state and aborts an in-flight
 * beat if the pet gets dragged or falls.
 */
export function useIdleEvents(
  currentState: PetAnimState,
  onEvent: (state: PetAnimState) => void,
  onEventEnd: () => void,
  setPhysicsPaused: (paused: boolean) => void
): void {
  const stateRef = useRef(currentState)
  stateRef.current = currentState

  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent
  const onEventEndRef = useRef(onEventEnd)
  onEventEndRef.current = onEventEnd
  const setPausedRef = useRef(setPhysicsPaused)
  setPausedRef.current = setPhysicsPaused

  const activeRef = useRef(false)
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const beatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<() => void>(() => {})

  useEffect(() => {
    let cancelled = false

    const clearBeatTimer = (): void => {
      if (beatTimerRef.current) {
        clearTimeout(beatTimerRef.current)
        beatTimerRef.current = null
      }
    }

    const endBeat = (): void => {
      clearBeatTimer()
      if (!activeRef.current) return
      activeRef.current = false
      setPausedRef.current(false)
      onEventEndRef.current()
    }

    const runBeat = (event: IdleEvent, depth: number): void => {
      if (cancelled) return
      activeRef.current = true
      setPausedRef.current(true)
      onEventRef.current(event)
      window.api.triggerMoodDialogue(event)

      beatTimerRef.current = setTimeout(() => {
        beatTimerRef.current = null
        if (cancelled) return
        const chain = pickChain(event, depth)
        if (chain && canTriggerState(stateRef.current)) {
          // Brief gap: clear the override so the pet returns to an idle pose,
          // then fire the chained beat after a short pause.
          onEventEndRef.current()
          beatTimerRef.current = setTimeout(() => {
            beatTimerRef.current = null
            if (cancelled) return
            runBeat(chain, depth + 1)
          }, CHAIN_GAP_MS)
        } else {
          endBeat()
          scheduleNext()
        }
      }, EVENT_DURATIONS[event])
    }

    const scheduleNext = (): void => {
      if (cancelled) return
      const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)
      delayTimerRef.current = setTimeout(() => {
        delayTimerRef.current = null
        if (cancelled) return
        // Skip this slot and retry if the pet isn't eligible right now
        // (dragging, falling). We never want to start a scripted beat mid-drag.
        if (!canTriggerState(stateRef.current) || activeRef.current) {
          scheduleNext()
          return
        }
        runBeat(pickWeighted(), 0)
      }, delay)
    }

    abortRef.current = (): void => {
      endBeat()
      // Resume the normal schedule so a future beat can still fire.
      if (!delayTimerRef.current) scheduleNext()
    }

    scheduleNext()

    return () => {
      cancelled = true
      abortRef.current = () => {}
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current)
        delayTimerRef.current = null
      }
      endBeat()
    }
  }, [])

  // Abort an in-flight beat if the pet gets dragged or falls, so we don't
  // leave physics paused or the sprite stuck on a mood override.
  useEffect(() => {
    if (activeRef.current && !canTriggerState(currentState)) {
      abortRef.current()
    }
  }, [currentState])
}
