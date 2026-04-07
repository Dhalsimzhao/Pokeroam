import { useState } from 'react'
import type { DailyReward as DailyRewardType } from '../../../../shared/types'
import { getSpeciesById } from '../../../../shared/pokemon-data'
import { getItemById } from '../../../../shared/item-data'

interface DailyRewardProps {
  onBack: () => void
}

export function DailyReward({ onBack }: DailyRewardProps): JSX.Element {
  const [reward, setReward] = useState<DailyRewardType | null>(null)
  const [claimed, setClaimed] = useState(false)
  const [revealing, setRevealing] = useState(false)

  const handleOpen = async (): Promise<void> => {
    setRevealing(true)
    const result = await window.api.claimDailyReward()
    setTimeout(() => {
      setReward(result as DailyRewardType | null)
      if (result) setClaimed(true)
    }, 800)
  }

  return (
    <div style={{
      width: 800,
      height: 600,
      background: '#f5e6d3',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '2px solid #d4b896'
      }}>
        <button onClick={onBack} style={{
          border: 'none', background: '#c0392b', color: '#fff',
          padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600
        }}>Back</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>Daily Reward</span>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24
      }}>
        {!revealing && !reward && (
          <>
            {/* Poké Ball to open */}
            <div
              onClick={handleOpen}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '4px solid #333',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
                animation: 'pokeball-bounce 2s ease-in-out infinite'
              }}
            >
              <div style={{ width: '100%', height: '50%', background: '#e74c3c' }} />
              <div style={{ width: '100%', height: '50%', background: '#ecf0f1' }} />
              <div style={{
                position: 'absolute', top: '50%', left: 0, right: 0,
                height: 5, background: '#333', transform: 'translateY(-50%)'
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 24, height: 24, background: '#ecf0f1',
                border: '4px solid #333', borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }} />
            </div>
            <div style={{ color: '#5d4e37', fontSize: 16, fontWeight: 600 }}>
              Click to open!
            </div>
          </>
        )}

        {revealing && !reward && (
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 60px rgba(255,255,255,0.8)',
            animation: 'pulse 0.5s ease-in-out infinite'
          }} />
        )}

        {reward && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
            {reward.type === 'pokemon' && reward.pokemonSpeciesId ? (
              <>
                <div style={{ fontSize: 64, marginBottom: 12 }}>🐾</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#5d4e37' }}>
                  {getSpeciesById(reward.pokemonSpeciesId)?.nameZh ?? 'Pokemon'}!
                </div>
                <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
                  {getSpeciesById(reward.pokemonSpeciesId)?.name} joined your team!
                </div>
              </>
            ) : reward.items ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#5d4e37', marginBottom: 12 }}>
                  Items received!
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {reward.items.map((ri) => {
                    const item = getItemById(ri.itemId)
                    return (
                      <div key={ri.itemId} style={{
                        padding: '8px 16px',
                        background: '#f5efe8',
                        borderRadius: 8,
                        border: '1px solid #d4b896'
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37' }}>
                          {item?.nameZh ?? ri.itemId}
                        </div>
                        <div style={{ fontSize: 11, color: '#888' }}>×{ri.quantity}</div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{ color: '#999' }}>No reward available today</div>
            )}

            <button
              onClick={onBack}
              style={{
                marginTop: 24,
                border: 'none',
                background: '#27ae60',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Nice!
            </button>
          </div>
        )}

        {!reward && !revealing && (
          <div style={{ color: '#999', fontSize: 12 }}>
            New rewards available daily after 8 AM
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pokeball-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
