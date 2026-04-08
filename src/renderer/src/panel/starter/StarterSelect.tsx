import { useState } from 'react'
import { STARTER_SPECIES } from '../../../../shared/constants'
import { getSpeciesById } from '../../../../shared/pokemon-data'
import { localeName } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'
import '../bedroom/styles.css'

interface StarterSelectProps {
  onSelected: () => void
}

export function StarterSelect({ onSelected }: StarterSelectProps): JSX.Element {
  const [choosing, setChoosing] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const { lang, t } = useI18n()

  const starterInfo = STARTER_SPECIES.map((id) => {
    const species = getSpeciesById(id)!
    return { id, name: species.name, nameZh: species.nameZh }
  })

  const handlePick = async (speciesId: number): Promise<void> => {
    if (choosing !== null) return
    setChoosing(speciesId)

    // Reveal animation
    setTimeout(() => setRevealed(true), 400)

    // Send IPC after animation
    setTimeout(async () => {
      await window.api.chooseStarter(speciesId)
      onSelected()
    }, 1800)
  }

  return (
    <div className="bedroom" style={{ position: 'relative' }}>
      {/* Dimmed bedroom backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
        zIndex: 10
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 20,
        color: '#fff',
        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: "'Segoe UI', system-ui" }}>
          {t.choosePartner}
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.8, fontFamily: "'Segoe UI', system-ui" }}>
          {t.starterHint}
        </p>
      </div>

      {/* Three Poké Balls */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        gap: 80,
        zIndex: 20
      }}>
        {starterInfo.map((starter) => {
          const isChosen = choosing === starter.id
          const isOther = choosing !== null && !isChosen

          return (
            <div
              key={starter.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                opacity: isOther ? 0.3 : 1,
                transition: 'opacity 0.4s, transform 0.4s',
                transform: isOther ? 'scale(0.8)' : 'scale(1)'
              }}
            >
              {/* Ball */}
              <div
                onClick={() => handlePick(starter.id)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: '3px solid #333',
                  overflow: 'hidden',
                  cursor: choosing ? 'default' : 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  animation: !choosing ? 'pokeball-bounce 2s ease-in-out infinite' : 'none',
                  animationDelay: `${starter.id * 0.3}s`,
                  transform: isChosen && revealed ? 'scale(1.3)' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!choosing) (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'
                }}
                onMouseLeave={(e) => {
                  if (!choosing) (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                }}
              >
                {/* White flash on reveal */}
                {isChosen && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fff',
                    opacity: revealed ? 0 : 1,
                    transition: 'opacity 0.6s',
                    zIndex: 5,
                    borderRadius: '50%'
                  }} />
                )}

                <div style={{
                  width: '100%',
                  height: '50%',
                  background: '#e74c3c'
                }} />
                <div style={{
                  width: '100%',
                  height: '50%',
                  background: '#ecf0f1'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: 4,
                  background: '#333',
                  transform: 'translateY(-50%)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 16,
                  height: 16,
                  background: '#ecf0f1',
                  border: '3px solid #333',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }} />
              </div>

              {/* Label */}
              <div style={{
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                fontFamily: "'Segoe UI', system-ui"
              }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{localeName(starter.nameZh, starter.name, lang)}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{lang === 'zh' ? starter.name : starter.nameZh}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chosen message */}
      {revealed && choosing && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 20,
          color: '#f1c40f',
          fontSize: 20,
          fontWeight: 700,
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          fontFamily: "'Segoe UI', system-ui",
          animation: 'fadeIn 0.5s ease-in'
        }}>
          {(() => {
            const sp = getSpeciesById(choosing)
            return sp ? localeName(sp.nameZh, sp.name, lang) : ''
          })()} {t.choseYou}
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
