import { useEffect, useMemo, useState } from 'react'
import type {
  SaveData,
  OwnedPokemon,
  BackpackItem,
  ItemDefinition,
  PetAnimState,
  PetTuning,
  SpriteSheetConfig
} from '../../../../shared/types'
import {
  ALL_ANIM_STATES,
  DEFAULT_PET_TUNING,
  MULTI_DIRECTION_ANIMS
} from '../../../../shared/types'
import { POKEMON_SPECIES, getSpeciesById, getExpForLevel } from '../../../../shared/pokemon-data'
import { ITEMS, getItemById } from '../../../../shared/item-data'
import { MAX_LEVEL } from '../../../../shared/constants'
import { localeName, type LangCode, type Locale } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'
import {
  getAvailableSpriteKeys,
  getSpriteConfig,
  SPRITE_KEY_FILENAMES
} from '../../shared/sprite-config'
import { SpriteCanvas } from '../../pet/SpriteCanvas'
import { useAnimationLoop } from '../../pet/useAnimationLoop'
import { initPetTuning } from '../../pet/pet-tuning'
import {
  ALL_PMD_ANIMS,
  resolveAnchor,
  SPRITE_KEY_TO_PMD_ANIM,
  type PmdAnimName,
  type SpriteAnchorEntry,
  type SpriteAnchorMap
} from '../../../../shared/sprite-anchors'
import { useSpeciesAnchors } from '../../shared/sprite-anchors-store'

type Tab = 'pokemon' | 'backpack' | 'tuning' | 'anim'

const ANIM_STATES = ALL_ANIM_STATES

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
      width: 1100, height: 720, background: '#f5e6d3',
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
          <TabBtn active={tab === 'tuning'} onClick={() => setTab('tuning')}>
            {t.debugTabTuning}
          </TabBtn>
          <TabBtn active={tab === 'anim'} onClick={() => setTab('anim')}>
            {t.debugTabAnim}
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
        {tab === 'tuning' && <TuningTab t={t} />}
        {tab === 'anim' && <AnimationTab lang={lang} t={t} saveData={saveData} />}
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

// ==================== Tuning tab ====================

type NumericTuningKey = {
  [K in keyof PetTuning]: PetTuning[K] extends number ? K : never
}[keyof PetTuning]

interface TuningParamSpec {
  key: NumericTuningKey
  label: string
  min: number
  max: number
  step: number
}

function TuningTab({ t }: { t: Locale }): JSX.Element {
  const [tuning, setTuning] = useState<PetTuning>(DEFAULT_PET_TUNING)

  useEffect(() => {
    window.api.getPetTuning().then(setTuning)
    return window.api.onPetTuningUpdate(setTuning)
  }, [])

  const apply = (patch: Partial<PetTuning>): void => {
    // Optimistic local update so the slider feels responsive; the main process
    // will echo back via onPetTuningUpdate.
    setTuning((prev) => ({ ...prev, ...patch }))
    window.api.setPetTuning(patch)
  }

  const numericSpecs: TuningParamSpec[] = [
    { key: 'walkSpeed', label: t.debugTuningWalkSpeed, min: 0.1, max: 3.0, step: 0.1 },
    { key: 'gravity', label: t.debugTuningGravity, min: 0.1, max: 2.0, step: 0.1 }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
      <div style={{ fontSize: 11, color: '#7d6b4f' }}>{t.debugTuningHint}</div>

      {numericSpecs.map((spec) => (
        <TuningSlider
          key={spec.key}
          label={spec.label}
          value={tuning[spec.key] as number}
          defaultValue={DEFAULT_PET_TUNING[spec.key] as number}
          min={spec.min}
          max={spec.max}
          step={spec.step}
          onChange={(v) => apply({ [spec.key]: v } as Partial<PetTuning>)}
        />
      ))}

      <button
        onClick={() => apply({ walkSpeed: DEFAULT_PET_TUNING.walkSpeed, gravity: DEFAULT_PET_TUNING.gravity })}
        style={{ ...btnStyle('#7f8c8d'), alignSelf: 'flex-start' }}
      >
        {t.debugTuningReset}
      </button>
    </div>
  )
}

