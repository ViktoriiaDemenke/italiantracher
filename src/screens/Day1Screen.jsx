import { useState } from 'react'
import { DAY1, getDay1Phrases } from '../data/day1'
import PhraseCard from '../components/PhraseCard.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import '../screens/HomeScreen.css'
import './Day1Screen.css'

function mergeDayPhrases(savedPhrases) {
  const others = savedPhrases.filter((item) => item.day !== DAY1.day)
  const incoming = getDay1Phrases().map((phrase) => ({
    id: phrase.id,
    it: phrase.it,
    uk: phrase.uk,
    day: DAY1.day,
  }))
  return [...others, ...incoming]
}

export default function Day1Screen({ state, onBack, onStateChange }) {
  const [culturaOpen, setCulturaOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const savedPhrases = state.savedPhrases ?? []

  function saveDayPhrases() {
    const nextPhrases = mergeDayPhrases(savedPhrases)
    onStateChange({ ...state, savedPhrases: nextPhrases })
    setSheetOpen(true)
  }

  return (
    <main className="day">
      <header className="day__top">
        <button className="back-btn" type="button" onClick={onBack}>
          ← Назад
        </button>
      </header>

      <section className="day__hero">
        <span className="badge">День 1 · Immersion</span>
        <h1 className="day__title">{DAY1.title}</h1>
        <p className="day__lead">{DAY1.lead}</p>
      </section>

      <section className="cultura">
        <button
          className="cultura__toggle"
          type="button"
          aria-expanded={culturaOpen}
          onClick={() => setCulturaOpen((open) => !open)}
        >
          {DAY1.cultura.title}
          <span>{culturaOpen ? '−' : '+'}</span>
        </button>
        {culturaOpen ? <p className="cultura__body">{DAY1.cultura.body}</p> : null}
      </section>

      <section className="day__phrases">
        {DAY1.sections.map((section) => (
          <div key={section.id} className="day__block">
            <h2 className="day__section">{section.title}</h2>
            {section.intro ? <p className="day__intro">{section.intro}</p> : null}
            <div className="day__phrase-list">
              {section.phrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <button className="fab" type="button" onClick={saveDayPhrases}>
        📌 Зберегти фрази дня
      </button>

      <SavedPhrasesSheet
        open={sheetOpen}
        phrases={mergeDayPhrases(savedPhrases)}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  )
}
