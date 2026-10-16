import { useEffect, useState } from 'react'
import { DEFAULT_SPEECH_RATE, isSpeechAvailable, speakItalian, stopSpeech } from '../lib/speech.js'
import { useI18n } from '../i18n.js'

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 9.5v5h3.2L12 18.2V5.8L7.2 9.5H4Z"
        fill="currentColor"
      />
      <path
        d="M15.2 9.2a3.4 3.4 0 0 1 0 5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M17.6 7a6.2 6.2 0 0 1 0 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="6.5" y="5.5" width="3.6" height="13" rx="0.8" fill="currentColor" />
      <rect x="13.9" y="5.5" width="3.6" height="13" rx="0.8" fill="currentColor" />
    </svg>
  )
}

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
      {playing ? <PauseIcon /> : <SpeakerIcon />}
    </button>
  )
}