interface TuningSliderProps {
  label: string
  value: number
  defaultValue: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}

function TuningSlider(p: TuningSliderProps): JSX.Element {
  const clamp = (n: number): number => Math.max(p.min, Math.min(p.max, n))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5d4e37' }}>
        <span style={{ flex: 1, fontWeight: 600 }}>{p.label}</span>
        <input
          type="number"
          min={p.min}
          max={p.max}
          step={p.step}
          value={p.value}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) p.onChange(clamp(v))
          }}
          style={{ ...selectStyle, width: 80 }}
        />
        <span style={{ fontSize: 10, color: '#a08b6a', minWidth: 70, textAlign: 'right' }}>
          default {p.defaultValue}
        </span>
      </div>
      <input
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.value}
        onChange={(e) => p.onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  )
}

// ==================== Animation preview tab ====================

interface AnimationTabProps {
  lang: LangCode
  t: Locale
  saveData: SaveData
}

/**
 * Dump the current row + spriteKey choices as paste-ready TS literals that
 * match `DEFAULT_ANIM_ROWS` and `DEFAULT_SPRITE_KEYS` in shared/types.ts.
 * These two are global gameplay decisions (per PetAnimState, not per species),
 * so they live in code — the dev panel just helps you tune and snapshot them.
 */
function copyCodeDefaultsToClipboard(animParams: PetTuning['animParams']): void {
  const rowLines = ALL_ANIM_STATES.map((s) => `  ${s}: ${animParams[s].row}`).join(',\n')
  const keyLines = ALL_ANIM_STATES
    .map((s) => `  ${s}: '${animParams[s].spriteKey}'`).join(',\n')
  const snippet =
    `export const DEFAULT_ANIM_ROWS: Record<PetAnimState, number> = {\n${rowLines}\n}\n\n` +
    `export const DEFAULT_SPRITE_KEYS: Record<PetAnimState, PetAnimState> = {\n${keyLines}\n}\n`
  void navigator.clipboard.writeText(snippet)
}

const DIRECTION_LABEL_KEYS: ReadonlyArray<keyof Locale> = [
  'debugAnimDirDown',
  'debugAnimDirDownRight',
  'debugAnimDirRight',
  'debugAnimDirUpRight',
  'debugAnimDirUp',
  'debugAnimDirUpLeft',
  'debugAnimDirLeft',
  'debugAnimDirDownLeft'
]

