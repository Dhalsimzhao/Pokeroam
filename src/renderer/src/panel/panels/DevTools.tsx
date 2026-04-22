import { useState } from 'react'
import type { SaveData, OwnedPokemon, BackpackItem, ItemDefinition } from '../../../../shared/types'
import { POKEMON_SPECIES, getSpeciesById, getExpForLevel } from '../../../../shared/pokemon-data'
import { ITEMS, getItemById } from '../../../../shared/item-data'
import { MAX_LEVEL } from '../../../../shared/constants'
import { localeName, type LangCode, type Locale } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'

type Tab = 'pokemon' | 'backpack'

interface Props {
  saveData: SaveData
  onBack: () => void
}

/** Deep clone the save so draft edits don't mutate the parent state until Confirm. */
function cloneSave(data: SaveData): SaveData {
  return JSON.parse(JSON.stringify(data)) as SaveData
}

export function DevTools({ saveData, onBack }: Props): JSX.Element {
  const { lang, t } = useI18n()
  const [tab, setTab] = useState<Tab>('pokemon')
  const [draft, setDraft] = useState<SaveData>(() => cloneSave(saveData))
  const [editingId, setEditingId] = useState<string | null>(null)

  const dirty = JSON.stringify(draft) !== JSON.stringify(saveData)

  const handleCancel = (): void => {
    setDraft(cloneSave(saveData))
    setEditingId(null)
    onBack()
  }

  const handleConfirm = async (): Promise<void> => {
    const ok = await window.api.applyDebugSaveData(draft)
    if (ok) onBack()
  }

  // ---- Pokemon edits ----

  const addPokemon = (speciesId: number): void => {
    const species = getSpeciesById(speciesId)
    if (!species) return
    const level = 5
    const newMon: OwnedPokemon = {
      id: crypto.randomUUID(),
      speciesId,
      nickname: null,
      level,
      exp: getExpForLevel(species.expGroup, level),
      heldItemId: null
    }
    setDraft((d) => ({ ...d, pokemon: [...d.pokemon, newMon] }))
  }

  const removePokemon = (id: string): void => {
    setDraft((d) => ({
      ...d,
      pokemon: d.pokemon.filter((p) => p.id !== id),
      activePokemonId: d.activePokemonId === id ? null : d.activePokemonId
    }))
    if (editingId === id) setEditingId(null)
  }

  const updatePokemon = (id: string, patch: Partial<OwnedPokemon>): void => {
    setDraft((d) => ({
      ...d,
      pokemon: d.pokemon.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, ...patch }
        // Re-sync exp when level is edited, so the pet renderer stays consistent.
        if (patch.level !== undefined) {
          const species = getSpeciesById(next.speciesId)
          if (species) next.exp = getExpForLevel(species.expGroup, next.level)
        }
        return next
      })
    }))
  }

  // ---- Backpack edits ----

  const addBackpackItem = (itemId: string): void => {
    setDraft((d) => {
      if (d.backpack.some((b) => b.itemId === itemId)) return d
      return { ...d, backpack: [...d.backpack, { itemId, quantity: 1 }] }
    })
  }

  const setBackpackQuantity = (itemId: string, qty: number): void => {
    const clamped = Math.max(0, Math.floor(qty))
    setDraft((d) => ({
      ...d,
      backpack:
        clamped <= 0
          ? d.backpack.filter((b) => b.itemId !== itemId)
          : d.backpack.map((b) => (b.itemId === itemId ? { ...b, quantity: clamped } : b))
    }))
  }

  const removeBackpackItem = (itemId: string): void => {
    setDraft((d) => ({ ...d, backpack: d.backpack.filter((b) => b.itemId !== itemId) }))
  }

  const editing = editingId ? draft.pokemon.find((p) => p.id === editingId) ?? null : null
  const holdableItems = ITEMS.filter((i) => i.holdable)

  return (
    <div style={{
      width: 800, height: 600, background: '#f5e6d3',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Header with tabs */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid #d4b896'
      }}>
        <button onClick={handleCancel} style={btnStyle('#c0392b')}>{t.back}</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{t.debugPanel}</span>
        <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
          <TabBtn active={tab === 'pokemon'} onClick={() => setTab('pokemon')}>
            {t.debugTabPokemon}
          </TabBtn>
          <TabBtn active={tab === 'backpack'} onClick={() => setTab('backpack')}>
            {t.debugTabBackpack}
          </TabBtn>
        </div>
        {dirty && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#c0392b', fontWeight: 600 }}>
            {t.debugUnsavedChanges}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        {tab === 'pokemon' && (
          <PokemonTab
            draft={draft}
            lang={lang}
            editing={editing}
            holdableItems={holdableItems}
            onAdd={addPokemon}
            onRemove={removePokemon}
            onEdit={setEditingId}
            onUpdate={updatePokemon}
            onCloseEdit={() => setEditingId(null)}
            t={t}
          />
        )}
        {tab === 'backpack' && (
          <BackpackTab
            draft={draft}
            lang={lang}
            onAdd={addBackpackItem}
            onRemove={removeBackpackItem}
            onSetQuantity={setBackpackQuantity}
            t={t}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px', borderTop: '2px solid #d4b896',
        display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#efe1cc'
      }}>
        <button onClick={handleCancel} style={btnStyle('#7f8c8d')}>{t.debugCancel}</button>
        <button onClick={handleConfirm} style={btnStyle('#27ae60')}>{t.debugConfirm}</button>
      </div>
    </div>
  )
}

