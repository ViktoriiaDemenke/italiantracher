import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import ua from './locales/ua.json'
import it from './locales/it.json'
import en from './locales/en.json'
import es from './locales/es.json'
import ro from './locales/ro.json'
import fr from './locales/fr.json'

export const LOCALE_KEY = 'italian_tracker_locale_v1'
export const THEME_KEY = 'italian_tracker_theme_v1'

export const LOCALES = [
  { id: 'ua', label: 'UA' },
  { id: 'it', label: 'IT' },
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
  { id: 'ro', label: 'RO' },
  { id: 'fr', label: 'FR' },
]

const DICTS = { ua, it, en, es, ro, fr }

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => node?.[key], dict)
}

export function interpolate(template, vars = {}) {
  return String(template ?? '').replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] == null ? '' : String(vars[key]),
  )
}

export function detectBrowserLocale() {
  const candidates = [
    ...(typeof navigator !== 'undefined' ? navigator.languages ?? [] : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ]
  for (const raw of candidates) {
    const tag = String(raw || '').toLowerCase()
    if (tag.startsWith('uk') || tag.startsWith('ua')) return 'ua'
    if (tag.startsWith('it')) return 'it'
    if (tag.startsWith('en')) return 'en'
    if (tag.startsWith('es')) return 'es'
    if (tag.startsWith('ro')) return 'ro'
    if (tag.startsWith('fr')) return 'fr'
  }
  return 'ua'
}

export function loadLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_KEY)
    if (stored && DICTS[stored]) return stored
  } catch {
    /* ignore */
  }
  return detectBrowserLocale()
}

export function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'light') root.setAttribute('data-theme', 'light')
  else root.removeAttribute('data-theme')
}

export function bootUiPrefs() {
  applyTheme(loadTheme())
}

export function translate(locale, key, vars) {
  const value = lookup(DICTS[locale] ?? ua, key) ?? lookup(ua, key) ?? key
  return typeof value === 'string' ? interpolate(value, vars) : key
}

const PrefsContext = createContext(null)

export function PrefsProvider({ children }) {
  const [locale, setLocaleState] = useState(loadLocale)
  const [theme, setThemeState] = useState(() => {
    const value = loadTheme()
    applyTheme(value)
    return value
  })

  const setLocale = useCallback((next) => {
    if (!DICTS[next]) return
    setLocaleState(next)
    localStorage.setItem(LOCALE_KEY, next)
  }, [])

  const setTheme = useCallback((next) => {
    const value = next === 'light' ? 'light' : 'dark'
    setThemeState(value)
    localStorage.setItem(THEME_KEY, value)
    applyTheme(value)
  }, [])

  const t = useCallback((key, vars) => translate(locale, key, vars), [locale])

  const value = useMemo(
    () => ({ locale, setLocale, theme, setTheme, t }),
    [locale, setLocale, theme, setTheme, t],
  )

  return createElement(PrefsContext.Provider, { value }, children)
}

export function useI18n() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('useI18n must be used inside PrefsProvider')
  return ctx
}
