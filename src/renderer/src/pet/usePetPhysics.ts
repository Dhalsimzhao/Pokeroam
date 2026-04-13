import { useEffect, useRef, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'

const WALK_SPEED = 1.5 // pixels per frame
const GRAVITY = 0.5 // pixels per frame²
const WINDOW_SIZE = 128

export interface PhysicsState {
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
  facingLeftRef: React.RefObject<boolean>
  stateRef: React.RefObject<PhysicsState>
  startDrag: () => void
  endDrag: () => void
  onDragMove: (dx: number, dy: number) => void
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function usePetPhysics(): PhysicsAPI {
  const [animState, setAnimState] = useState<PetAnimState>('idle')
  const [facingLeft, setFacingLeft] = useState(false)
  const facingLeftRef = useRef(false)
  const stateRef = useRef<PhysicsState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    grounded: true,
    animState: 'idle',
    facingLeft: false
  })
  const workAreaRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const draggingRef = useRef(false)
  const nextActionRef = useRef(0)

  useEffect(() => {
    let rafId: number
    let frameCount = 0

    const pickNextAction = (): void => {
      const s = stateRef.current
      if (Math.random() < 0.4) {
        s.vx = 0
        s.animState = 'idle'
        nextActionRef.current = frameCount + Math.round(randomBetween(120, 300))
      } else {
        const goLeft = Math.random() < 0.5
        s.vx = goLeft ? -WALK_SPEED : WALK_SPEED
        s.facingLeft = goLeft
        s.animState = 'walk'
        nextActionRef.current = frameCount + Math.round(randomBetween(180, 480))
      }
    }

    const clampToBounds = (s: PhysicsState, wa: { x: number; y: number; width: number; height: number }): void => {
      const minX = wa.x
      const maxX = wa.x + wa.width - WINDOW_SIZE
      if (s.x < minX) {
        s.x = minX
        s.vx = WALK_SPEED
        s.facingLeft = false
      } else if (s.x > maxX) {
        s.x = maxX
        s.vx = -WALK_SPEED
        s.facingLeft = true
      }
    }

    const tick = (): void => {
      const wa = workAreaRef.current
      if (!wa || draggingRef.current) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const s = stateRef.current
      frameCount++

      // Refresh workArea every ~2 seconds to handle display changes
      if (frameCount % 120 === 0) {
        window.api.getWorkArea().then((freshWa) => {
          workAreaRef.current = freshWa
        })
      }

      if (s.grounded) {
        if (frameCount >= nextActionRef.current) {
          pickNextAction()
        }

        s.x += s.vx
        clampToBounds(s, wa)

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
          nextActionRef.current = frameCount + Math.round(randomBetween(60, 120))
        }
      }

      window.api.setPetPosition(s.x, s.y)
      setAnimState(s.animState)
      if (s.facingLeft !== facingLeftRef.current) {
        facingLeftRef.current = s.facingLeft
        setFacingLeft(s.facingLeft)
      }

      rafId = requestAnimationFrame(tick)
    }

    // Fetch work area FIRST, then set initial position and start physics
    window.api.getWorkArea().then((wa) => {
      workAreaRef.current = wa
      const s = stateRef.current
      s.x = wa.x + wa.width - WINDOW_SIZE - 20
      s.y = wa.y + wa.height - WINDOW_SIZE
      window.api.setPetPosition(s.x, s.y)
      pickNextAction()
      rafId = requestAnimationFrame(tick)
    })

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
    const wa = workAreaRef.current
    if (!wa) return

    // Sync position from actual window position after drag
    // The window was moved by drag-move IPC, but stateRef wasn't updated.
    // We need to get the current window position.
    window.api.getWorkArea().then((freshWa) => {
      workAreaRef.current = freshWa
      const groundY = freshWa.y + freshWa.height - WINDOW_SIZE

      // Clamp x to screen bounds after drag
      const minX = freshWa.x
      const maxX = freshWa.x + freshWa.width - WINDOW_SIZE
      if (s.x < minX) s.x = minX
      if (s.x > maxX) s.x = maxX

      s.grounded = s.y >= groundY
      if (!s.grounded) {
        s.animState = 'falling'
        s.vy = 0
        setAnimState('falling')
      } else {
        s.y = groundY
        s.animState = 'idle'
        setAnimState('idle')
      }
    })
  }

  const onDragMove = (dx: number, dy: number): void => {
    const s = stateRef.current
    s.x += dx
    s.y += dy
  }

  return { animState, facingLeft, facingLeftRef, stateRef, startDrag, endDrag, onDragMove }
}
