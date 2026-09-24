import { useState } from 'react'

function speakItalian(text, rate) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'it-IT'
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

export default function PhraseCard({ phrase, onChoose, hideTranslation = false }) {
  const [slow, setSlow] = useState(false)
  const [showUk, setShowUk] = useState(false)
  const rate = slow ? 0.75 : 1

  return (
    <article className={`phrase-card${onChoose ? ' phrase-card--choice' : ''}`}>
      {phrase.hint ? <p className="phrase-card__hint">{phrase.hint}</p> : null}
      <p className="phrase-card__it">{phrase.it}</p>
      {!hideTranslation && showUk ? (
        <p className="phrase-card__uk">{phrase.uk}</p>
      ) : null}

      {onChoose ? (
        <button className="btn-primary" type="button" onClick={onChoose}>
          Обрати
        </button>
      ) : null}

      <div className="phrase-card__actions">
        <button
          className="chip-btn"
          type="button"
          onClick={() => speakItalian(phrase.it, rate)}
        >
          ▶ Слухати
        </button>
        <button
          className={`chip-btn ${slow ? 'chip-btn--on' : ''}`}
          type="button"
          onClick={() => setSlow((value) => !value)}
        >
          {slow ? '0.75x 🐢' : '1.0x'}
        </button>
        {hideTranslation ? null : (
          <button
            className={`chip-btn ${showUk ? 'chip-btn--on' : ''}`}
            type="button"
            onClick={() => setShowUk((value) => !value)}
          >
            {showUk ? 'Сховати UA' : 'Переклад'}
          </button>
        )}
      </div>
    </article>
  )
}
