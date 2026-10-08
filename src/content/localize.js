export const CONTENT_LANGS = ['uk', 'en', 'es', 'fr', 'ro']

export function contentLangFromLocale(locale) {
  const id = String(locale ?? '').toLowerCase()
  if (id === 'ua' || id === 'uk') return 'uk'
  if (id === 'en' || id === 'es' || id === 'fr' || id === 'ro') return id
  return 'uk'
}

export function isLocalizedMap(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function resolveContentText(value, locale) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (!isLocalizedMap(value)) return ''
  const lang = contentLangFromLocale(locale)
  return String(
    value[lang] || value.uk || value.ua || value.en || value.es || value.fr || value.ro || '',
  )
}

export function asTranslationMap(value, fallback = '') {
  if (isLocalizedMap(value)) return value
  if (isLocalizedMap(fallback)) return fallback
  const text = String(value || fallback || '').trim()
  if (!text) return { uk: '', en: '', es: '', fr: '', ro: '' }
  return { uk: text, en: text, es: text, fr: text, ro: text }
}