// ==================== Pokemon tab ====================

interface PokemonTabProps {
  draft: SaveData
  lang: LangCode
  editing: OwnedPokemon | null
  holdableItems: ItemDefinition[]
  onAdd: (speciesId: number) => void
  onRemove: (id: string) => void
  onEdit: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<OwnedPokemon>) => void
  onCloseEdit: () => void
  t: Locale
}

function PokemonTab(p: PokemonTabProps): JSX.Element {
  const [addingSpecies, setAddingSpecies] = useState<number>(POKEMON_SPECIES[0].id)

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <select
            value={addingSpecies}
            onChange={(e) => setAddingSpecies(Number(e.target.value))}
            style={selectStyle}
          >
            {POKEMON_SPECIES.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} {localeName(s.nameZh, s.name, p.lang)}
              </option>
            ))}
          </select>
          <button onClick={() => p.onAdd(addingSpecies)} style={btnStyle('#27ae60')}>
            + {p.t.debugAddPokemon}
          </button>
        </div>
        {p.draft.pokemon.map((pk) => {
          const sp = getSpeciesById(pk.speciesId)
          const isActive = pk.id === p.draft.activePokemonId
          return (
            <div
              key={pk.id}
              onClick={() => p.onEdit(pk.id)}
              style={{
                padding: 8,
                background: p.editing?.id === pk.id ? '#e8d5c0' : '#fff',
                border: `1px solid ${isActive ? '#27ae60' : '#ddd'}`,
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span style={{ fontSize: 12, color: '#5d4e37', flex: 1 }}>
                {sp ? localeName(sp.nameZh, sp.name, p.lang) : `#${pk.speciesId}`} {p.t.lv}{pk.level}
                {isActive && (
                  <span style={{ marginLeft: 6, fontSize: 10, color: '#27ae60' }}>
                    ({p.t.onDesktop})
                  </span>
                )}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); p.onRemove(pk.id) }}
                style={{ ...btnStyle('#c0392b'), padding: '4px 8px', fontSize: 11 }}
              >
                {p.t.debugRemove}
              </button>
            </div>
          )
        })}
      </div>

      {/* Edit pane */}
      {p.editing && (
        <div style={{
          width: 260, padding: 12, background: '#fff', borderRadius: 8,
          border: '1px solid #d4b896', display: 'flex', flexDirection: 'column', gap: 10
        }}>
          <div style={{ fontWeight: 600, color: '#5d4e37', fontSize: 14 }}>
            {p.t.debugEditPokemon}
          </div>
          <label style={{ fontSize: 12, color: '#5d4e37' }}>
            {p.t.debugLevel}: {p.editing.level}
            <input
              type="range"
              min={1}
              max={MAX_LEVEL}
              value={p.editing.level}
              onChange={(e) => p.onUpdate(p.editing!.id, { level: Number(e.target.value) })}
              style={{ width: '100%', marginTop: 4 }}
            />
            <input
              type="number"
              min={1}
              max={MAX_LEVEL}
              value={p.editing.level}
              onChange={(e) => {
                const v = Math.max(1, Math.min(MAX_LEVEL, Number(e.target.value) || 1))
                p.onUpdate(p.editing!.id, { level: v })
              }}
              style={{ ...selectStyle, width: '100%', marginTop: 4 }}
            />
          </label>
          <label style={{ fontSize: 12, color: '#5d4e37' }}>
            {p.t.debugHeldItem}
            <select
              value={p.editing.heldItemId ?? ''}
              onChange={(e) => p.onUpdate(p.editing!.id, {
                heldItemId: e.target.value === '' ? null : e.target.value
              })}
              style={{ ...selectStyle, width: '100%', marginTop: 4 }}
            >
              <option value="">{p.t.debugHeldItemNone}</option>
              {p.holdableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {localeName(item.nameZh, item.name, p.lang)}
                </option>
              ))}
            </select>
          </label>
          <button onClick={p.onCloseEdit} style={btnStyle('#7f8c8d')}>{p.t.back}</button>
        </div>
      )}
    </div>
  )
}

