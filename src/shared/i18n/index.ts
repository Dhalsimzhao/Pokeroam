import { zh } from './locales/zh'
import { en } from './locales/en'
import type { LangCode, Locale } from './types'

export type { LangCode, Locale }

const locales: Record<LangCode, Locale> = { zh, en }

export function getLocale(lang: LangCode): Locale {
  return locales[lang]
}

/** Get the display name for a pokemon/item based on locale. */
export function localeName(nameZh: string, name: string, lang: LangCode): string {
  return lang === 'zh' ? nameZh : name
}

/** Get the display description for an item based on locale. */
export function localeDescription(
  descriptionZh: string,
  description: string,
  lang: LangCode
): string {
  return lang === 'zh' ? descriptionZh : description
}
