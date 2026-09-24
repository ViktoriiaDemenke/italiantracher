import { useEffect, useState } from 'react'
import { speakItalian } from '../lib/speech.js'

export default function SpeakButton({ text, rate = 1, label = 'Озвучити' }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function play() {
    setPlaying(true)
    speakItalian(text, {
      rate,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
    })
  }

  return (
    <button
      className={`speak-btn${playing ? ' speak-btn--playing' : ''}`}
      type="button"
      aria-label={label}
      aria-pressed={playing}
      onClick={(event) => {
        event.stopPropagation()
        play()
      }}
    >
      🔊
    </button>
  )
}