function AnimationTab({ lang, t, saveData }: AnimationTabProps): JSX.Element {
  const activeSpeciesId =
    saveData.pokemon.find((p) => p.id === saveData.activePokemonId)?.speciesId
    ?? POKEMON_SPECIES[0].id
  const [speciesId, setSpeciesId] = useState<number>(activeSpeciesId)
  const [tuning, setTuning] = useState<PetTuning>(DEFAULT_PET_TUNING)

  // Saved (on-disk) anchors for this species, fetched from main and kept in
  // sync with broadcasts. After a successful "Update XML" the broadcast lands
  // here, which in turn rehydrates the local draft below.
  const savedAnchors = useSpeciesAnchors(speciesId)

  // Per-species draft of <AnchorBottom>/<PlaybackSpeed> values the user is
  // tuning. Independent of `savedAnchors` until "Update XML" persists, so
  // mid-tuning state isn't lost if a broadcast fires for an unrelated reason.
  const [draftAnchors, setDraftAnchors] = useState<SpriteAnchorMap>({})

  // Whenever we land on a different species (or the saved snapshot updates,
  // e.g. after a write), reset the draft to mirror disk. Prevents stale draft
  // values from one species leaking into another after a switch.
  useEffect(() => {
    setDraftAnchors({ ...savedAnchors })
  }, [speciesId, savedAnchors])

  const draftDirty = useMemo(() => {
    for (const anim of ALL_PMD_ANIMS) {
      const a = resolveAnchor(savedAnchors, anim)
      const b = resolveAnchor(draftAnchors, anim)
      if (a.anchorBottom !== b.anchorBottom || a.speed !== b.speed) return true
    }
    return false
  }, [savedAnchors, draftAnchors])

  // Keep both the React state (for re-rendering previews when sliders move)
  // and the pet-tuning module singleton (which useAnimationLoop reads) in sync.
  // initPetTuning wires the singleton; the setTuning subscription drives renders.
  //
  // We per-state merge the broadcast instead of wholesale replacing, so a stale
  // main that strips unknown AnimParams fields from its echo can't silently
  // undo a field we just optimistically set (the classic "fresh renderer
  // talking to old main" debugging pitfall). Without this, adding a new
  // AnimParams field forces a dev-server restart before it works.
  useEffect(() => {
    const unsub = initPetTuning()
    const apply = (t: PetTuning): void => {
      setTuning((prev) => {
        const animParams = { ...prev.animParams } as PetTuning['animParams']
        for (const state of ALL_ANIM_STATES) {
          animParams[state] = { ...prev.animParams[state], ...(t.animParams?.[state] ?? {}) }
        }
        return {
          ...prev,
          walkSpeed: typeof t.walkSpeed === 'number' ? t.walkSpeed : prev.walkSpeed,
          gravity: typeof t.gravity === 'number' ? t.gravity : prev.gravity,
          animOverride: t.animOverride !== undefined ? t.animOverride : prev.animOverride,
          animParams
        }
      })
    }
    window.api.getPetTuning().then(apply)
    const unsub2 = window.api.onPetTuningUpdate(apply)
    return () => {
      unsub()
      unsub2()
    }
  }, [])

  const setAnimParam = (state: PetAnimState, patch: Partial<PetTuning['animParams'][PetAnimState]>): void => {
    setTuning((prev) => ({
      ...prev,
      animParams: {
        ...prev.animParams,
        [state]: { ...prev.animParams[state], ...patch }
      }
    }))
    window.api.setPetTuning({ animParams: { [state]: patch } } as Partial<PetTuning>)
  }

  const setDraftAnchor = (anim: PmdAnimName, patch: Partial<SpriteAnchorEntry>): void => {
    setDraftAnchors((prev) => {
      const current = resolveAnchor(prev, anim)
      return { ...prev, [anim]: { ...current, ...patch } }
    })
  }

  const resetCodeDefaults = (): void => {
    setTuning((prev) => ({ ...prev, animParams: DEFAULT_PET_TUNING.animParams }))
    window.api.setPetTuning({ animParams: DEFAULT_PET_TUNING.animParams })
  }

  const revertDraft = (): void => {
    setDraftAnchors({ ...savedAnchors })
  }

  const updateXml = async (): Promise<void> => {
    // Send the full draft so anims the user touched all land in one write.
    // Main does its own clamp + diff vs disk to avoid no-op writes.
    await window.api.updateSpriteAnchors(speciesId, draftAnchors)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#5d4e37', fontWeight: 600 }}>
          {t.debugAnimSpecies}
        </span>
        <select
          value={speciesId}
          onChange={(e) => setSpeciesId(Number(e.target.value))}
          style={selectStyle}
        >
          {POKEMON_SPECIES.map((s) => (
            <option key={s.id} value={s.id}>
              #{s.id} {localeName(s.nameZh, s.name, lang)}
            </option>
          ))}
        </select>
        <button
          onClick={() => void updateXml()}
          disabled={!draftDirty}
          style={{
            ...btnStyle(draftDirty ? '#27ae60' : '#a8b8a0'),
            cursor: draftDirty ? 'pointer' : 'default'
          }}
          title={t.debugAnimUpdateXmlHint}
        >
          {t.debugAnimUpdateXml}
        </button>
        <button
          onClick={revertDraft}
          disabled={!draftDirty}
          style={{
            ...btnStyle(draftDirty ? '#7f8c8d' : '#c4bcae'),
            cursor: draftDirty ? 'pointer' : 'default'
          }}
          title={t.debugAnimRevertDraftHint}
        >
          {t.debugAnimRevertDraft}
        </button>
        <button
          onClick={() => copyCodeDefaultsToClipboard(tuning.animParams)}
          style={btnStyle('#5d7fb3')}
          title={t.debugAnimCopyCodeDefaultsHint}
        >
          {t.debugAnimCopyCodeDefaults}
        </button>
        <button
          onClick={resetCodeDefaults}
          style={btnStyle('#7f8c8d')}
        >
          {t.debugTuningReset}
        </button>
        <span style={{ fontSize: 11, color: '#7d6b4f', marginLeft: 'auto' }}>
          {t.debugAnimHint}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12
      }}>
        {ANIM_STATES.map((state) => {
          const params = tuning.animParams[state]
          const pmdAnim = SPRITE_KEY_TO_PMD_ANIM[params.spriteKey]
          const draftEntry = resolveAnchor(draftAnchors, pmdAnim)
          const savedEntry = resolveAnchor(savedAnchors, pmdAnim)
          return (
            <AnimPreviewCard
              key={state}
              speciesId={speciesId}
              animState={state}
              params={params}
              draftAnchor={draftEntry}
              savedAnchor={savedEntry}
              pmdAnim={pmdAnim}
              onAnimParamChange={(patch) => setAnimParam(state, patch)}
              onAnchorChange={(patch) => setDraftAnchor(pmdAnim, patch)}
              t={t}
            />
          )
        })}
      </div>
    </div>
  )
}

