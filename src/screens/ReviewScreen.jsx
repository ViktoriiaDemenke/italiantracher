import { useMemo, useState } from 'react'
import SpeakButton from '../components/SpeakButton.jsx'
import { dueReviewItems } from '../storage.js'
import { useI18n } from '../i18n.js'
import { resolveContentText } from '../content/localize.js'
import '../screens/HomeScreen.css'
import './Lesson.css'
import '../components/Learn.css'

export default function ReviewScreen({ state, onGrade, onBack }) {
  const { t, locale } = useI18n()
  const due = useMemo(() => dueReviewItems(state), [state])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = due[index] ?? null

  function grade(knew) {
    if (!card) return
    onGrade(card.id, knew)
    setFlipped(false)
    setIndex(0)
  }

  return (
    <main className="day">
      <header className="day__top">
        <button className="back-btn" type="button" onClick={onBack}>
          {t('back')}
        </button>
      </header>
      <section className="day__hero">
        <span className="badge">SRS</span>
        <h1 className="day__title">{t('reviewTitle')}</h1>
        <p className="day__lead">{t('reviewLead')}</p>
      </section>

      {due.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">{t('reviewEmptyTitle')}</p>
          <p className="empty-state__text">{t('reviewEmptyText')}</p>
        </div>
      ) : (
        <>
          <p className="lesson-progress__label">
            {t('cardOf', { index: Math.min(index + 1, due.length), total: due.length })}
          </p>
          <button
            className={`flip-card${flipped ? ' flip-card--flipped' : ''}`}
            type="button"
            onClick={() => setFlipped((value) => !value)}
          >
            <span className="flip-card__inner">
              <span className="flip-card__face flip-card__face--front">
                <span className="flip-card__kicker">{t('italiano')}</span>
                <span className="flip-card__it">{card.it}</span>
              </span>
              <span className="flip-card__face flip-card__face--back">
                <span className="flip-card__kicker">{t('translation')}</span>
                <span className="flip-card__uk">
                  {resolveContentText(card.translation ?? card.uk, locale) || '—'}
                </span>
                {card.day ? (
                  <span className="flip-card__context">{t('dayN', { day: card.day })}</span>
                ) : null}
              </span>
            </span>
          </button>
          <div className="learn-block__tools">
            <SpeakButton text={card.it} />
            <button className="chip-btn" type="button" onClick={() => grade(false)}>
              {t('again')}
            </button>
            <button className="chip-btn chip-btn--on" type="button" onClick={() => grade(true)}>
              {t('know')}
            </button>
          </div>
        </>
      )}
    </main>
  )
}
