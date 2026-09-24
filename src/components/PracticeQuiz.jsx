import { useEffect, useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import './Learn.css'

function looksItalian(text) {
  return /[A-Za-zÀ-ÿ]/.test(text) && !/[А-Яа-яЇїІіЄєҐґ]/.test(text)
}

export default function PracticeQuiz({ questions, onPassedChange }) {
  const [answers, setAnswers] = useState({})

  const total = questions.length
  const passed =
    total === 0 ||
    questions.every((question) => answers[question.id]?.correct)

  useEffect(() => {
    onPassedChange?.(passed)
  }, [passed, onPassedChange])

  if (total === 0) return null

  function pick(question, optionIndex) {
    const correct = optionIndex === question.correctIndex
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { optionIndex, correct },
    }))
  }

  return (
    <section className="learn-block" aria-labelledby="mini-quiz-heading">
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
                Правильна відповідь: {question.options[question.correctIndex]}
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
