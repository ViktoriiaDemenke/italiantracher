import { useState } from 'react'
import CycleNav from '../components/CycleNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import '../screens/HomeScreen.css'
import './Lesson.css'

function mergeDayPhrases(savedPhrases, day, phrases) {
  const others = savedPhrases.filter((item) => item.day !== day)
  const incoming = phrases.map((phrase) => ({
    id: phrase.id,
    it: phrase.it,
    uk: phrase.uk,
    day,
  }))
  return [...others, ...incoming]
}

export default function DialogueScreen({
  lesson,
  phrases,
  state,
  onBack,
  onStateChange,
  onContinue,
  continueLabel,
  onOpenDay,
}) {
  const [culturaOpen, setCulturaOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [nodeId, setNodeId] = useState(lesson.startId)
  const [history, setHistory] = useState([])
  const savedPhrases = state.savedPhrases ?? []
  const node = lesson.nodes[nodeId] ?? lesson.nodes[lesson.startId]
  const isEnd = !node?.choices || node.choices.length === 0

  function choose(choice) {
    setHistory((lines) => [
      ...lines,
      { role: 'npc', phrase: node.npc },
      { role: 'you', phrase: choice.phrase },
    ])
    setNodeId(choice.next)
  }

  function saveDayPhrases() {
    onStateChange({
      ...state,
      savedPhrases: mergeDayPhrases(savedPhrases, lesson.day, phrases),
    })
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
        <span className="badge">{lesson.badge}</span>
        <h1 className="day__title">{lesson.title}</h1>
        <p className="day__lead">{lesson.lead}</p>
        <CycleNav currentDay={lesson.day} onOpenDay={onOpenDay} />
      </section>

      <section className="cultura">
        <button
          className="cultura__toggle"
          type="button"
          aria-expanded={culturaOpen}
          onClick={() => setCulturaOpen((open) => !open)}
        >
          {lesson.cultura.title}
          <span>{culturaOpen ? '−' : '+'}</span>
        </button>
        {culturaOpen ? <p className="cultura__body">{lesson.cultura.body}</p> : null}
      </section>

      <section className="day__block">
        <h2 className="day__section">Діалог</h2>
        <div className="day__phrase-list">
          {history.map((line, index) => (
            <div key={`${line.phrase.id}-${index}`} className="dialogue-line">
              <p className="dialogue-line__who">
                {line.role === 'npc' ? 'Sportello' : 'Ви'}
              </p>
              <PhraseCard phrase={line.phrase} />
            </div>
          ))}
          <div className="dialogue-line">
            <p className="dialogue-line__who">Sportello</p>
            <PhraseCard phrase={node.npc} />
          </div>
        </div>
      </section>

      {!isEnd ? (
        <section className="day__block">
          <h2 className="day__section">Ваша репліка</h2>
          <p className="day__intro">Натисніть «Обрати» під фразою — діалог піде далі, не лишається на трьох рядках.</p>
          <div className="day__phrase-list">
            {node.choices.map((choice) => (
              <PhraseCard
                key={choice.phrase.id}
                phrase={choice.phrase}
                onChoose={() => choose(choice)}
              />
            ))}
          </div>
        </section>
      ) : (
        <button className="btn-primary" type="button" onClick={onContinue}>
          {continueLabel}
        </button>
      )}

      <button className="fab" type="button" onClick={saveDayPhrases}>
        📌 Зберегти фрази дня
      </button>

      <SavedPhrasesSheet
        open={sheetOpen}
        phrases={mergeDayPhrases(savedPhrases, lesson.day, phrases)}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  )
}
