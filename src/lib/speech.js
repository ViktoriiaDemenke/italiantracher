export const DEFAULT_SPEECH_RATE = 0.75
export const FAST_SPEECH_RATE = 1

const TTS_WARN = 'Web Speech API is not supported in this browser environment'

let warnedUnsupported = false

function userAgent() {
  return typeof navigator !== 'undefined' ? navigator.userAgent : ''
}

function isRestrictedSpeechHost() {
  const ua = userAgent()
  if (/OPR\/|Opera\//i.test(ua)) return true
  if (/Cursor/i.test(ua)) return true
  const electron = /Electron/i.test(ua)
  const native = Boolean(typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.())
  return Boolean(electron && !native)
}

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && Boolean(window.speechSynthesis)
}

export function getSpeechSupport() {
  const hasApi = isSpeechAvailable()
  const restricted = isRestrictedSpeechHost()
  const voices = hasApi ? cacheVoices() : []
  const italian = Boolean(pickItalianVoice())
  const supported = hasApi && !restricted
  return {
    hasApi,
    restricted,
    voiceCount: voices.length,
    italian,
    supported,
    showHint: !supported || voices.length === 0,
  }
}

export function warnSpeechUnsupported() {
  if (warnedUnsupported) return
  warnedUnsupported = true
  console.warn(TTS_WARN)
}

export function notifyVoiceUnavailable() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('italian-tracker:toast'))
}

let speakSeq = 0
let currentUtterance = null
let cachedVoices = []

function synth() {
  return typeof window !== 'undefined' ? window.speechSynthesis : null
}

function cacheVoices() {
  const api = synth()
  if (!api) return []
  const list = api.getVoices()
  if (list.length) cachedVoices = list
  return cachedVoices
}

export function warmSpeechVoices() {
  const api = synth()
  if (!api) return
  cacheVoices()
  const onVoices = () => {
    cacheVoices()
  }
  api.onvoiceschanged = onVoices
  if (typeof api.addEventListener === 'function') {
    api.addEventListener('voiceschanged', onVoices)
  }
}

if (typeof window !== 'undefined') {
  warmSpeechVoices()
}

function pickItalianVoice() {
  const voices = cacheVoices()
  return (
    voices.find((voice) => voice.lang === 'it-IT') ||
    voices.find((voice) => String(voice.lang).toLowerCase().startsWith('it')) ||
    voices.find((voice) => /italian|italiano/i.test(`${voice.name} ${voice.lang}`)) ||
    null
  )
}

export function stopSpeech() {
  speakSeq += 1
  currentUtterance = null
  const api = synth()
  if (!api) return
  try {
    api.cancel()
  } catch {
    /* ignore */
  }
}

export function speakItalian(text, { rate = DEFAULT_SPEECH_RATE, onStart, onEnd, onUnavailable } = {}) {
  const fail = () => {
    onUnavailable?.()
    notifyVoiceUnavailable()
    onEnd?.()
  }

  const support = getSpeechSupport()
  if (!support.supported) {
    warnSpeechUnsupported()
    fail()
    return () => {}
  }
  if (!support.hasApi) {
    warnSpeechUnsupported()
    fail()
    return () => {}
  }
  if (support.voiceCount === 0 && !pickItalianVoice()) {
    console.warn(TTS_WARN, { reason: 'empty voice list' })
  }

  const value = String(text ?? '').trim()
  if (!value) {
    onEnd?.()
    return () => {}
  }

  const api = synth()
  const mySeq = ++speakSeq
  currentUtterance = null
  cacheVoices()

  try {
    api.cancel()
  } catch {
    /* ignore */
  }

  const utterance = new SpeechSynthesisUtterance(value)
  currentUtterance = utterance
  utterance.lang = 'it-IT'
  utterance.rate = rate
  const voice = pickItalianVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang || 'it-IT'
  }

  const finish = () => {
    if (mySeq !== speakSeq) return
    currentUtterance = null
    onEnd?.()
  }

  utterance.onstart = () => {
    if (mySeq !== speakSeq) return
    onStart?.()
  }
  utterance.onend = finish
  utterance.onerror = (event) => {
    const reason = event?.error
    if (reason === 'interrupted' || reason === 'canceled') {
      finish()
      return
    }
    fail()
  }

  try {
    api.speak(utterance)
    if (api.paused) api.resume()
  } catch {
    fail()
    return () => {}
  }

  return () => {
    if (mySeq === speakSeq) stopSpeech()
  }
}