interface AnimPreviewCardProps {
  speciesId: number
  animState: PetAnimState
  params: PetTuning['animParams'][PetAnimState]
  /** Currently-being-tuned anchor entry (drives in-card preview alignment). */
  draftAnchor: SpriteAnchorEntry
  /** Last-saved-on-disk anchor entry (the value the ↺ buttons revert to). */
  savedAnchor: SpriteAnchorEntry
  /** PMD anim name this card writes to in AnimData.xml. */
  pmdAnim: PmdAnimName
  /** Patch into PetTuning.animParams (code-side: row + spriteKey). */
  onAnimParamChange: (patch: Partial<PetTuning['animParams'][PetAnimState]>) => void
  /** Patch into draft anchors (XML-bound: anchorBottom + native speed). */
  onAnchorChange: (patch: Partial<SpriteAnchorEntry>) => void
  t: Locale
}

function AnimPreviewCard({
  speciesId, animState, params,
  draftAnchor, savedAnchor, pmdAnim,
  onAnimParamChange, onAnchorChange, t
}: AnimPreviewCardProps): JSX.Element {
  const config = useMemo<SpriteSheetConfig | null>(
    () => getSpriteConfig(speciesId, animState, params.row, params.spriteKey),
    [speciesId, animState, params.row, params.spriteKey]
  )
  // Native speed in the preview = current draft (so the user sees their tune
  // play out in real time, matching what the in-game pet will do post-write).
  const { frameIndex } = useAnimationLoop(config, animState, draftAnchor.speed)
  const availableKeys = useMemo(() => getAvailableSpriteKeys(speciesId), [speciesId])

  // Cards have a fixed body so varying sprite sizes line up visually.
  const CARD_BODY = 120
  const showDirection = MULTI_DIRECTION_ANIMS.has(animState)
  const anchorDirty =
    draftAnchor.anchorBottom !== savedAnchor.anchorBottom ||
    draftAnchor.speed !== savedAnchor.speed

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${anchorDirty ? '#e0a060' : '#ddd'}`,
      borderRadius: 6,
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 6
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: '#5d4e37', textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
      }}>
        <span>{animState}</span>
        <span style={{ fontSize: 9, color: '#a08b6a' }}>· {pmdAnim}</span>
        {anchorDirty && (
          <span style={{ fontSize: 9, color: '#c0843a', fontWeight: 700 }}>•</span>
        )}
      </div>
      <div style={{
        position: 'relative',
        width: '100%', height: CARD_BODY,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'repeating-conic-gradient(#f0e6d5 0% 25%, #e8dcc3 0% 50%) 0 0 / 12px 12px',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        {/* Baseline guideline: where the character's feet should land in-game.
            Sit it ~12px above the card bottom so the offset preview is visible. */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 12,
          borderTop: '1px dashed #c0392b', opacity: 0.6, pointerEvents: 'none'
        }} />
        {config ? (
          <div style={{ marginBottom: 12 - draftAnchor.anchorBottom * 2 }}>
            <SpriteCanvas
              spriteConfig={config}
              frameIndex={frameIndex}
              facingLeft={false}
              scale={2}
            />
          </div>
        ) : (
          <span style={{ fontSize: 10, color: '#aaa' }}>—</span>
        )}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#5d4e37' }}>
        <span style={{ flex: 1, fontWeight: 600 }}>{t.debugAnimSource}</span>
        <select
          value={params.spriteKey}
          onChange={(e) => onAnimParamChange({ spriteKey: e.target.value as PetAnimState })}
          style={{ ...selectStyle, fontSize: 10, padding: '2px 4px', flex: 2 }}
          title={SPRITE_KEY_FILENAMES[params.spriteKey]}
        >
          {availableKeys.map((k) => (
            <option key={k} value={k}>
              {k} · {SPRITE_KEY_FILENAMES[k]}
            </option>
          ))}
        </select>
      </label>
      {config && (
        <div style={{ fontSize: 9, color: '#a08b6a', lineHeight: 1.3, textAlign: 'center' }}>
          {config.frameCount}f · [{config.durations.join(',')}]
        </div>
      )}
      <MiniSlider
        label={t.debugTuningAnimAnchorBottom}
        value={draftAnchor.anchorBottom}
        defaultValue={savedAnchor.anchorBottom}
        min={0}
        max={48}
        step={1}
        onChange={(v) => onAnchorChange({ anchorBottom: v })}
      />
      <MiniSlider
        label={t.debugTuningAnimSpeed}
        value={draftAnchor.speed}
        defaultValue={savedAnchor.speed}
        min={0.1}
        max={3.0}
        step={0.1}
        onChange={(v) => onAnchorChange({ speed: v })}
      />
      {showDirection && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#5d4e37' }}>
          <span style={{ flex: 1, fontWeight: 600 }}>{t.debugTuningAnimDirection}</span>
          <select
            value={params.row}
            onChange={(e) => onAnimParamChange({ row: Number(e.target.value) })}
            style={{ ...selectStyle, fontSize: 10, padding: '2px 4px', flex: 2 }}
          >
            {DIRECTION_LABEL_KEYS.map((k, idx) => (
              <option key={idx} value={idx}>{t[k] as string}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}

interface MiniSliderProps {
  label: string
  value: number
  defaultValue: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}

function MiniSlider(p: MiniSliderProps): JSX.Element {
  const clamp = (n: number): number => Math.max(p.min, Math.min(p.max, n))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 10, color: '#5d4e37'
      }}>
        <span style={{ flex: 1, fontWeight: 600 }}>{p.label}</span>
        <input
          type="number"
          min={p.min}
          max={p.max}
          step={p.step}
          value={p.value}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) p.onChange(clamp(v))
          }}
          style={{ ...selectStyle, width: 56, fontSize: 10, padding: '2px 4px' }}
        />
        {p.value !== p.defaultValue && (
          <button
            onClick={() => p.onChange(p.defaultValue)}
            title={`default ${p.defaultValue}`}
            style={{
              border: 'none', background: 'transparent', color: '#a08b6a',
              fontSize: 10, cursor: 'pointer', padding: 0
            }}
          >
            ↺
          </button>
        )}
      </div>
      <input
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.value}
        onChange={(e) => p.onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
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
