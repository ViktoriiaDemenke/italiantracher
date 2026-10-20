import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_SPEECH_RATE,
  getSpeechSupport,
  speakItalian,
  stopSpeech,
  warmSpeechVoices,
  warnSpeechUnsupported,
} from '../lib/speech.js'
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
  const hint = t('speechChromeSafari')
  const [playing, setPlaying] = useState(false)
  const [support, setSupport] = useState(() =>
    typeof window === 'undefined'
      ? { supported: false, showHint: false, hasApi: false }
      : getSpeechSupport(),
  )
  const mine = useRef(false)

  useEffect(() => {
    warmSpeechVoices()
    const refresh = () => setSupport(getSpeechSupport())
    refresh()
    const api = window.speechSynthesis
    api?.addEventListener?.('voiceschanged', refresh)
    const timer = window.setTimeout(refresh, 400)
    return () => {
      api?.removeEventListener?.('voiceschanged', refresh)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (support.showHint || !support.supported) warnSpeechUnsupported()
  }, [support.showHint, support.supported])

  function toggle() {
    if (!support.supported) {
      warnSpeechUnsupported()
      setSupport(getSpeechSupport())
      return
    }
    warmSpeechVoices()
    if (playing) {
      mine.current = false
      stopSpeech()
      setPlaying(false)
      return
    }
    mine.current = true
    setPlaying(true)
    speakItalian(text, {
      rate,
      onStart: () => {
        if (mine.current) setPlaying(true)
      },
      onEnd: () => {
        mine.current = false
        setPlaying(false)
      },
      onUnavailable: () => {
        mine.current = false
        setPlaying(false)
        warnSpeechUnsupported()
        setSupport(getSpeechSupport())
      },
    })
  }

  const showHint = support.showHint || !support.supported

  return (
    <span className={`speak-wrap${showHint ? ' speak-wrap--hint' : ''}`}>
      <button
        className={`speak-btn${playing ? ' speak-btn--playing' : ''}${showHint ? ' speak-btn--limited' : ''}`}
        type="button"
        aria-label={showHint ? `${offLabel}. ${hint}` : speakLabel}
        title={showHint ? hint : speakLabel}
        aria-pressed={playing}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggle()
        }}
      >
        {playing ? <PauseIcon /> : <SpeakerIcon />}
      </button>
      {showHint ? <span className="speak-hint">{hint}</span> : null}
    </span>
  )
}
