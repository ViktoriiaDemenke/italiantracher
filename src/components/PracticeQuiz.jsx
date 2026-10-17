import { useEffect, useRef, useState } from 'react'
import SpeakButton from './SpeakButton.jsx'
import { useI18n } from '../i18n.js'
import { capitalizePhrase } from '../content/localize.js'
import { removeMistake, upsertMistake } from '../learn/mistakes.js'
import './Learn.css'

export const QUIZ_ANCHOR_ID = 'practice-quiz'
const ADVANCE_MS = 700

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
  retryMissed = false,
}) {
  const { t } = useI18n()
  const [queue, setQueue] = useState(() => questions ?? [])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const [loop, setLoop] = useState(0)
  const missedRef = useRef([])
  const rootRef = useRef(null)
  const timerRef = useRef(null)

  const total = queue.length
  const question = queue[index] ?? null
  const finished = total === 0 || index >= total
  const questionIds = (questions ?? []).map((item) => item.id).join('|')

  useEffect(() => {
    setQueue(questions ?? [])
    setIndex(0)
    setSelected(null)
    setLocked(false)
    setLoop(0)
    missedRef.current = []
  }, [questionIds])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoScroll || total === 0) return
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [autoScroll, total, loop, index])

  function finishRound(nextMissed) {
    if (retryMissed && nextMissed.length > 0) {
      setQueue(nextMissed)
      missedRef.current = []
      setIndex(0)
      setSelected(null)
      setLocked(false)
      setLoop((value) => value + 1)
      return
    }
    onPassedChange?.(nextMissed.length === 0)
    onComplete?.(nextMissed)
  }

  function goNext(nextMissed) {
    const next = index + 1
    if (next < queue.length) {
      setIndex(next)
      setSelected(null)
      setLocked(false)
      return
    }
    finishRound(nextMissed)
  }

  function pick(optionIndex) {
    if (locked || !question) return
    const correct = optionIndex === question.correctIndex
    setSelected(optionIndex)
    setLocked(true)
    if (!correct) {
      onMiss?.(question)
      const nextMissed = upsertMistake(missedRef.current, question)
      missedRef.current = nextMissed
      timerRef.current = window.setTimeout(() => goNext(nextMissed), ADVANCE_MS)
      return
    }
    onCorrect?.(question)
    const nextMissed = removeMistake(missedRef.current, question.id)
    missedRef.current = nextMissed
    timerRef.current = window.setTimeout(() => goNext(nextMissed), ADVANCE_MS)
  }

  if (total === 0) return null
  if (finished || !question) return null

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
          <p className="phrase-card__it">{capitalizePhrase(question.prompt)}</p>
          {question.speak ? <SpeakButton text={question.speak} /> : null}
        </div>
        <div className="quiz-options">
          {question.options.map((option, optionIndex) => {
            const chosen = selected === optionIndex
            const status =
              selected == null
                ? ''
                : optionIndex === question.correctIndex
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
                  {capitalizePhrase(option)}
                </button>
              </div>
            )
          })}
        </div>
        {selected != null && selected !== question.correctIndex ? (
          <p className="quiz-hint">
            {t('correctAnswer', {
              answer: capitalizePhrase(question.options[question.correctIndex]),
            })}
          </p>
        ) : null}
      </article>
    </section>
  )
}
