import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getLocale, type LangCode, type Locale } from '../../../shared/i18n'

const STORAGE_KEY = 'pokeroam-lang'

function loadLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch { /* ignore */ }
  return 'zh'
}

interface I18nContextValue {
  lang: LangCode
  t: Locale
  setLang: (lang: LangCode) => void
}

const I18nContext = createContext<I18nContextValue>(null!)

export function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLangState] = useState<LangCode>(loadLang)

  const applyLang = useCallback((newLang: LangCode) => {
    setLangState(newLang)
    try { localStorage.setItem(STORAGE_KEY, newLang) } catch { /* ignore */ }
  }, [])

  // Called by UI — also notifies main process
  const setLang = useCallback((newLang: LangCode) => {
    applyLang(newLang)
    window.api.setLocale(newLang)
  }, [applyLang])

  // Listen for locale changes pushed from main process (e.g. tray switch)
  useEffect(() => {
    const unsub = window.api.onLocaleChanged((data) => {
      const newLang = data as string
      if (newLang === 'zh' || newLang === 'en') {
        applyLang(newLang)
      }
    })
    return unsub
  }, [applyLang])

  const t = getLocale(lang)

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}
