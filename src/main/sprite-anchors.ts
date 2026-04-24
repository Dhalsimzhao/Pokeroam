import { promises as fs } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import {
  ALL_PMD_ANIMS,
  DEFAULT_SPRITE_ANCHORS,
  type PmdAnimName,
  type SpriteAnchorEntry,
  type SpriteAnchorMap,
  type SpriteAnchorStore
} from '../shared/sprite-anchors'
import { POKEMON_SPECIES } from '../shared/pokemon-data'

/**
 * Resolve the on-disk root for sprite resources. In dev, resources/ sits at
 * the repo root (two levels up from out/main/index.js). In packaged builds,
 * electron-builder's `extraResources` puts them under process.resourcesPath.
 *
 * Note: writing back is dev-only — production builds will only ever read.
 */
function spritesRoot(): string {
  if (is.dev) {
    return join(app.getAppPath(), 'resources', 'sprites')
  }
  return join(process.resourcesPath, 'resources', 'sprites')
}

/** Lowercased species.name is the directory name (matches the import paths). */
function speciesDir(speciesId: number): string | null {
  const sp = POKEMON_SPECIES.find((s) => s.id === speciesId)
  return sp ? sp.name.toLowerCase() : null
}

function xmlPathFor(speciesId: number): string | null {
  const dir = speciesDir(speciesId)
  return dir ? join(spritesRoot(), dir, 'AnimData.xml') : null
}

// ---------------------------------------------------------------------------
// Parsing — extract <AnchorBottom>/<PlaybackSpeed> per <Anim> block by name.
// Hand-rolled instead of pulling in xml2js: AnimData.xml has a stable shape
// (one <Anim>...</Anim> block per anim), and we never need to walk the rest
// of the document. Surgical regex keeps writes diff-clean too.
// ---------------------------------------------------------------------------

const ANIM_BLOCK_RE = /<Anim>([\s\S]*?)<\/Anim>/g
const NAME_RE = /<Name>([^<]+)<\/Name>/
const ANCHOR_RE = /<AnchorBottom>\s*([-\d.]+)\s*<\/AnchorBottom>/
const SPEED_RE = /<PlaybackSpeed>\s*([-\d.]+)\s*<\/PlaybackSpeed>/

