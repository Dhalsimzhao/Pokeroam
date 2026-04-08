import { useState } from 'react'
import type { DailyReward as DailyRewardType } from '../../../../shared/types'
import { getSpeciesById } from '../../../../shared/pokemon-data'
import { getItemById } from '../../../../shared/item-data'
import { useI18n } from '../../shared/i18n'
import { localeName } from '../../../../shared/i18n'
import { WindowCurtain } from './WindowCurtain'
import { DeskArea } from './DeskArea'
import { ChairArea } from './ChairArea'
import './styles.css'

export type PanelView = 'bedroom' | 'starter' | 'pc' | 'pokedex' | 'backpack'

interface BedroomSceneProps {
  onNavigate: (view: PanelView) => void
  hasDailyReward: boolean
  onRewardClaimed: () => void
}

export function BedroomScene({ onNavigate, hasDailyReward, onRewardClaimed }: BedroomSceneProps): JSX.Element {
  const { lang, t, setLang } = useI18n()
  const [reward, setReward] = useState<DailyRewardType | null>(null)

  const handleClaimReward = async (): Promise<void> => {
    const result = await window.api.claimDailyReward()
    if (result) {
      setReward(result as DailyRewardType)
      onRewardClaimed()
    }
  }

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
        onClickPokeball={handleClaimReward}
        hasDailyReward={hasDailyReward}
      />

      {/* Chair with backpack */}
      <ChairArea onClickBackpack={() => onNavigate('backpack')} />

      {/* Reward popup overlay */}
      {reward && (
        <div
          onClick={() => setReward(null)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#f5efe8', borderRadius: 12, padding: '24px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textAlign: 'center',
              border: '2px solid #d4b896', minWidth: 200,
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            {reward.type === 'pokemon' && reward.pokemonSpeciesId ? (() => {
              const sp = getSpeciesById(reward.pokemonSpeciesId)
              return (
                <>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🐾</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#5d4e37' }}>
                    {sp ? localeName(sp.nameZh, sp.name, lang) : 'Pokemon'}!
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    {sp ? (lang === 'zh' ? sp.name : sp.nameZh) : ''} {t.joinedTeam}
                  </div>
                </>
              )
            })() : reward.items ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37', marginBottom: 12 }}>
                  {t.itemsReceived}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {reward.items.map((ri) => {
                    const item = getItemById(ri.itemId)
                    return (
                      <div key={ri.itemId} style={{
                        padding: '6px 12px', background: '#fff',
                        borderRadius: 6, border: '1px solid #d4b896'
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37' }}>
                          {item ? localeName(item.nameZh, item.name, lang) : ri.itemId}
                        </div>
                        <div style={{ fontSize: 11, color: '#888' }}>×{ri.quantity}</div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{ color: '#999' }}>{t.noRewardToday}</div>
            )}
            <button
              onClick={() => setReward(null)}
              style={{
                marginTop: 16, border: 'none', background: '#27ae60', color: '#fff',
                padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
                fontSize: 13, fontWeight: 600
              }}
            >
              {t.nice}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
