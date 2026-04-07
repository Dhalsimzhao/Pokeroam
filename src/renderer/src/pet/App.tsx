import { useCallback, useEffect, useRef, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'
import { SpriteCanvas } from './SpriteCanvas'
import { useAnimationLoop } from './useAnimationLoop'
import { usePetPhysics } from './usePetPhysics'
import { usePetDrag } from './usePetDrag'
import { useIdleEvents } from './useIdleEvents'
import { getSpriteConfig } from '../shared/sprite-config'

export default function App(): JSX.Element {
  const [speciesId, setSpeciesId] = useState<number>(4)
  const [idleOverride, setIdleOverride] = useState<PetAnimState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Listen for species data from main process
  useEffect(() => {
    const unsub = window.api.onPetStateUpdate((data) => {
      const d = data as { speciesId: number } | null
      if (d) setSpeciesId(d.speciesId)
    })
    return unsub
  }, [])

  // Right-click context menu
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      e.preventDefault()
      window.api.showContextMenu()
    }
    window.addEventListener('contextmenu', handler)
    return () => window.removeEventListener('contextmenu', handler)
  }, [])

  // Physics: walking, gravity, anim state
  const { animState, facingLeft, startDrag, endDrag } = usePetPhysics()

  // Drag & drop
  usePetDrag(containerRef, {
    onDragStart: startDrag,
    onDragEnd: endDrag
  })

  // Random idle events
  useIdleEvents(
    animState,
    useCallback((state: PetAnimState) => setIdleOverride(state), []),
    useCallback(() => setIdleOverride(null), [])
  )

  // Resolve final anim state (idle override takes precedence when grounded)
  const displayState = idleOverride && (animState === 'idle' || animState === 'walk')
    ? idleOverride
    : animState

  // Sprite rendering
  const spriteConfig = getSpriteConfig(speciesId, displayState)
  const { frameIndex } = useAnimationLoop(spriteConfig)

  // Update hit regions for click-through detection
  const updateHitRegions = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    window.api.updateHitRegions([
      { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    ])
  }, [])

  useEffect(() => {
    updateHitRegions()
    const id = setInterval(updateHitRegions, 500)
    return () => clearInterval(id)
  }, [updateHitRegions])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'transparent',
        userSelect: 'none'
      }}
    >
      <div ref={containerRef} style={{ cursor: 'grab' }}>
        {spriteConfig ? (
          <SpriteCanvas
            spriteConfig={spriteConfig}
            frameIndex={frameIndex}
            facingLeft={facingLeft}
            scale={2}
          />
        ) : (
          <div style={{ color: '#888', fontSize: 11 }}>No sprite</div>
        )}
      </div>
    </div>
  )
}
