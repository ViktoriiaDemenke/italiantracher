import { useMemo, useState } from 'react'
import SpeakButton from '../components/SpeakButton.jsx'
import { dueReviewItems } from '../storage.js'
import '../screens/HomeScreen.css'
import './Lesson.css'
import '../components/Learn.css'

export default function ReviewScreen({ state, onGrade, onBack }) {
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
          ← Назад
        </button>
      </header>
      <section className="day__hero">
        <span className="badge">SRS</span>
        <h1 className="day__title">Повторення складних фраз</h1>
        <p className="day__lead">
          Тут з’являються фрази, у яких були помилки в квізі. Повторюйте, доки
          картка не відкладеться на пізніше.
        </p>
      </section>

      {due.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Поки немає карток на сьогодні</p>
          <p className="empty-state__text">
            Помилки з міні-квізу автоматично потраплять сюди. Можна також
            зберігати фрази дня.
          </p>
        </div>
      ) : (
        <>
          <p className="lesson-progress__label">
            Картка {Math.min(index + 1, due.length)} з {due.length}
          </p>
          <button
            className={`flip-card${flipped ? ' flip-card--flipped' : ''}`}
            type="button"
            onClick={() => setFlipped((value) => !value)}
          >
            <span className="flip-card__inner">
              <span className="flip-card__face flip-card__face--front">
                <span className="flip-card__kicker">Italiano</span>
                <span className="flip-card__it">{card.it}</span>
              </span>
              <span className="flip-card__face flip-card__face--back">
                <span className="flip-card__kicker">Переклад</span>
                <span className="flip-card__uk">{card.uk || '—'}</span>
                {card.day ? (
                  <span className="flip-card__context">День {card.day}</span>
                ) : null}
              </span>
            </span>
          </button>
          <div className="learn-block__tools">
            <SpeakButton text={card.it} />
            <button className="chip-btn" type="button" onClick={() => grade(false)}>
              Ще раз
            </button>
            <button className="chip-btn chip-btn--on" type="button" onClick={() => grade(true)}>
              Знаю
            </button>
          </div>
        </>
      )}
    </main>
  )
}
