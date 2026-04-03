import { useEffect, useState } from 'react'

export default function App(): JSX.Element {
  const [petState, setPetState] = useState<{
    speciesId: number
    level: number
    nickname: string | null
  } | null>(null)

  useEffect(() => {
    const unsub = window.api.onPetStateUpdate((data) => {
      setPetState(data as typeof petState)
    })
    return unsub
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        userSelect: 'none'
      }}
    >
      {petState ? (
        <div style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>
          <div>#{petState.speciesId}</div>
          <div>Lv.{petState.level}</div>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 11 }}>Pet Window Ready</div>
      )}
    </div>
  )
}
