import { useEffect, useRef, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'

const WALK_SPEED = 1.5 // pixels per frame
const GRAVITY = 0.5 // pixels per frame²
const WINDOW_SIZE = 128

interface PhysicsState {
  x: number
  y: number
  vx: number
  vy: number
  grounded: boolean
  animState: PetAnimState
  facingLeft: boolean
}

interface PhysicsAPI {
  animState: PetAnimState
  facingLeft: boolean
  /** Start dragging — physics pauses, position controlled externally */
  startDrag: () => void
  /** End drag — pet enters falling state */
  endDrag: () => void
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function usePetPhysics(): PhysicsAPI {
  const [animState, setAnimState] = useState<PetAnimState>('idle')
  const [facingLeft, setFacingLeft] = useState(false)
  const stateRef = useRef<PhysicsState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    grounded: true,
    animState: 'idle',
    facingLeft: false
  })
  const workAreaRef = useRef({ x: 0, y: 0, width: 1920, height: 1080 })
  const draggingRef = useRef(false)
  const nextActionRef = useRef(0) // frame count until next behavior change

  useEffect(() => {
    let rafId: number
    let frameCount = 0

    // Fetch work area and set initial position
    window.api.getWorkArea().then((wa) => {
      workAreaRef.current = wa
      const s = stateRef.current
      s.x = wa.x + wa.width - WINDOW_SIZE - 20
      s.y = wa.y + wa.height - WINDOW_SIZE
      window.api.setPetPosition(s.x, s.y)
    })

    const pickNextAction = (): void => {
      const s = stateRef.current
      if (Math.random() < 0.4) {
        // Pause (idle)
        s.vx = 0
        s.animState = 'idle'
        nextActionRef.current = frameCount + Math.round(randomBetween(120, 300)) // 2-5s
      } else {
        // Walk in random direction
        const goLeft = Math.random() < 0.5
        s.vx = goLeft ? -WALK_SPEED : WALK_SPEED
        s.facingLeft = goLeft
        s.animState = 'walk'
        nextActionRef.current = frameCount + Math.round(randomBetween(180, 480)) // 3-8s
      }
    }

    pickNextAction()

    const tick = (): void => {
      if (draggingRef.current) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const s = stateRef.current
      const wa = workAreaRef.current
      frameCount++

      if (s.grounded) {
        // Time for next action?
        if (frameCount >= nextActionRef.current) {
          pickNextAction()
        }

        // Move horizontally
        s.x += s.vx

        // Clamp to screen bounds
        const minX = wa.x
        const maxX = wa.x + wa.width - WINDOW_SIZE
        if (s.x <= minX) {
          s.x = minX
          s.vx = WALK_SPEED
          s.facingLeft = false
        } else if (s.x >= maxX) {
          s.x = maxX
          s.vx = -WALK_SPEED
          s.facingLeft = true
        }

        // Y fixed at bottom
        s.y = wa.y + wa.height - WINDOW_SIZE
      } else {
        // Airborne — apply gravity
        s.vy += GRAVITY
        s.y += s.vy

        // Landing check
        const groundY = wa.y + wa.height - WINDOW_SIZE
        if (s.y >= groundY) {
          s.y = groundY
          s.vy = 0
          s.grounded = true
          s.animState = 'idle'
          s.vx = 0
          nextActionRef.current = frameCount + Math.round(randomBetween(60, 120)) // brief pause
        }
      }

      window.api.setPetPosition(s.x, s.y)

      // Sync React state
      setAnimState(s.animState)
      setFacingLeft(s.facingLeft)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const startDrag = (): void => {
    draggingRef.current = true
    const s = stateRef.current
    s.animState = 'dragging'
    s.vx = 0
    setAnimState('dragging')
  }

  const endDrag = (): void => {
    draggingRef.current = false
    const s = stateRef.current
    // Read current window position after drag
    const wa = workAreaRef.current
    const groundY = wa.y + wa.height - WINDOW_SIZE
    s.grounded = s.y >= groundY
    if (!s.grounded) {
      s.animState = 'falling'
      s.vy = 0
      setAnimState('falling')
    } else {
      s.animState = 'idle'
      setAnimState('idle')
    }
  }

  return { animState, facingLeft, startDrag, endDrag }
}
