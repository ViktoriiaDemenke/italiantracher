import { useEffect, useState } from 'react'
import { DEFAULT_SPEECH_RATE, isSpeechAvailable, speakItalian, stopSpeech } from '../lib/speech.js'
import { useI18n } from '../i18n.js'

export default function SpeakButton({ text, rate = DEFAULT_SPEECH_RATE, label }) {
  const { t } = useI18n()
  const speakLabel = label || t('speak')
  const offLabel = t('voiceUnavailable')
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(
    () => typeof window !== 'undefined' && !isSpeechAvailable(),
  )

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  function toggle() {
    if (unavailable || !isSpeechAvailable()) {
      setUnavailable(true)
      return
    }
    if (playing) {
      stopSpeech()
      setPlaying(false)
      return
    }
    setPlaying(true)
    speakItalian(text, {
      rate,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
      onUnavailable: () => {
        setUnavailable(true)
        setPlaying(false)
      },
    })
  }

  return (
    <button
      className={`speak-btn${playing ? ' speak-btn--playing' : ''}${unavailable ? ' speak-btn--off' : ''}`}
      type="button"
      disabled={unavailable}
      aria-label={unavailable ? offLabel : speakLabel}
      title={unavailable ? offLabel : speakLabel}
      aria-pressed={playing}
      onClick={(event) => {
        event.stopPropagation()
        toggle()
      }}
    >
      {unavailable ? '🔇' : playing ? '⏹' : '🔊'}
    </button>
  )
}
