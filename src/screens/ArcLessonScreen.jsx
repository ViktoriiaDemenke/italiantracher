import { useState } from 'react'
import CycleNav from '../components/CycleNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import { cycleIdForDay, maxScore } from '../content/loadLesson.js'
import '../screens/HomeScreen.css'
import './Lesson.css'
import './Day1Screen.css'

function mergeDayPhrases(savedPhrases, lesson) {
  const others = savedPhrases.filter((item) => item.day !== lesson.day)
  const incoming = lesson.phrases.map((phrase) => ({
    id: phrase.audio_id,
    it: phrase.italian,
    uk: phrase.ukrainian,
    day: lesson.day,
  }))
  return [...others, ...incoming]
}

function toneClass(tone, selected) {
  if (!selected) return ''
  if (tone === 'natural') return 'option-card--correct'
  if (tone === 'bookish') return 'option-card--bookish'
  return 'option-card--wrong'
}

function DialogueStep({ step, boss, picked, onPick }) {
  const [slow, setSlow] = useState(false)
  const rate = slow ? 0.75 : 1

  function speak(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'it-IT'
    utterance.rate = rate
    window.speechSynthesis.speak(utterance)
  }

  return (
    <article className="dialogue-card">
      <p className="dialogue-line__who">{step.speaker}</p>
      <p className="phrase-card__it">{step.text}</p>
      <div className="phrase-card__actions">
        <button className="chip-btn" type="button" onClick={() => speak(step.text)}>
          ▶ Слухати
        </button>
        <button
          className={`chip-btn ${slow ? 'chip-btn--on' : ''}`}
          type="button"
          onClick={() => setSlow((value) => !value)}
        >
          {slow ? '0.75x 🐢' : '1.0x'}
        </button>
      </div>
      <div className="dialogue-options">
        {step.options.map((option) => (
          <article
            key={option.text}
            className={`option-card ${toneClass(option.tone, picked?.text === option.text)}`}
          >
            <p className="option-card__text">{option.text}</p>
            <button
              className="btn-primary"
              type="button"
              disabled={Boolean(picked)}
              onClick={() => onPick(option)}
            >
              Обрати
            </button>
          </article>
        ))}
      </div>
      {!boss && picked?.feedback ? (
        <p
          className={`dialogue-feedback ${
            picked.tone === 'natural'
              ? 'dialogue-feedback--correct'
              : picked.tone === 'bookish'
                ? 'dialogue-feedback--bookish'
                : 'dialogue-feedback--wrong'
          }`}
        >
          {picked.feedback}
        </p>
      ) : null}
    </article>
  )
}

