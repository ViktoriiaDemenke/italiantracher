import { useEffect, useState } from 'react'
import { isSpeechAvailable, speakItalian } from '../lib/speech.js'

export default function SpeakButton({ text, rate = 1, label = 'Озвучити' }) {
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
      aria-label={unavailable ? 'Голос недоступний' : label}
      title={unavailable ? 'Голос недоступний' : label}
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
