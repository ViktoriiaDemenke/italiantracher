export const DEFAULT_SPEECH_RATE = 0.75
export const FAST_SPEECH_RATE = 1

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function notifyVoiceUnavailable() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('italian-tracker:toast'))
}

let speakSeq = 0

function pickItalianVoice() {
  if (!isSpeechAvailable()) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang === 'it-IT') ||
    voices.find((voice) => String(voice.lang).toLowerCase().startsWith('it')) ||
    null
  )
}

export function stopSpeech() {
  speakSeq += 1
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export function speakItalian(text, { rate = DEFAULT_SPEECH_RATE, onStart, onEnd, onUnavailable } = {}) {
  const fail = () => {
    onUnavailable?.()
    notifyVoiceUnavailable()
    onEnd?.()
  }

  if (!isSpeechAvailable()) {
    fail()
    return () => {}
  }

  const value = String(text ?? '').trim()
  if (!value) {
    onEnd?.()
    return () => {}
  }

  stopSpeech()
  const seq = ++speakSeq
  const utterance = new SpeechSynthesisUtterance(value)
  utterance.lang = 'it-IT'
  utterance.rate = rate
  const voice = pickItalianVoice()
  if (voice) utterance.voice = voice

  const finish = () => {
    if (seq !== speakSeq) return
    onEnd?.()
  }

  utterance.onstart = () => {
    if (seq !== speakSeq) return
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
    window.speechSynthesis.speak(utterance)
  } catch {
    fail()
    return () => {}
  }

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => {
        const nextVoice = pickItalianVoice()
        if (nextVoice) utterance.voice = nextVoice
      },
      { once: true },
    )
  }

  return () => {
    if (seq === speakSeq) stopSpeech()
  }
}