export default function ArcLessonScreen({
  lesson,
  state,
  onBack,
  onStateChange,
  onOpenDay,
  onContinue,
  continueLabel,
}) {
  const boss = lesson.mode === 'boss'
  const hideTranslation = boss
  const quiz = lesson.questions
  const hasQuiz = quiz.length > 0
  const cycle = cycleIdForDay(lesson.day)
  const [culturaOpen, setCulturaOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const savedPhrases = state?.savedPhrases ?? []
  const step = lesson.dialogue[stepIndex]
  const question = quiz[stepIndex]
  const trackLength = hasQuiz ? quiz.length : lesson.dialogue.length
  const last = trackLength === 0 ? true : stepIndex >= trackLength - 1
  const total = maxScore(lesson)

  function pick(option) {
    setPicked(option)
    const nextScore = score + (option.points ?? 0)
    setScore(nextScore)
    if (boss && !hasQuiz) {
      if (last) {
        setFinished(true)
        return
      }
      setStepIndex((index) => index + 1)
      setPicked(null)
    }
  }

  function pickQuiz(index) {
    const current = quiz[stepIndex]
    const correct = index === current.correctAnswer
    setScore((value) => value + (correct ? 10 : 0))
    if (last) {
      setFinished(true)
      return
    }
    setStepIndex((value) => value + 1)
    setPicked(null)
  }

  function nextStep() {
    if (last) {
      setFinished(true)
      return
    }
    setStepIndex((index) => index + 1)
    setPicked(null)
  }

  function saveDayPhrases() {
    if (!onStateChange || !state || lesson.phrases.length === 0) return
    onStateChange({
      ...state,
      savedPhrases: mergeDayPhrases(savedPhrases, lesson),
    })
    setSheetOpen(true)
  }

  if (finished && boss) {
    return (
      <main className="day">
        <header className="day__top">
          <button className="back-btn" type="button" onClick={onBack}>
            ← Назад
          </button>
        </header>
        <section className="result-card">
          <span className="badge">
            {lesson.successBadge || 'Boss Level 🏆'}
          </span>
          <h1 className="day__title">
            {lesson.successTitle || lesson.successMessage}
          </h1>
          {lesson.successTitle && lesson.successMessage ? (
            <p className="day__lead">{lesson.successMessage}</p>
          ) : null}
          <p className="result-score">Real Life Score</p>
          <p className="result-score__value">
            {score} / {total}
          </p>
        </section>
        {onContinue ? (
          <button className="btn-primary" type="button" onClick={onContinue}>
            {continueLabel ?? 'На головну'}
          </button>
        ) : null}
      </main>
    )
  }

  return (
    <main className="day">
      <header className="day__top">
        <button className="back-btn" type="button" onClick={onBack}>
          ← Назад
        </button>
      </header>

      <section className="day__hero">
        <span className="badge">
          {lesson.type || (boss ? `День ${lesson.day} · Boss Level 🏆` : `День ${lesson.day}`)}
        </span>
        {lesson.module ? <p className="day__lead">{lesson.module}</p> : null}
        <h1 className="day__title">{lesson.title}</h1>
        {onOpenDay ? (
          <CycleNav
            cycle={cycle}
            currentDay={lesson.day}
            onOpenDay={onOpenDay}
          />
        ) : null}
      </section>

      {lesson.story ? (
        <article className="phrase-card">
          <p className={boss ? 'phrase-card__it' : 'day__lead'}>{lesson.story}</p>
        </article>
      ) : null}

      {lesson.documents.length > 0 ? (
        <>
          <h2 className="day__section">Документи з собою</h2>
          <ul className="doc-list">
            {lesson.documents.map((doc) => (
              <li key={doc.item} className="phrase-card doc-card">
                <p className="phrase-card__it">{doc.item}</p>
                {!hideTranslation && doc.ukrainian ? (
                  <p className="phrase-card__uk">{doc.ukrainian}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.restaurantEtiquette?.length > 0 ? (
        <>
          <h2 className="day__section">Етикет</h2>
          <ul className="doc-list">
            {lesson.restaurantEtiquette.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.housingNuances?.length > 0 ? (
        <>
          <h2 className="day__section">Нюанси житла</h2>
          <ul className="doc-list">
            {lesson.housingNuances.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.phrases.length > 0 ? (
        <>
          <h2 className="day__section">Фрази</h2>
          <div className="day__phrase-list">
            {lesson.phrases.map((phrase) => (
              <PhraseCard
                key={phrase.audio_id}
                hideTranslation={hideTranslation}
                phrase={{ it: phrase.italian, uk: phrase.ukrainian }}
              />
            ))}
          </div>
        </>
      ) : null}

      {lesson.grammar ? (
        <>
          <h2 className="day__section">{lesson.grammar.title}</h2>
          <div className="day__phrase-list">
            {lesson.grammar.rules.map((item) => (
              <article key={item.rule} className="phrase-card">
                <p className="phrase-card__it">{item.rule}</p>
                {item.examples?.map((example) => (
                  <p key={example} className="phrase-card__uk">
                    {example}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </>
      ) : null}

      {!boss && lesson.culturaTip ? (
        <section className="cultura">
          <button
            className="cultura__toggle"
            type="button"
            aria-expanded={culturaOpen}
            onClick={() => setCulturaOpen((open) => !open)}
          >
            💡 Cultura & Tip
            <span>{culturaOpen ? '−' : '+'}</span>
          </button>
          {culturaOpen ? <p className="cultura__body">{lesson.culturaTip}</p> : null}
        </section>
      ) : null}

      {hasQuiz && question && !finished ? (
        <>
          <h2 className="day__section">
            Симуляція · {stepIndex + 1}/{quiz.length}
          </h2>
          <article className="dialogue-card">
            <p className="phrase-card__it">{question.question}</p>
            <div className="dialogue-options">
              {question.options.map((option, index) => (
                <article key={option} className="option-card">
                  <p className="option-card__text">{option}</p>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => pickQuiz(index)}
                  >
                    Обрати
                  </button>
                </article>
              ))}
            </div>
          </article>
        </>
      ) : null}

      {!hasQuiz && step ? (
        <>
          <h2 className="day__section">
            {boss ? 'Симуляція' : 'Діалог'} · {step.step}/{lesson.dialogue.length}
          </h2>
          <DialogueStep step={step} boss={boss} picked={picked} onPick={pick} />
          {picked && !boss ? (
            <button
              className="btn-primary"
              type="button"
              onClick={last ? onContinue : nextStep}
            >
              {last ? continueLabel ?? 'Далі' : 'Далі'}
            </button>
          ) : null}
        </>
      ) : null}

      {!hasQuiz && lesson.dialogue.length === 0 && onContinue ? (
        <button className="btn-primary" type="button" onClick={onContinue}>
          {continueLabel ?? 'Далі'}
        </button>
      ) : null}

      {!boss && onStateChange && lesson.phrases.length > 0 ? (
        <button className="fab" type="button" onClick={saveDayPhrases}>
          📌 Зберегти фрази дня
        </button>
      ) : null}

      <SavedPhrasesSheet
        open={sheetOpen}
        phrases={savedPhrases}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  )
}
