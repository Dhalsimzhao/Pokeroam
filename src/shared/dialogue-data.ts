import type { DialogueData, DialogueEntry, DialogueEventType } from './types'
import defaultData from '../../resources/dialogues/dialogue-data.json'

const FALLBACK: DialogueEntry = { emotion: 'Normal', text: '' }

export function getDialogue(
  speciesName: string,
  eventType: DialogueEventType,
  data?: DialogueData
): DialogueEntry {
  const source = data ?? (defaultData as DialogueData)

  // Species-specific override takes priority
  const speciesEntries = source.species[speciesName]?.[eventType]
  if (speciesEntries && speciesEntries.length > 0) {
    return speciesEntries[Math.floor(Math.random() * speciesEntries.length)]
  }

  // Fall back to default
  const defaultEntries = source.default[eventType]
  if (defaultEntries && defaultEntries.length > 0) {
    return defaultEntries[Math.floor(Math.random() * defaultEntries.length)]
  }

  // Empty array or missing event type
  return FALLBACK
}

export function resolveDialogueText(
  text: string,
  vars: Record<string, string>
): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match)
}
