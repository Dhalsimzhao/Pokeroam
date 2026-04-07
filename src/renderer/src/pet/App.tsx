import { useEffect, useState } from 'react'
import type { PetAnimState } from '../../../shared/types'
import { SpriteCanvas } from './SpriteCanvas'
import { useAnimationLoop } from './useAnimationLoop'
import { getSpriteConfig } from '../shared/sprite-config'

export default function App(): JSX.Element {
  const [petState, setPetState] = useState<{
    speciesId: number
    level: number
    animState: PetAnimState
    facingLeft: boolean
  } | null>(null)

  useEffect(() => {
    const unsub = window.api.onPetStateUpdate((data) => {
      setPetState(data as typeof petState)
    })
    return unsub
  }, [])

  // Default to Charmander idle for testing when no IPC state yet
  const speciesId = petState?.speciesId ?? 4
  const animState = petState?.animState ?? 'idle'
  const facingLeft = petState?.facingLeft ?? false

  const spriteConfig = getSpriteConfig(speciesId, animState)
  const { frameIndex } = useAnimationLoop(spriteConfig)

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
  )
}
