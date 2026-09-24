let speakSeq = 0

function pickItalianVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang === 'it-IT') ||
    voices.find((voice) => String(voice.lang).toLowerCase().startsWith('it')) ||
    null
  )
}

export function speakItalian(text, { rate = 1, onStart, onEnd } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.()
    return () => {}
  }
  const value = String(text ?? '').trim()
  if (!value) {
    onEnd?.()
    return () => {}
  }

  window.speechSynthesis.cancel()
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
  utterance.onerror = finish

  window.speechSynthesis.speak(utterance)

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
    if (seq === speakSeq) window.speechSynthesis.cancel()
  }
}
