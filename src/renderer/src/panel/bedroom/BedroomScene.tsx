import { useI18n } from '../../shared/i18n'
import { WindowCurtain } from './WindowCurtain'
import { DeskArea } from './DeskArea'
import { ChairArea } from './ChairArea'
import './styles.css'

export type PanelView = 'bedroom' | 'starter' | 'pc' | 'pokedex' | 'backpack' | 'daily-reward'

interface BedroomSceneProps {
  onNavigate: (view: PanelView) => void
  hasDailyReward: boolean
}

export function BedroomScene({ onNavigate, hasDailyReward }: BedroomSceneProps): JSX.Element {
  const { lang, t, setLang } = useI18n()

  return (
    <div className="bedroom">
      <span className="bedroom-title">{t.pokeroamTitle}</span>

      {/* Language toggle */}
      <button
        className="lang-toggle"
        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>

      {/* Window with curtains */}
      <WindowCurtain />

      {/* Wall trim */}
      <div className="wall-trim" />

      {/* Ambient lamp */}
      <div className="lamp">
        <div className="lamp-shade" />
        <div className="lamp-stem" />
        <div className="lamp-base" />
      </div>

      {/* Desk with interactive objects */}
      <DeskArea
        onClickComputer={() => onNavigate('pc')}
        onClickPokedex={() => onNavigate('pokedex')}
        onClickPokeball={() => onNavigate('daily-reward')}
        hasDailyReward={hasDailyReward}
      />

      {/* Chair with backpack */}
      <ChairArea onClickBackpack={() => onNavigate('backpack')} />
    </div>
  )
}