function parseAnchors(xml: string): SpriteAnchorMap {
  const out: SpriteAnchorMap = {}
  for (const match of xml.matchAll(ANIM_BLOCK_RE)) {
    const block = match[1]
    const name = block.match(NAME_RE)?.[1]?.trim()
    if (!name) continue
    if (!(ALL_PMD_ANIMS as string[]).includes(name)) continue
    const pmdName = name as PmdAnimName
    const anchorMatch = block.match(ANCHOR_RE)
    const speedMatch = block.match(SPEED_RE)
    if (!anchorMatch && !speedMatch) continue
    const entry: Partial<SpriteAnchorEntry> = {}
    if (anchorMatch) entry.anchorBottom = Number(anchorMatch[1])
    if (speedMatch) entry.speed = Number(speedMatch[1])
    // Fill in any missing field with the default so consumers always get a
    // complete entry; treats "XML only specifies one of the two fields" as
    // "the other inherits the default."
    out[pmdName] = {
      anchorBottom: entry.anchorBottom ?? DEFAULT_SPRITE_ANCHORS[pmdName].anchorBottom,
      speed: entry.speed ?? DEFAULT_SPRITE_ANCHORS[pmdName].speed
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Writing — for each anim in the patch:
//   - if the XML already has the field, replace just that line (preserving the
//     surrounding indentation and the XML formatting around it)
//   - otherwise insert <AnchorBottom>/<PlaybackSpeed> right before <Durations>
// We deliberately leave anims not in the patch untouched.
// ---------------------------------------------------------------------------

interface AnimBlockEdit {
  anim: PmdAnimName
  patch: Partial<SpriteAnchorEntry>
}

/**
 * Match a single <Anim>...</Anim> block whose <Name> equals the given anim.
 *
 * Uses a tempered character class `(?:(?!</?Anim>)[\\s\\S])*?` so the lazy
 * quantifier can't cross another <Anim> or </Anim> tag. Without this, the
 * engine happily spans every preceding block up to the target one — which
 * caused upsertField to insert <AnchorBottom> into the wrong block (the
 * first <Durations> it found, which was usually Walk's, not the target's).
 */
function animBlockRegex(anim: PmdAnimName): RegExp {
  const inner = '(?:(?!</?Anim>)[\\s\\S])*?'
  return new RegExp(
    `<Anim>${inner}<Name>${anim}</Name>${inner}</Anim>`,
    'g'
  )
}

function indentationOf(block: string): string {
  const m = block.match(/\n(\s+)<Name>/)
  return m ? m[1] : '\t\t\t'
}

function upsertField(block: string, tag: string, value: number, indent: string): string {
  const replaceRe = new RegExp(`<${tag}>[^<]*</${tag}>`)
  if (replaceRe.test(block)) {
    return block.replace(replaceRe, `<${tag}>${value}</${tag}>`)
  }
  // Insert just before <Durations> (every anim has one) so field ordering stays
  // consistent across blocks. Match the bare tag and reinsert with the same
  // indentation as the surrounding fields — splitting on `(\\s*)<Durations>`
  // would consume the leading whitespace and leave a blank line behind.
  const insertion = `<${tag}>${value}</${tag}>\n${indent}`
  if (/<Durations>/.test(block)) {
    return block.replace(/<Durations>/, `${insertion}<Durations>`)
  }
  return block.replace(/<\/Anim>/, `${insertion}</Anim>`)
}

/**
 * Insert a fresh minimal <Anim> block at the end of <Anims>...</Anims>.
 *
 * PokéRoam only reads <AnchorBottom> and <PlaybackSpeed> from each block, so
 * a stub with just <Name> + those two fields is enough to make the anim
 * tunable. Without this fallback, editing an anchor for a sprite whose block
 * is absent from AnimData.xml silently no-ops the write: the next reparse
 * rehydrates without the tuned value and the dev panel's slider "reverts".
 */
function insertNewAnimBlock(
  xml: string,
  anim: PmdAnimName,
  patch: Partial<SpriteAnchorEntry>
): string {
  const body: string[] = [`\t\t<Anim>`, `\t\t\t<Name>${anim}</Name>`]
  if (patch.anchorBottom !== undefined) {
    body.push(`\t\t\t<AnchorBottom>${patch.anchorBottom}</AnchorBottom>`)
  }
  if (patch.speed !== undefined) {
    body.push(`\t\t\t<PlaybackSpeed>${patch.speed}</PlaybackSpeed>`)
  }
  body.push(`\t\t</Anim>`)
  const block = body.join('\n')
  // Inject right before </Anims>, keeping its leading whitespace intact so
  // the closing tag stays aligned with the original indentation level.
  return xml.replace(/([ \t]*)<\/Anims>/, `${block}\n$1</Anims>`)
}

function writeAnchorsToXml(xml: string, edits: AnimBlockEdit[]): string {
  let out = xml
  for (const { anim, patch } of edits) {
    // Cheap existence check — anim names are single words so this can't
    // collide with other fields. Avoids using RegExp.test()'s /g-flag
    // lastIndex footgun.
    if (!out.includes(`<Name>${anim}</Name>`)) {
      out = insertNewAnimBlock(out, anim, patch)
      continue
    }
    const re = animBlockRegex(anim)
    out = out.replace(re, (block) => {
      const indent = indentationOf(block)
      let next = block
      if (patch.anchorBottom !== undefined) {
        next = upsertField(next, 'AnchorBottom', patch.anchorBottom, indent)
      }
      if (patch.speed !== undefined) {
        next = upsertField(next, 'PlaybackSpeed', patch.speed, indent)
      }
      return next
    })
  }
  return out
}

// ---------------------------------------------------------------------------
// Public API — startup load + lookup + dev-only write.
// ---------------------------------------------------------------------------

const cache: SpriteAnchorStore = {}

/** Load every species' AnimData.xml into the cache. Best-effort: missing or
 * malformed files just leave that species' entry empty (defaults take over). */
export async function initSpriteAnchors(): Promise<void> {
  const tasks = POKEMON_SPECIES.map(async (sp) => {
    const path = xmlPathFor(sp.id)
    if (!path) return
    try {
      const xml = await fs.readFile(path, 'utf8')
      cache[sp.id] = parseAnchors(xml)
    } catch {
      // Sprite folder missing or unreadable; leave cache empty so consumers
      // fall back to DEFAULT_SPRITE_ANCHORS via resolveAnchor().
      cache[sp.id] = {}
    }
  })
  await Promise.all(tasks)
}

export function getSpriteAnchorStore(): SpriteAnchorStore {
  return cache
}

export function getSpriteAnchorsForSpecies(speciesId: number): SpriteAnchorMap {
  return cache[speciesId] ?? {}
}

/**
 * Apply a per-anim patch to a species' AnimData.xml and refresh the cache.
 * Dev-only: the resources/ tree in packaged builds is read-only.
 *
 * Returns the updated SpriteAnchorMap on success, or null if the file isn't
 * found / writable.
 */
export async function updateSpriteAnchors(
  speciesId: number,
  patch: SpriteAnchorMap
): Promise<SpriteAnchorMap | null> {
  if (!is.dev) return null
  const path = xmlPathFor(speciesId)
  if (!path) return null

  let xml: string
  try {
    xml = await fs.readFile(path, 'utf8')
  } catch {
    return null
  }

  const edits: AnimBlockEdit[] = []
  for (const anim of ALL_PMD_ANIMS) {
    const entry = patch[anim]
    if (!entry) continue
    edits.push({ anim, patch: entry })
  }
  if (edits.length === 0) return cache[speciesId] ?? {}

  const updated = writeAnchorsToXml(xml, edits)
  if (updated === xml) {
    // Nothing actually changed (values matched what was already in the file).
    return cache[speciesId] ?? {}
  }
  await fs.writeFile(path, updated, 'utf8')

  cache[speciesId] = parseAnchors(updated)
  return cache[speciesId]
}
