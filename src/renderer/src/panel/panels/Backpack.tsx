import { useState } from 'react'
import type { SaveData, BackpackItem } from '../../../../shared/types'
import { getItemById } from '../../../../shared/item-data'
import { getSpeciesById } from '../../../../shared/pokemon-data'
import { localeName, localeDescription } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'

interface BackpackProps {
  saveData: SaveData
  onBack: () => void
}

export function Backpack({ saveData, onBack }: BackpackProps): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showPokemonPicker, setShowPokemonPicker] = useState(false)
  const { lang, t } = useI18n()

  const selected = selectedItem ? getItemById(selectedItem) : null
  const selectedQuantity = saveData.backpack.find((b) => b.itemId === selectedItem)?.quantity ?? 0

  const handleUseItem = async (pokemonId: string): Promise<void> => {
    if (!selectedItem) return
    await window.api.useItem(selectedItem, pokemonId)
    setShowPokemonPicker(false)
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
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{t.backpack}</span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
          {saveData.backpack.length} {t.items}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Item grid */}
        <div style={{
          flex: 1,
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignContent: 'flex-start',
          overflowY: 'auto'
        }}>
          {saveData.backpack.length === 0 ? (
            <div style={{ color: '#999', fontSize: 14, padding: 20 }}>
              {t.backpackEmpty}
            </div>
          ) : (
            saveData.backpack.map((bi: BackpackItem) => {
              const item = getItemById(bi.itemId)
              if (!item) return null
              return (
                <div
                  key={bi.itemId}
                  onClick={() => {
                    setSelectedItem(bi.itemId === selectedItem ? null : bi.itemId)
                    setShowPokemonPicker(false)
                  }}
                  style={{
                    width: 120,
                    padding: 10,
                    background: bi.itemId === selectedItem ? '#e8d5c0' : '#f5efe8',
                    border: `2px solid ${bi.itemId === selectedItem ? '#c9a87c' : '#ddd'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>
                    {item.category === 'food' ? '🍬' : '💎'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#5d4e37' }}>
                    {localeName(item.nameZh, item.name, lang)}
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>×{bi.quantity}</div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            width: 220,
            padding: 16,
            borderLeft: '2px solid #d4b896',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#5d4e37' }}>
              {localeName(selected.nameZh, selected.name, lang)}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              {lang === 'zh' ? selected.name : selected.nameZh}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
              {localeDescription(selected.descriptionZh, selected.description, lang)}
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>{t.quantity}{selectedQuantity}</div>

            <button
              onClick={() => setShowPokemonPicker(!showPokemonPicker)}
              style={btnStyle('#27ae60')}
            >
              {selected.holdable ? t.giveTo : t.useOn}
            </button>

            {showPokemonPicker && (
              <div style={{
                background: '#fff',
                borderRadius: 6,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxHeight: 200,
                overflowY: 'auto'
              }}>
                {saveData.pokemon.map((p) => {
                  const sp = getSpeciesById(p.speciesId)
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleUseItem(p.id)}
                      style={{
                        ...btnStyle('#7f8c8d'),
                        fontSize: 11,
                        padding: '6px 8px',
                        textAlign: 'left'
                      }}
                    >
                      {sp ? localeName(sp.nameZh, sp.name, lang) : `#${p.speciesId}`} {t.lv}{p.level}
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
