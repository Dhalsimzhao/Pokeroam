import type { OwnedPokemon } from '../../../../shared/types'
import { getSpeciesById } from '../../../../shared/pokemon-data'
import { getItemById } from '../../../../shared/item-data'
import { localeName } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'

interface PokemonCardProps {
  pokemon: OwnedPokemon
  isActive: boolean
  selected: boolean
  onClick: () => void
}

export function PokemonCard({ pokemon, isActive, selected, onClick }: PokemonCardProps): JSX.Element {
  const species = getSpeciesById(pokemon.speciesId)
  const heldItem = pokemon.heldItemId ? getItemById(pokemon.heldItemId) : null
  const { lang, t } = useI18n()

  return (
    <div
      onClick={onClick}
      style={{
        width: 140,
        padding: 12,
        background: selected ? '#e8d5c0' : '#f5efe8',
        border: `2px solid ${isActive ? '#e74c3c' : selected ? '#c9a87c' : '#ddd'}`,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: '#e74c3c',
          color: '#fff',
          fontSize: 9,
          padding: '2px 6px',
          borderRadius: 4,
          fontWeight: 600
        }}>
          {t.onDesktop}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{
          fontSize: 28,
          lineHeight: 1,
          marginBottom: 4
        }}>
          🐾
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37' }}>
          {pokemon.nickname || (species ? localeName(species.nameZh, species.name, lang) : `#${pokemon.speciesId}`)}
        </div>
        <div style={{ fontSize: 11, color: '#888' }}>
          {lang === 'zh' ? species?.name : species?.nameZh} · {t.lv}{pokemon.level}
        </div>
        {heldItem && (
          <div style={{ fontSize: 10, color: '#e67e22', marginTop: 4 }}>
            🔹 {localeName(heldItem.nameZh, heldItem.name, lang)}
          </div>
        )}
      </div>
    </div>
  )
}
