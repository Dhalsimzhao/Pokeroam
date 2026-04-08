import { useState } from 'react'
import { POKEMON_SPECIES } from '../../../../shared/pokemon-data'
import { getEvolutionChain, getSpeciesById } from '../../../../shared/pokemon-data'
import type { PokemonSpecies } from '../../../../shared/types'
import { localeName } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'

interface PokedexProps {
  unlockedIds: number[]
  onBack: () => void
}

export function Pokedex({ unlockedIds, onBack }: PokedexProps): JSX.Element {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { lang, t } = useI18n()

  const isUnlocked = (id: number): boolean => unlockedIds.includes(id)
  const selected = selectedId ? getSpeciesById(selectedId) : null

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
        <button onClick={selectedId ? () => setSelectedId(null) : onBack} style={btnStyle('#c0392b')}>
          {selectedId ? t.list : t.back}
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{t.pokedex}</span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
          {unlockedIds.length}/{POKEMON_SPECIES.length} {t.discovered}
        </span>
      </div>

      {selected ? (
        <DetailView species={selected} unlockedIds={unlockedIds} lang={lang} t={t} />
      ) : (
        <GridView
          unlockedIds={unlockedIds}
          onSelect={(id) => isUnlocked(id) && setSelectedId(id)}
          lang={lang}
        />
      )}
    </div>
  )
}

function GridView({
  unlockedIds,
  onSelect,
  lang
}: {
  unlockedIds: number[]
  onSelect: (id: number) => void
  lang: 'zh' | 'en'
}): JSX.Element {
  return (
    <div style={{
      flex: 1,
      padding: 16,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      alignContent: 'flex-start',
      overflowY: 'auto'
    }}>
      {POKEMON_SPECIES.map((sp) => {
        const unlocked = unlockedIds.includes(sp.id)
        return (
          <div
            key={sp.id}
            onClick={() => onSelect(sp.id)}
            style={{
              width: 100,
              padding: 8,
              background: unlocked ? '#f5efe8' : '#e0d5c8',
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: unlocked ? 'pointer' : 'default',
              textAlign: 'center',
              transition: 'all 0.2s',
              opacity: unlocked ? 1 : 0.6
            }}
          >
            <div style={{
              fontSize: 24,
              filter: unlocked ? 'none' : 'brightness(0)',
              marginBottom: 4
            }}>
              🐾
            </div>
            <div style={{ fontSize: 10, color: '#999' }}>#{String(sp.id).padStart(3, '0')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#5d4e37' }}>
              {unlocked ? localeName(sp.nameZh, sp.name, lang) : '???'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DetailView({
  species,
  unlockedIds,
  lang,
  t
}: {
  species: PokemonSpecies
  unlockedIds: number[]
  lang: 'zh' | 'en'
  t: { evolutionChain: string; lv: string }
}): JSX.Element {
  const chain = getEvolutionChain(species.id)

  return (
    <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
      {/* Species info */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{
          width: 100,
          height: 100,
          background: '#f5efe8',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          border: '2px solid #d4b896'
        }}>
          🐾
        </div>
        <div>
          <h2 style={{ margin: 0, color: '#5d4e37' }}>{localeName(species.nameZh, species.name, lang)}</h2>
          <div style={{ color: '#888', marginBottom: 8 }}>
            {lang === 'zh' ? species.name : species.nameZh} · #{String(species.id).padStart(3, '0')}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {species.types.map((tp) => (
              <span key={tp} style={{
                padding: '2px 10px',
                background: typeColor(tp),
                color: '#fff',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {tp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution chain */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#5d4e37', marginBottom: 12 }}>
          {t.evolutionChain}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {chain.map((id, i) => {
            const sp = getSpeciesById(id)!
            const unlocked = unlockedIds.includes(id)
            const isCurrentSpecies = id === species.id

            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && (
                  <div style={{ color: '#999', fontSize: 12 }}>
                    → {sp.evolutionLevel ? `${t.lv}${sp.evolutionLevel}` : sp.evolutionItem ?? ''}
                  </div>
                )}
                <div style={{
                  padding: 8,
                  background: isCurrentSpecies ? '#e8d5c0' : '#f5efe8',
                  border: isCurrentSpecies ? '2px solid #e74c3c' : '1px solid #ddd',
                  borderRadius: 8,
                  textAlign: 'center',
                  opacity: unlocked ? 1 : 0.5
                }}>
                  <div style={{
                    fontSize: 20,
                    filter: unlocked ? 'none' : 'brightness(0)'
                  }}>
                    🐾
                  </div>
                  <div style={{ fontSize: 10, color: '#5d4e37' }}>
                    {unlocked ? localeName(sp.nameZh, sp.name, lang) : '???'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function typeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', grass: '#7AC74C',
    electric: '#F7D02C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', fairy: '#D685AD'
  }
  return colors[type] || '#999'
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    border: 'none',
    background: bg,
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600
  }
}
