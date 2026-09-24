import { useState } from 'react'
import { CANONICAL_MODULES } from '../data/modules'
import CycleNav, { MODULE_CYCLES } from '../components/CycleNav.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import ProgressOverview from '../components/ProgressOverview.jsx'
import DayGrid from '../components/DayGrid.jsx'
import './HomeScreen.css'

export default function HomeScreen({ state, onStart, onOpenDay, isUnlocked }) {
  const [phrasesOpen, setPhrasesOpen] = useState(false)
  const savedPhrases = state.savedPhrases ?? []

  return (
    <main className="home">
      <header className="home__hero">
        <span className="badge">30-Day Challenge</span>
        <h1 className="home__title">Italian Tracker</h1>
        <p className="home__lead">
          30 днів практичної італійської для реального життя в Італії. Опановуй
          побутові теми, тренуй діалоги та збирай власну колекцію корисних фраз.
        </p>
        <ProgressOverview
          completedDays={state.completedDays}
          streak={state.streak}
        />
        <button className="btn-primary" type="button" onClick={onStart}>
          Почати
        </button>
      </header>

      <DayGrid
        completedDays={state.completedDays}
        currentDay={state.currentDay}
        onOpenDay={onOpenDay}
      />

      <section className="home__modules" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="home__section-title">
          Модулі
        </h2>
        <ul className="module-list">
          {CANONICAL_MODULES.map((mod, index) => (
            <li key={mod.id} className="card">
              <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="card__title">{mod.title}</h3>
                <p className="card__subtitle">{mod.subtitle}</p>
                {MODULE_CYCLES[mod.id] ? (
                  <CycleNav
                    cycle={mod.id}
                    currentDay={state.currentDay}
                    onOpenDay={onOpenDay}
                    isUnlocked={isUnlocked}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <button
        className="fab"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={phrasesOpen}
        onClick={() => setPhrasesOpen(true)}
      >
        📌 Збережені фрази
      </button>

      <SavedPhrasesSheet
        open={phrasesOpen}
        phrases={savedPhrases}
        onClose={() => setPhrasesOpen(false)}
      />
    </main>
  )
}
