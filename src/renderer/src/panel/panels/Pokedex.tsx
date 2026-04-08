import { useState, useEffect, useRef } from 'react'
import { POKEMON_SPECIES, getEvolutionChain, getSpeciesById } from '../../../../shared/pokemon-data'
import { getItemById } from '../../../../shared/item-data'
import type { PokemonSpecies, ExpGroup } from '../../../../shared/types'
import { localeName } from '../../../../shared/i18n'
import type { LangCode, Locale } from '../../../../shared/i18n'
import { useI18n } from '../../shared/i18n'
import { getSpriteConfig } from '../../shared/sprite-config'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PokedexProps {
  unlockedIds: number[]
  onBack: () => void
}

interface EvoNode {
  species: PokemonSpecies
  children: EvoNode[]
}

// ---------------------------------------------------------------------------
// SpritePreview — renders a single idle frame from a sprite sheet
// ---------------------------------------------------------------------------

function SpritePreview({
  speciesId,
  size,
  locked
}: {
  speciesId: number
  size: number
  locked?: boolean
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const config = getSpriteConfig(speciesId, 'idle')

  useEffect(() => {
    if (!config) return
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = config.src
    return () => { img.onload = null }
  }, [config?.src])

  const scale = config
    ? Math.max(1, Math.floor(size / Math.max(config.frameWidth, config.frameHeight)))
    : 1
  const displayWidth = config ? config.frameWidth * scale : size
  const displayHeight = config ? config.frameHeight * scale : size

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image || !config) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, displayWidth, displayHeight)
    ctx.imageSmoothingEnabled = false

    const sx = 0 // frame 0
    const sy = (config.row ?? 0) * config.frameHeight
    ctx.drawImage(
      image,
      sx, sy, config.frameWidth, config.frameHeight,
      0, 0, displayWidth, displayHeight
    )
  }, [image, config, displayWidth, displayHeight])

  if (!config) {
    return (
      <div style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5, color: '#ccc'
      }}>?</div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={displayWidth}
      height={displayHeight}
      style={{
        width: displayWidth,
        height: displayHeight,
        imageRendering: 'pixelated',
        filter: locked ? 'brightness(0)' : 'none'
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Evolution tree builder
// ---------------------------------------------------------------------------

function buildEvolutionTree(speciesId: number): EvoNode | null {
  const chain = getEvolutionChain(speciesId)
  if (chain.length === 0) return null

  const root = chain[0]
  const nodeMap = new Map<number, EvoNode>()
  const rootNode: EvoNode = { species: root, children: [] }
  nodeMap.set(root.id, rootNode)

  for (let i = 1; i < chain.length; i++) {
    const sp = chain[i]
    const node: EvoNode = { species: sp, children: [] }
    nodeMap.set(sp.id, node)
    if (sp.evolvesFrom !== null) {
      const parent = nodeMap.get(sp.evolvesFrom)
      if (parent) parent.children.push(node)
    }
  }

  return rootNode
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function typeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', grass: '#7AC74C',
    electric: '#F7D02C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', fairy: '#D685AD'
  }
  return colors[type] || '#999'
}

function getExpGroupName(group: ExpGroup, t: Locale): string {
  const map: Record<ExpGroup, string> = {
    'fast': t.expGroupFast,
    'medium-fast': t.expGroupMediumFast,
    'medium-slow': t.expGroupMediumSlow,
    'slow': t.expGroupSlow
  }
  return map[group]
}

function evoConditionLabel(sp: PokemonSpecies, lang: LangCode, t: Locale): string {
  if (sp.evolutionLevel) return `${t.lv}${sp.evolutionLevel}`
  if (sp.evolutionItem) {
    const item = getItemById(sp.evolutionItem)
    return item ? localeName(item.nameZh, item.name, lang) : sp.evolutionItem
  }
  return ''
}

// ---------------------------------------------------------------------------
// Main Pokedex component
// ---------------------------------------------------------------------------

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
        <button
          onClick={selectedId ? () => setSelectedId(null) : onBack}
          style={{
            border: 'none',
            background: '#c0392b',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          {selectedId ? t.list : t.back}
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#5d4e37' }}>{t.pokedex}</span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
          {unlockedIds.length}/{POKEMON_SPECIES.length} {t.discovered}
        </span>
      </div>

      {selected ? (
        <DetailView
          species={selected}
          unlockedIds={unlockedIds}
          lang={lang}
          t={t}
          onSelectSpecies={(id) => isUnlocked(id) && setSelectedId(id)}
        />
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

// ---------------------------------------------------------------------------
// GridView
// ---------------------------------------------------------------------------

function GridView({
  unlockedIds,
  onSelect,
  lang
}: {
  unlockedIds: number[]
  onSelect: (id: number) => void
  lang: LangCode
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
              opacity: unlocked ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SpritePreview speciesId={sp.id} size={40} locked={!unlocked} />
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

// ---------------------------------------------------------------------------
// DetailView
// ---------------------------------------------------------------------------

function DetailView({
  species,
  unlockedIds,
  lang,
  t,
  onSelectSpecies
}: {
  species: PokemonSpecies
  unlockedIds: number[]
  lang: LangCode
  t: Locale
  onSelectSpecies: (id: number) => void
}): JSX.Element {
  const tree = buildEvolutionTree(species.id)
  const primaryColor = typeColor(species.types[0])

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left: Sprite + Info */}
      <div style={{
        width: 380,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid #e8ddd0'
      }}>
        {/* Type-colored circle with sprite */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: primaryColor + '25',
          border: `3px solid ${primaryColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12
        }}>
          <SpritePreview speciesId={species.id} size={96} />
        </div>

        {/* Number */}
        <div style={{ fontSize: 13, color: '#999', marginBottom: 2 }}>
          #{String(species.id).padStart(3, '0')}
        </div>

        {/* Primary name */}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#5d4e37', marginBottom: 2 }}>
          {localeName(species.nameZh, species.name, lang)}
        </div>

        {/* Secondary name */}
        <div style={{ fontSize: 13, color: '#999', marginBottom: 10 }}>
          {lang === 'zh' ? species.name : species.nameZh}
        </div>

        {/* Type badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {species.types.map((tp) => (
            <span key={tp} style={{
              padding: '3px 14px',
              background: typeColor(tp),
              color: '#fff',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {tp}
            </span>
          ))}
        </div>

        {/* Info card */}
        <div style={{
          width: '100%',
          background: '#fff',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37', marginBottom: 10 }}>
            {t.individualInfo}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>{t.baseExp}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#5d4e37' }}>{species.baseExp}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>{t.expGroup}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#5d4e37' }}>
                {getExpGroupName(species.expGroup, t)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Evolution chain */}
      <div style={{
        flex: 1,
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        {tree && (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37', marginBottom: 12 }}>
              {t.evolutionChain}
            </div>
            <EvoChainRenderer
              node={tree}
              currentId={species.id}
              unlockedIds={unlockedIds}
              lang={lang}
              t={t}
              onSelect={onSelectSpecies}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Evolution chain renderer
// ---------------------------------------------------------------------------

function EvoChainRenderer({
  node,
  currentId,
  unlockedIds,
  lang,
  t,
  onSelect
}: {
  node: EvoNode
  currentId: number
  unlockedIds: number[]
  lang: LangCode
  t: Locale
  onSelect: (id: number) => void
}): JSX.Element {
  // Render the tree recursively
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {renderNode(node)}
    </div>
  )

  function renderNode(n: EvoNode): JSX.Element {
    const unlocked = unlockedIds.includes(n.species.id)
    const isCurrent = n.species.id === currentId

    return (
      <div key={n.species.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* This node */}
        <div
          onClick={() => unlocked && onSelect(n.species.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            background: isCurrent ? primaryColorBg(n.species) : '#f9f5f0',
            border: isCurrent ? `2px solid ${typeColor(n.species.types[0])}` : '1px solid #e8e0d5',
            borderRadius: 10,
            cursor: unlocked ? 'pointer' : 'default',
            opacity: unlocked ? 1 : 0.5,
            transition: 'all 0.15s'
          }}
        >
          <SpritePreview speciesId={n.species.id} size={48} locked={!unlocked} />
          <div>
            <div style={{ fontSize: 10, color: '#999' }}>#{String(n.species.id).padStart(3, '0')}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5d4e37' }}>
              {unlocked ? localeName(n.species.nameZh, n.species.name, lang) : '???'}
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
              {n.species.types.map((tp) => (
                <span key={tp} style={{
                  padding: '1px 8px',
                  background: typeColor(tp),
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {tp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Children */}
        {n.children.length === 1 && (
          <>
            <EvoArrow label={evoConditionLabel(n.children[0].species, lang, t)} />
            {renderNode(n.children[0])}
          </>
        )}

        {n.children.length > 1 && (
          <>
            {/* Branching: show arrow then branches side by side */}
            <div style={{
              width: 1,
              height: 12,
              background: '#ccc'
            }} />
            <div style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {n.children.map((child) => (
                <div key={child.species.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <EvoArrow label={evoConditionLabel(child.species, lang, t)} />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
}

function primaryColorBg(species: PokemonSpecies): string {
  return typeColor(species.types[0]) + '18'
}

function EvoArrow({ label }: { label: string }): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4px 0'
    }}>
      <div style={{ width: 1, height: 10, background: '#ccc' }} />
      {label && (
        <div style={{
          fontSize: 10,
          color: '#888',
          background: '#f0ebe4',
          padding: '1px 8px',
          borderRadius: 8,
          whiteSpace: 'nowrap'
        }}>
          {label}
        </div>
      )}
      <div style={{ color: '#ccc', fontSize: 12, lineHeight: 1 }}>▼</div>
    </div>
  )
}
