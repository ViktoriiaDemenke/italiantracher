import { useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import { DEFAULT_SPEECH_RATE, FAST_SPEECH_RATE } from '../lib/speech.js'
import { useI18n } from '../i18n.js'
import { resolveContentText } from '../content/localize.js'

export default function PhraseCard({ phrase, onChoose, hideTranslation = false }) {
  const { t, locale } = useI18n()
  const [slow, setSlow] = useState(true)
  const [showUk, setShowUk] = useState(false)
  const rate = slow ? DEFAULT_SPEECH_RATE : FAST_SPEECH_RATE
  const translated = resolveContentText(phrase.translation ?? phrase.uk, locale)

  return (
    <article className={`phrase-card${onChoose ? ' phrase-card--choice' : ''}`}>
      {phrase.hint ? (
        <p className="phrase-card__hint">{resolveContentText(phrase.hint, locale)}</p>
      ) : null}
      <div className="it-line">
        <p className="phrase-card__it">{phrase.it}</p>
        <SpeakButton text={phrase.it} rate={rate} />
      </div>
      {!hideTranslation && showUk && translated ? (
        <p className="phrase-card__uk">{translated}</p>
      ) : null}

      {onChoose ? (
        <button className="btn-primary" type="button" onClick={onChoose}>
          {t('choose')}
        </button>
      ) : null}

      <div className="phrase-card__actions">
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
            {showUk ? t('hideTranslation') : t('translation')}
          </button>
        )}
      </div>
    </article>
  )
}
