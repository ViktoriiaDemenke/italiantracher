import { useEffect, useMemo, useRef, useState } from 'react'
import { stopSpeech } from '../lib/speech.js'
import SpeakButton from './SpeakButton.jsx'
import StepNav from './StepNav.jsx'
import { buildVoiceTurns, matchKeywords, PERSONA } from '../learn/voiceBoss.js'
import { cycleIdForDay } from '../content/loadLesson.js'
import { useI18n } from '../i18n.js'
import { capitalizePhrase } from '../content/localize.js'
import './VoiceBossLevel.css'

const MAX_TROPHIES = 3

function Trophies({ lives }) {
  return (
    <p className="voice-boss__trophies" aria-label={`${lives} / ${MAX_TROPHIES}`}>
      {Array.from({ length: MAX_TROPHIES }, (_, index) => (
        <svg
          key={index}
          className={`voice-trophy${index < lives ? ' voice-trophy--on' : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7.2 3.2h9.6v2.1c2.4.4 4.1 1.7 4.1 3.7 0 2.1-1.8 3.5-4.3 4-.8 2.1-2.6 3.5-5 3.8v2.4h3.4v1.6H8.4V19.2h3.4v-2.4c-2.4-.3-4.2-1.7-5-3.8-2.5-.5-4.3-1.9-4.3-4 0-2 1.7-3.3 4.1-3.7V3.2Zm0 3.5c-1.3.3-2.1.9-2.1 1.6s1 1.5 2.4 1.8V6.7Zm9.6 3.4c1.4-.3 2.4-1 2.4-1.8s-.8-1.3-2.1-1.6v3.4ZM8.8 4.8v8.1c.6 1.5 2 2.5 3.2 2.5s2.6-1 3.2-2.5V4.8H8.8Z" />
        </svg>
      ))}
    </p>
  )
}

export default function VoiceBossLevel({ lesson, onClaimDay }) {
  const { t, locale } = useI18n()
  const turns = useMemo(() => buildVoiceTurns(lesson, locale), [lesson, locale])
  const persona = PERSONA[cycleIdForDay(lesson.day)] || PERSONA.anagrafe
  const [index, setIndex] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [won, setWon] = useState(false)
  const [lives, setLives] = useState(MAX_TROPHIES)
  const [typed, setTyped] = useState('')
  const [hint, setHint] = useState('')
  const [spoken, setSpoken] = useState([])
  const [phase, setPhase] = useState(turns.length ? 'ready' : 'empty')
  const busy = useRef(false)
  const turn = turns[index]
  const spokenHere = spoken.find((item) => item.id === turn?.id)
  const reviewing = Boolean(spokenHere)

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  function resetRun() {
    stopSpeech()
    busy.current = false
    setIndex(0)
    setMaxReached(0)
    setWon(false)
    setLives(MAX_TROPHIES)
    setTyped('')
    setHint('')
    setSpoken([])
    setPhase('ready')
  }

  function goStepBack() {
    if (phase === 'victory') {
      setPhase('ready')
      setIndex(Math.max(turns.length - 1, 0))
      setHint('')
      setTyped('')
      return
    }
    if (index <= 0) return
    setIndex((value) => value - 1)
    setHint('')
    setTyped('')
  }

  function goStepForward() {
    if (phase === 'victory') return
    if (won && index >= turns.length - 1) {
      setPhase('victory')
      return
    }
    if (index >= maxReached) return
    setIndex((value) => value + 1)
    setHint('')
    setTyped('')
  }

  function failTurn() {
    if (busy.current) return
    const nextLives = lives - 1
    const words = (turn?.keywords ?? []).slice(0, 3)
    setHint(
      words.length
        ? t('voiceBoss.hint', { words: words.map((word) => `'${word}'`).join(', ') })
        : t('voiceBoss.unrecognized'),
    )
    setLives(nextLives)
    if (nextLives <= 0) {
      setPhase('defeat')
      return
    }
    setPhase('ready')
  }

  function passTurn(finalText) {
    if (busy.current || reviewing) return
    busy.current = true
    stopSpeech()
    const line = capitalizePhrase(finalText || turn.expected)
    setSpoken((prev) =>
      prev.some((item) => item.id === turn.id) ? prev : [...prev, { id: turn.id, it: line }],
    )
    setHint('')
    setTyped('')
    window.setTimeout(() => {
      busy.current = false
      if (index + 1 >= turns.length) {
        setWon(true)
        setMaxReached(turns.length - 1)
        setPhase('victory')
        return
      }
      const next = index + 1
      setMaxReached((value) => Math.max(value, next))
      setIndex(next)
      setPhase('ready')
    }, 180)
  }

  function submitTyped(event) {
    event?.preventDefault()
    const text = String(typed ?? '').trim()
    if (!text) {
      setHint(t('voiceBoss.tryFallback'))
      return
    }
    const result = matchKeywords(text, turn.keywords)
    if (result.ok) passTurn(text)
    else failTurn()
  }

  if (!turn && phase !== 'victory' && phase !== 'defeat') {
    return (
      <section className="voice-boss">
        <p className="day__lead">{t('voiceBoss.empty')}</p>
      </section>
    )
  }

  if (phase === 'defeat') {
    return (
      <section className="voice-boss">
        <Trophies lives={0} />
        <h2 className="voice-boss__title">{t('voiceBoss.defeatTitle')}</h2>
        <p className="day__lead">{t('voiceBoss.defeatLead')}</p>
        <button className="btn-primary" type="button" onClick={resetRun}>
          {t('voiceBoss.retry')}
        </button>
      </section>
    )
  }

  if (phase === 'victory') {
    return (
      <section className="voice-boss voice-boss--win">
        <div className="voice-boss__confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className={`confetti confetti--${i % 6}`} />
          ))}
        </div>
        <StepNav
          index={Math.max(turns.length - 1, 0)}
          total={turns.length}
          canBack={turns.length > 0}
          canForward={false}
          onBack={goStepBack}
          onForward={goStepForward}
        />
        <Trophies lives={lives} />
        <p className="badge">{t('voiceBoss.winBadge')}</p>
        <h2 className="voice-boss__title">{t('voiceBoss.winTitle')}</h2>
        <p className="day__lead">{t('voiceBoss.winLead')}</p>
        <ul className="voice-boss__checklist">
          {spoken.map((item) => (
            <li key={item.id}>
              <span aria-hidden="true">✓</span> {item.it}
            </li>
          ))}
        </ul>
        <button className="btn-primary" type="button" onClick={onClaimDay}>
          {t('markComplete')}
        </button>
      </section>
    )
  }

  return (
    <section className="voice-boss" id="day-step-boss">
      <Trophies lives={lives} />
      <p className="voice-boss__kicker">
        <span>{t('simulation')}</span>
      </p>
      <StepNav
        index={index}
        total={turns.length}
        canBack={index > 0}
        canForward={index < maxReached || (won && index >= turns.length - 1)}
        onBack={goStepBack}
        onForward={goStepForward}
      />
      <p className="voice-boss__speaker">{turn.speaker || persona.speaker}</p>
      <div className="voice-boss__prompt-row">
        <p className="voice-boss__prompt">{turn.promptIt}</p>
        <SpeakButton text={turn.promptIt} />
      </div>
      <p className="voice-boss__task">{turn.task}</p>
      {hint ? <p className="voice-boss__hint">{hint}</p> : null}

      {reviewing ? (
        spokenHere ? (
          <p className="voice-boss__said">
            {t('voiceBoss.usePhrase')}: {spokenHere.it}
          </p>
        ) : null
      ) : (
        <>
          <form className="voice-boss__type" onSubmit={submitTyped}>
            <input
              className="voice-boss__input"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder={t('voiceBoss.typePlaceholder')}
              lang="it"
              autoComplete="off"
            />
            <button className="chip-btn" type="submit">
              {t('voiceBoss.write')}
            </button>
          </form>
          <button
            className="chip-btn chip-btn--on voice-boss__say"
            type="button"
            onClick={() => passTurn(turn.expected)}
          >
            {t('voiceBoss.usePhrase')}: {turn.expected}
          </button>
        </>
      )}
    </section>
  )
}
