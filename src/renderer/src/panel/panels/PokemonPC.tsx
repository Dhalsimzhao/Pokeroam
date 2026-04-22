import { useState } from 'react'
import type { SaveData, BackpackItem } from '../../../../shared/types'
import { getItemById } from '../../../../shared/item-data'
import { localeName } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'
import { PokemonCard } from './PokemonCard'

interface PokemonPCProps {
  saveData: SaveData
  onBack: () => void
}

export function PokemonPC({ saveData, onBack }: PokemonPCProps): JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showItemPicker, setShowItemPicker] = useState(false)
  const { lang, t } = useI18n()

  const selected = saveData.pokemon.find((p) => p.id === selectedId)
  const isActive = selectedId === saveData.activePokemonId

  const holdableItems: BackpackItem[] = saveData.backpack.filter((b) => {
    const item = getItemById(b.itemId)
    return item?.holdable && b.quantity > 0
  })

  const handleRelease = async (): Promise<void> => {
    if (!selectedId) return
    await window.api.releasePokemon(selectedId)
  }

  const handleRecall = async (): Promise<void> => {
    await window.api.recallPokemon()
  }

  const handleEquip = async (itemId: string): Promise<void> => {
    if (!selectedId) return
    await window.api.equipItem(selectedId, itemId)
    setShowItemPicker(false)
  }

  const handleUnequip = async (): Promise<void> => {
    if (!selectedId) return
    await window.api.unequipItem(selectedId)
  }

  return (
    <div style={{
      width: 1100,
      height: 720,
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
        <button onClick={onBack} style={btnStyle('#c0392b')}>{t.back}</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{t.pokemonPC}</span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
          {t.pokemonCount.replace('{count}', String(saveData.pokemon.length))}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Pokemon grid */}
        <div style={{
          flex: 1,
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignContent: 'flex-start',
          overflowY: 'auto'
        }}>
          {saveData.pokemon.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              isActive={p.id === saveData.activePokemonId}
              selected={p.id === selectedId}
              onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
            />
          ))}
        </div>

        {/* Action panel */}
        {selected && (
          <div style={{
            width: 200,
            padding: 16,
            borderLeft: '2px solid #d4b896',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#5d4e37', marginBottom: 8 }}>
              {t.actions}
            </div>

            {isActive ? (
              <button onClick={handleRecall} style={btnStyle('#3498db')}>
                {t.recall}
              </button>
            ) : (
              <button onClick={handleRelease} style={btnStyle('#27ae60')}>
                {t.release}
              </button>
            )}

            {selected.heldItemId ? (
              <button onClick={handleUnequip} style={btnStyle('#e67e22')}>
                {t.unequip}
              </button>
            ) : (
              <button
                onClick={() => setShowItemPicker(!showItemPicker)}
                style={btnStyle('#8e44ad')}
                disabled={holdableItems.length === 0}
              >
                {t.equip}
              </button>
            )}

            {/* Item picker */}
            {showItemPicker && holdableItems.length > 0 && (
              <div style={{
                background: '#fff',
                borderRadius: 6,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                {holdableItems.map((bi) => {
                  const item = getItemById(bi.itemId)!
                  return (
                    <button
                      key={bi.itemId}
                      onClick={() => handleEquip(bi.itemId)}
                      style={{
                        ...btnStyle('#7f8c8d'),
                        fontSize: 11,
                        padding: '4px 8px'
                      }}
                    >
                      {localeName(item.nameZh, item.name, lang)} ×{bi.quantity}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    border: 'none',
    background: bg,
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600
  }
}
