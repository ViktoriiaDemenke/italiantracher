export const CONTENT_LANGS = ['uk', 'en', 'es', 'fr', 'ro']

export function contentLangFromLocale(locale) {
  const id = String(locale ?? '').toLowerCase()
  if (id === 'ua' || id === 'uk') return 'uk'
  if (id === 'en' || id === 'es' || id === 'fr' || id === 'ro') return id
  return 'en'
}

export function isLocalizedMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return CONTENT_LANGS.some((lang) => typeof value[lang] === 'string') || typeof value.ua === 'string'
}

function emptyTranslationMap() {
  return { uk: '', en: '', es: '', fr: '', ro: '' }
}

function normalizeLangMap(map) {
  const next = emptyTranslationMap()
  if (!map || typeof map !== 'object') return next
  next.uk = String(map.uk || map.ua || '')
  next.en = String(map.en || '')
  next.es = String(map.es || '')
  next.fr = String(map.fr || '')
  next.ro = String(map.ro || '')
  return next
}

function pickFromMap(map, locale) {
  if (!map || typeof map !== 'object') return ''
  const lang = contentLangFromLocale(locale)
  const normalized = normalizeLangMap(map)
  const direct = String(normalized[lang] || '').trim()
  if (direct) return direct
  if (lang === 'uk') return String(normalized.uk || '').trim()
  return String(normalized.en || '').trim()
}

function nestedTranslationMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  if (isLocalizedMap(value.translations)) return value.translations
  if (isLocalizedMap(value.translation)) return value.translation
  if (isLocalizedMap(value.ukrainian)) return value.ukrainian
  if (isLocalizedMap(value)) return value
  return null
}

export function resolveContentText(value, locale) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  const map = nestedTranslationMap(value)
  if (!map) return ''
  return pickFromMap(map, locale)
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
  const nested = nestedTranslationMap(value)
  if (nested) return normalizeLangMap(nested)
  const fallbackMap = nestedTranslationMap(fallback)
  if (fallbackMap) return normalizeLangMap(fallbackMap)
  const text = String(
    (typeof value === 'string' || typeof value === 'number' ? value : '') ||
      (typeof fallback === 'string' || typeof fallback === 'number' ? fallback : '') ||
      '',
  ).trim()
  if (!text) return emptyTranslationMap()
  if (/[\u0400-\u04FF]/.test(text)) {
    return { ...emptyTranslationMap(), uk: text }
  }
  return { ...emptyTranslationMap(), en: text }
}

export function isItalianPrompt(value) {
  if (typeof value !== 'string') return false
  const text = value.trim()
  if (!text) return false
  return !/[\u0400-\u04FF]/.test(text)
}

export function resolveQuizOption(option, locale) {
  if (option == null) return ''
  if (typeof option === 'string' || typeof option === 'number') return String(option)
  if (typeof option.text === 'string' && isItalianPrompt(option.text) && !nestedTranslationMap(option)) {
    return option.text
  }
  return resolveContentText(option, locale) || String(option.text || '')
}
