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

export function capitalizePhrase(text) {
  const value = String(text ?? '').trim()
  if (!value) return ''
  const prefixMatch = value.match(/^["'«“„¿¡]+/)
  const prefix = prefixMatch ? prefixMatch[0] : ''
  const body = value.slice(prefix.length)
  if (!body) return value
  return prefix + body.charAt(0).toLocaleUpperCase() + body.slice(1)
}

export function displayContentText(value, locale) {
  return capitalizePhrase(resolveContentText(value, locale))
}

export function asTranslationMap(value, fallback = '') {
  if (isLocalizedMap(value)) return value
  if (isLocalizedMap(fallback)) return fallback
  const text = String(value || fallback || '').trim()
  if (!text) return { uk: '', en: '', es: '', fr: '', ro: '' }
  return { uk: text, en: text, es: text, fr: text, ro: text }
}