// ==================== Backpack tab ====================

interface BackpackTabProps {
  draft: SaveData
  lang: LangCode
  onAdd: (itemId: string) => void
  onRemove: (itemId: string) => void
  onSetQuantity: (itemId: string, qty: number) => void
  t: Locale
}

function BackpackTab(p: BackpackTabProps): JSX.Element {
  const owned = new Set(p.draft.backpack.map((b) => b.itemId))
  const available = ITEMS.filter((i) => !owned.has(i.id))
  const [adding, setAdding] = useState<string>(available[0]?.id ?? '')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {available.length > 0 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <select
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            style={selectStyle}
          >
            {available.map((i) => (
              <option key={i.id} value={i.id}>
                {localeName(i.nameZh, i.name, p.lang)}
              </option>
            ))}
          </select>
          <button
            onClick={() => { if (adding) p.onAdd(adding) }}
            style={btnStyle('#27ae60')}
          >
            + {p.t.debugAddItem}
          </button>
        </div>
      )}
      {p.draft.backpack.map((bi: BackpackItem) => {
        const item = getItemById(bi.itemId)
        if (!item) return null
        return (
          <div
            key={bi.itemId}
            style={{
              padding: 8, background: '#fff', borderRadius: 6,
              border: '1px solid #ddd',
              display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            <span style={{ flex: 1, fontSize: 12, color: '#5d4e37' }}>
              {localeName(item.nameZh, item.name, p.lang)}
            </span>
            <label style={{ fontSize: 11, color: '#888' }}>
              {p.t.debugQuantity}:
              <input
                type="number"
                min={0}
                value={bi.quantity}
                onChange={(e) => p.onSetQuantity(bi.itemId, Number(e.target.value))}
                style={{ ...selectStyle, width: 60, marginLeft: 6 }}
              />
            </label>
            <button
              onClick={() => p.onRemove(bi.itemId)}
              style={{ ...btnStyle('#c0392b'), padding: '4px 8px', fontSize: 11 }}
            >
              {p.t.debugRemove}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ==================== Styles ====================

function TabBtn(props: { active: boolean; onClick: () => void; children: React.ReactNode }): JSX.Element {
  return (
    <button
      onClick={props.onClick}
      style={{
        border: 'none',
        background: props.active ? '#5d4e37' : '#d4b896',
        color: props.active ? '#fff' : '#5d4e37',
        padding: '6px 14px', borderRadius: 4,
        cursor: 'pointer', fontSize: 13, fontWeight: 600
      }}
    >
      {props.children}
    </button>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    border: 'none', background: bg, color: '#fff',
    padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
    fontSize: 13, fontWeight: 600
  }
}

const selectStyle: React.CSSProperties = {
  padding: '4px 8px', fontSize: 12, border: '1px solid #ccc',
  borderRadius: 4, background: '#fff'
}
