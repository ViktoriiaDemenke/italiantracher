import { useEffect, useState } from 'react'
import { isSpeechAvailable, speakItalian } from '../lib/speech.js'
import { useI18n } from '../i18n.js'

export default function SpeakButton({ text, rate = 1, label }) {
  const { t } = useI18n()
  const speakLabel = label || t('speak')
  const offLabel = t('voiceUnavailable')
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(
    () => typeof window !== 'undefined' && !isSpeechAvailable(),
  )

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function play() {
    if (!isSpeechAvailable()) {
      setUnavailable(true)
      speakItalian(text, { onUnavailable: () => setUnavailable(true) })
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
      aria-label={unavailable ? offLabel : speakLabel}
      title={unavailable ? offLabel : speakLabel}
      aria-pressed={playing}
      onClick={(event) => {
        event.stopPropagation()
        play()
      }}
    >
      {unavailable ? '🔇' : '🔊'}
    </button>
  )
}
