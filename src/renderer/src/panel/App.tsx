import { useEffect, useState } from 'react'
import type { SaveData } from '../../../shared/types'
import { BedroomScene, type PanelView } from './bedroom/BedroomScene'
import { StarterSelect } from './starter/StarterSelect'

export default function App(): JSX.Element {
  const [saveData, setSaveData] = useState<SaveData | null>(null)
  const [view, setView] = useState<PanelView>('bedroom')
  const [loaded, setLoaded] = useState(false)

  // Load initial save data
  useEffect(() => {
    window.api.getSaveData().then((data) => {
      setSaveData(data as SaveData | null)
      setLoaded(true)
      if (!data) setView('starter')
    })
  }, [])

  // Listen for save data changes
  useEffect(() => {
    const unsub = window.api.onSaveDataChanged((data) => {
      setSaveData(data as SaveData | null)
      if (data && view === 'starter') setView('bedroom')
    })
    return unsub
  }, [view])

  if (!loaded) return <div />

  // Placeholder panel with back button
  const renderPanel = (title: string): JSX.Element => (
    <div style={{
      width: 800,
      height: 600,
      background: '#f5e6d3',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '2px solid #d4b896'
      }}>
        <button
          onClick={() => setView('bedroom')}
          style={{
            border: 'none',
            background: '#c0392b',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          Back
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{title}</span>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: 14
      }}>
        Coming soon...
      </div>
    </div>
  )

  switch (view) {
    case 'bedroom':
      return (
        <BedroomScene
          onNavigate={setView}
          hasDailyReward={false} // will be computed in Task 15
        />
      )
    case 'starter':
      return <StarterSelect onSelected={() => setView('bedroom')} />
    case 'pc':
      return renderPanel('Pokemon PC')
    case 'pokedex':
      return renderPanel('Pokedex')
    case 'backpack':
      return renderPanel('Backpack')
    case 'daily-reward':
      return renderPanel('Daily Reward')
    default:
      return renderPanel('PokéRoam')
  }
}
