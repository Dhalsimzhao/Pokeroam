import { useEffect, useState } from 'react'
import type { SaveData } from '../../../shared/types'
import { useI18n } from '../shared/i18n'
import { BedroomScene, type PanelView } from './bedroom/BedroomScene'
import { StarterSelect } from './starter/StarterSelect'
import { PokemonPC } from './panels/PokemonPC'
import { Pokedex } from './panels/Pokedex'
import { Backpack } from './panels/Backpack'
import { DevTools } from './panels/DevTools'

export default function App(): JSX.Element {
  const [saveData, setSaveData] = useState<SaveData | null>(null)
  const [view, setView] = useState<PanelView>('bedroom')
  const [loaded, setLoaded] = useState(false)
  const [hasDailyReward, setHasDailyReward] = useState(false)
  const { t } = useI18n()

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

  // Listen for main-process navigation requests (tray → debug panel)
  useEffect(() => {
    const unsub = window.api.onPanelNavigate((target) => {
      if (
        target === 'debug' ||
        target === 'bedroom' ||
        target === 'pc' ||
        target === 'pokedex' ||
        target === 'backpack' ||
        target === 'starter'
      ) {
        setView(target as PanelView)
      }
    })
    return unsub
  }, [])

  if (!loaded) return <div />

  const goBack = (): void => {
    setView('bedroom')
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
        }}>{t.back}</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{title}</span>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#999', fontSize: 14
      }}>
        {t.comingSoon}
      </div>
    </div>
  )

  switch (view) {
    case 'bedroom':
      return (
        <BedroomScene
          onNavigate={setView}
          hasDailyReward={hasDailyReward}
          onRewardClaimed={() => setHasDailyReward(false)}
        />
      )
    case 'starter':
      return <StarterSelect onSelected={goBack} />
    case 'pc':
      return saveData
        ? <PokemonPC saveData={saveData} onBack={goBack} />
        : renderPlaceholder(t.pokemonPC)
    case 'pokedex':
      return saveData
        ? <Pokedex unlockedIds={saveData.pokedex} onBack={goBack} />
        : renderPlaceholder(t.pokedex)
    case 'backpack':
      return saveData
        ? <Backpack saveData={saveData} onBack={goBack} />
        : renderPlaceholder(t.backpack)
    case 'debug':
      return saveData
        ? <DevTools saveData={saveData} onBack={goBack} />
        : renderPlaceholder('Debug')
    default:
      return renderPlaceholder('PokéRoam')
  }
}
