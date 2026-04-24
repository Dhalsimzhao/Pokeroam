import { useCallback, useEffect, useRef, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'
import { SpriteCanvas } from './SpriteCanvas'
import { useAnimationLoop } from './useAnimationLoop'
import { usePetPhysics } from './usePetPhysics'
import { usePetDrag } from './usePetDrag'
import { useIdleEvents } from './useIdleEvents'
import { getSpriteConfig } from '../shared/sprite-config'
import { useI18n } from '../shared/i18n'
import { initPetTuning, usePetTuning } from './pet-tuning'
import { initSpriteAnchorsStore, useSpeciesAnchors } from '../shared/sprite-anchors-store'
import { resolveAnchor, SPRITE_KEY_TO_PMD_ANIM } from '../../../shared/sprite-anchors'

export default function App(): JSX.Element {
  const [speciesId, setSpeciesId] = useState<number | null>(null)
  const [idleOverride, setIdleOverride] = useState<PetAnimState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  // Pull initial state from main process on mount
  useEffect(() => {
    window.api.getPetState().then((data) => {
      if (data) setSpeciesId(data.speciesId)
    })
  }, [])

  // Keep live pet-physics tuning in sync with the DevTools panel.
  useEffect(() => initPetTuning(), [])

  // Pull the sprite-anchor cache once and subscribe to live AnimData.xml
  // updates so anchorBottom changes from the dev panel apply without restart.
  useEffect(() => initSpriteAnchorsStore(), [])

  // Listen for species data pushes from main process
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

  // Debug overlay (toggled via tray menu)
  const [showDebug, setShowDebug] = useState(false)
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const unsub = window.api.onToggleDebug((enabled) => setShowDebug(enabled))
    return unsub
  }, [])
  useEffect(() => {
    if (!showDebug) return
    const id = setInterval(() => forceUpdate((n) => n + 1), 100)
    return () => clearInterval(id)
  }, [showDebug])

  // Physics: walking, gravity, anim state
  const { animState, facingLeftRef, stateRef, startDrag, endDrag, onDragMove } = usePetPhysics()

  // Drag & drop
  usePetDrag(containerRef, {
    onDragStart: startDrag,
    onDragEnd: endDrag,
    onDragMove
  })

  // Random idle events
  useIdleEvents(
    animState,
    useCallback((state: PetAnimState) => setIdleOverride(state), []),
    useCallback(() => setIdleOverride(null), [])
  )

  // Live tuning (re-renders when dev panel adjusts idle ticks or anim override)
  const tuning = usePetTuning()

  // Resolve final anim state. Debug override from dev panel wins over everything
  // so each animation can be previewed in isolation.
  const physicsState = idleOverride && (animState === 'idle' || animState === 'walk')
    ? idleOverride
    : animState
  const displayState = tuning.animOverride ?? physicsState

  // Sprite rendering. Pet uses the row + sprite sheet configured in
  // tuning.animParams so changing facing or swapping the source sheet via the
  // dev panel takes effect live.
  const animParam = tuning.animParams[displayState]
  const spriteConfig = speciesId
    ? getSpriteConfig(speciesId, displayState, animParam?.row, animParam?.spriteKey)
    : null

  // Re-render whenever this species' anchors change (XML write from dev panel)
  // so anchor + native-speed below pick up the new values immediately.
  const speciesAnchors = useSpeciesAnchors(speciesId)
  const effectiveSpriteKey = animParam?.spriteKey
    ?? (displayState === 'idle' ? 'happy' : displayState)
  const anchor = resolveAnchor(speciesAnchors, SPRITE_KEY_TO_PMD_ANIM[effectiveSpriteKey])

  const { frameIndex } = useAnimationLoop(spriteConfig, displayState, anchor.speed)

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

  // Refresh immediately whenever the sprite's bounding box can change — the
  // dialogue window anchors to this rect, so stale regions would park the
  // bubble over an old sprite size until the 500ms tick catches up.
  useEffect(() => {
    updateHitRegions()
  }, [displayState, spriteConfig, updateHitRegions])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'transparent',
        userSelect: 'none'
      }}
    >
      {showDebug && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.85)',
            color: '#0f0',
            fontSize: 9,
            fontFamily: 'monospace',
            padding: '2px 3px',
            lineHeight: 1.3,
            whiteSpace: 'pre',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 999
          }}
        >
          {[
            `${displayState}${idleOverride ? `(${idleOverride})` : ''} f:${frameIndex}`,
            `${facingLeftRef.current ? 'L' : 'R'} vx:${stateRef.current?.vx?.toFixed(1)} g:${stateRef.current?.grounded ? 'Y' : 'N'}`,
            `${stateRef.current?.x?.toFixed(0)},${stateRef.current?.y?.toFixed(0)}`
          ].join('\n')}
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          cursor: 'grab',
          // Push the sprite down by anchorBottom so each animation's "ground
          // line" (feet) lands at the same window-bottom baseline, regardless
          // of how much empty space the source frame leaves below the character.
          // anchorBottom is per-species/per-PMD-anim, sourced from AnimData.xml.
          marginBottom: -(anchor.anchorBottom * 2)
        }}
      >
        {spriteConfig ? (
          <SpriteCanvas
            spriteConfig={spriteConfig}
            frameIndex={frameIndex}
            facingLeft={facingLeftRef.current ?? false}
            scale={2}
          />
        ) : (
          <div style={{ color: '#888', fontSize: 11 }}>{t.noSprite}</div>
        )}
      </div>
    </div>
  )
}
