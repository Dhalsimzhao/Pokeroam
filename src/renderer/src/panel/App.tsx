import { useEffect, useState } from 'react'
import type { SaveData } from '../../../shared/types'
import { BedroomScene, type PanelView } from './bedroom/BedroomScene'
import { StarterSelect } from './starter/StarterSelect'
import { PokemonPC } from './panels/PokemonPC'
import { Pokedex } from './panels/Pokedex'
import { Backpack } from './panels/Backpack'
import { DailyReward } from './panels/DailyReward'

export default function App(): JSX.Element {
  const [saveData, setSaveData] = useState<SaveData | null>(null)
  const [view, setView] = useState<PanelView>('bedroom')
  const [loaded, setLoaded] = useState(false)
  const [hasDailyReward, setHasDailyReward] = useState(false)

  // Load initial save data
  useEffect(() => {
    window.api.getSaveData().then((data) => {
      setSaveData(data as SaveData | null)
      setLoaded(true)
      if (!data) setView('starter')
    })
    window.api.isDailyRewardAvailable().then(setHasDailyReward)
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

  const goBack = (): void => {
    setView('bedroom')
    window.api.isDailyRewardAvailable().then(setHasDailyReward)
  }

  // Placeholder for panels not yet implemented
  const renderPlaceholder = (title: string): JSX.Element => (
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
        <button onClick={goBack} style={{
          border: 'none', background: '#c0392b', color: '#fff',
          padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600
        }}>Back</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{title}</span>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#999', fontSize: 14
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
          hasDailyReward={hasDailyReward}
        />
      )
    case 'starter':
      return <StarterSelect onSelected={goBack} />
    case 'pc':
      return saveData
        ? <PokemonPC saveData={saveData} onBack={goBack} />
        : renderPlaceholder('Pokemon PC')
    case 'pokedex':
      return saveData
        ? <Pokedex unlockedIds={saveData.pokedex} onBack={goBack} />
        : renderPlaceholder('Pokedex')
    case 'backpack':
      return saveData
        ? <Backpack saveData={saveData} onBack={goBack} />
        : renderPlaceholder('Backpack')
    case 'daily-reward':
      return <DailyReward onBack={goBack} />
    default:
      return renderPlaceholder('PokéRoam')
  }
}
