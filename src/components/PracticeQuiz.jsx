import { useEffect, useRef, useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import './Learn.css'

function looksItalian(text) {
  return /[A-Za-zÀ-ÿ]/.test(text) && !/[А-Яа-яЇїІіЄєҐґ]/.test(text)
}

export const QUIZ_ANCHOR_ID = 'practice-quiz'

export function scrollToPracticeQuiz() {
  document.getElementById(QUIZ_ANCHOR_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export default function PracticeQuiz({
  questions,
  onPassedChange,
  autoScroll = false,
  onMiss,
}) {
  const [answers, setAnswers] = useState({})
  const rootRef = useRef(null)

  const total = questions.length
  const passed =
    total === 0 ||
    questions.every((question) => answers[question.id]?.correct)

  useEffect(() => {
    onPassedChange?.(passed)
  }, [passed, onPassedChange])

  useEffect(() => {
    if (!autoScroll || total === 0) return
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [autoScroll, total])

  if (total === 0) return null

  function pick(question, optionIndex) {
    const correct = optionIndex === question.correctIndex
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { optionIndex, correct },
    }))
    if (!correct) onMiss?.(question)
  }

  return (
    <section
      ref={rootRef}
      id={QUIZ_ANCHOR_ID}
      className="learn-block"
      aria-labelledby="mini-quiz-heading"
    >
      <h2 id="mini-quiz-heading" className="day__section">
        End-of-Day Practice Quiz
      </h2>
      <p className="day__intro">
        Дайте відповідь на {total} короткі питання, щоб відкрити позначку дня.
      </p>
      {questions.map((question, qIndex) => {
        const answer = answers[question.id]
        return (
          <article key={question.id} className="quiz-card">
            <div className="it-line">
              <p className="phrase-card__it">
                {qIndex + 1}. {question.prompt}
              </p>
              {question.speak ? <SpeakButton text={question.speak} /> : null}
            </div>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => {
                const selected = answer?.optionIndex === optionIndex
                const status = !answer
                  ? ''
                  : optionIndex === question.correctIndex
                    ? ' quiz-option--correct'
                    : selected
                      ? ' quiz-option--wrong'
                      : ''
                return (
                  <div key={option} className={`quiz-option${status}`}>
                    <button
                      className="quiz-option__pick"
                      type="button"
                      onClick={() => pick(question, optionIndex)}
                    >
                      {option}
                    </button>
                    {looksItalian(option) ? <SpeakButton text={option} /> : null}
                  </div>
                )
              })}
            </div>
            {answer && !answer.correct ? (
              <p className="quiz-hint">
                {question.explain
                  ? `${question.explain} Правильна відповідь: ${question.options[question.correctIndex]}`
                  : `Правильна відповідь: ${question.options[question.correctIndex]}`}
              </p>
            ) : null}
          </article>
        )
      })}
      {passed ? (
        <p className="quiz-pass">Усі відповіді правильні. Можна позначити день.</p>
      ) : null}
    </section>
  )
}
