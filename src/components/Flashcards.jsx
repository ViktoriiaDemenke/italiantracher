import { useMemo, useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import { shuffleList } from '../learn/practice.js'
import './Learn.css'

export default function Flashcards({ deck }) {
  const [order, setOrder] = useState(() => deck.map((_, index) => index))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const cards = useMemo(
    () => order.map((slot) => deck[slot]).filter(Boolean),
    [deck, order],
  )
  const card = cards[index]
  const total = cards.length

  if (!card || total === 0) return null

  function go(nextIndex) {
    setFlipped(false)
    setIndex((nextIndex + total) % total)
  }

  function shuffle() {
    setFlipped(false)
    setIndex(0)
    setOrder(shuffleList(deck.map((_, itemIndex) => itemIndex)))
  }

  return (
    <section className="learn-block" aria-labelledby="flashcards-heading">
      <div className="learn-block__head">
        <h2 id="flashcards-heading" className="day__section">
          Flashcards Mode
        </h2>
        <p className="learn-block__counter">
          {index + 1} / {total}
        </p>
      </div>
      <button
        className={`flip-card${flipped ? ' flip-card--flipped' : ''}`}
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-label={flipped ? 'Показати італійську' : 'Показати переклад'}
      >
        <span className="flip-card__inner">
          <span className="flip-card__face flip-card__face--front">
            <span className="flip-card__kicker">Italiano</span>
            <span className="flip-card__it">{card.it}</span>
            <span className="flip-card__hint">Натисніть, щоб перевернути</span>
          </span>
          <span className="flip-card__face flip-card__face--back">
            <span className="flip-card__kicker">Переклад</span>
            <span className="flip-card__uk">{card.uk || '—'}</span>
            {card.context ? (
              <span className="flip-card__context">{card.context}</span>
            ) : null}
          </span>
        </span>
      </button>
      <div className="learn-block__tools">
        <SpeakButton text={card.it} />
        <button className="chip-btn" type="button" onClick={() => go(index - 1)}>
          Previous
        </button>
        <button className="chip-btn" type="button" onClick={() => go(index + 1)}>
          Next
        </button>
        <button className="chip-btn" type="button" onClick={shuffle}>
          Shuffle
        </button>
      </div>
    </section>
  )
}
