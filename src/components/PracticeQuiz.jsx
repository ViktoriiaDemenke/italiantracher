import { useEffect, useRef, useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import { useI18n } from '../i18n.js'
import './Learn.css'

export const QUIZ_ANCHOR_ID = 'practice-quiz'
const ADVANCE_MS = 600

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
  onCorrect,
  onComplete,
  heading,
  lead,
  autoAdvance = true,
}) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const rootRef = useRef(null)
  const timerRef = useRef(null)

  const total = questions.length
  const question = questions[index] ?? null
  const finished = total === 0 || index >= total

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoScroll || total === 0) return
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [autoScroll, total])

  if (total === 0) return null
  if (finished || !question) return null

  function pick(optionIndex) {
    if (locked) return
    const correct = optionIndex === question.correctIndex
    setSelected(optionIndex)
    if (!correct) {
      onMiss?.(question)
      return
    }
    setLocked(true)
    onCorrect?.(question)
    if (!autoAdvance) return
    timerRef.current = window.setTimeout(() => {
      const next = index + 1
      if (next >= total) {
        onPassedChange?.(true)
        onComplete?.()
        setIndex(next)
        return
      }
      setIndex(next)
      setSelected(null)
      setLocked(false)
    }, ADVANCE_MS)
  }

  return (
    <section
      ref={rootRef}
      id={QUIZ_ANCHOR_ID}
      className="learn-block"
      aria-labelledby="mini-quiz-heading"
    >
      <h2 id="mini-quiz-heading" className="day__section">
        {heading || t('quizTitle')}
      </h2>
      <p className="day__intro">{lead || t('quizLead', { total })}</p>
      <p className="learn-block__counter">
        {index + 1} / {total}
      </p>
      <article className="quiz-card">
        <div className="it-line">
          <p className="phrase-card__it">{question.prompt}</p>
          {question.speak ? <SpeakButton text={question.speak} /> : null}
        </div>
        <div className="quiz-options">
          {question.options.map((option, optionIndex) => {
            const chosen = selected === optionIndex
            const status =
              selected == null
                ? ''
                : optionIndex === question.correctIndex &&
                    (locked || chosen)
                  ? ' quiz-option--correct'
                  : chosen
                    ? ' quiz-option--wrong'
                    : ''
            return (
              <div key={`${question.id}-${optionIndex}`} className={`quiz-option${status}`}>
                <button
                  className="quiz-option__pick"
                  type="button"
                  disabled={locked}
                  onClick={() => pick(optionIndex)}
                >
                  {option}
                </button>
              </div>
            )
          })}
        </div>
        {selected != null && selected !== question.correctIndex ? (
          <p className="quiz-hint">
            {t('correctAnswer', { answer: question.options[question.correctIndex] })}
          </p>
        ) : null}
      </article>
    </section>
  )
}
