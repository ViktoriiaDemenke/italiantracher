import { useEffect, useMemo, useRef, useState } from 'react'
import DayStepsNav from '../components/DayStepsNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import SpeakButton from '../components/SpeakButton.jsx'
import Flashcards from '../components/Flashcards.jsx'
import PracticeQuiz from '../components/PracticeQuiz.jsx'
import VoiceBossLevel from '../components/VoiceBossLevel.jsx'
import StepNav from '../components/StepNav.jsx'
import { maxScore } from '../content/loadLesson.js'
import { buildMiniQuiz, buildPracticeDeck } from '../learn/practice.js'
import {
  buildDayStages,
  buildDaySteps,
  currentDayStepIndex,
} from '../learn/daySteps.js'
import { isDayCompleted, TOTAL_DAYS } from '../progress.js'
import { DEFAULT_SPEECH_RATE, FAST_SPEECH_RATE } from '../lib/speech.js'
import { rememberQuizError, rememberSavedPhrases } from '../storage.js'
import {
  fromBossQuestion,
  fromDialogueStep,
  isWrongChoice,
  removeMistake,
  upsertMistake,
} from '../learn/mistakes.js'
import { useI18n } from '../i18n.js'
import {
  capitalizePhrase,
  displayContentText,
  isItalianPrompt,
  resolveContentText,
  resolveQuizOption,
} from '../content/localize.js'
import '../screens/HomeScreen.css'
import './Lesson.css'
import './Day1Screen.css'
import '../components/Learn.css'

function scrollDialogueIntoView(id) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      const node = document.getElementById(id)
      if (!node) return
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  })
}

function tipKey(item) {
  if (typeof item === 'string') return item
  return item?.uk || item?.en || JSON.stringify(item)
}

function TipList({ items, heading, locale }) {
  if (!items?.length) return null
  return (
    <>
      <h2 className="day__section">{heading}</h2>
      <ul className="doc-list">
        {items.map((item) => (
          <li key={tipKey(item)} className="phrase-card doc-card">
            <p className="phrase-card__it">{displayContentText(item, locale)}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function mergeDayPhrases(savedPhrases, lesson) {
  const others = savedPhrases.filter((item) => item.day !== lesson.day)
  const incoming = lesson.phrases.map((phrase) => ({
    id: phrase.audio_id,
    it: phrase.italian,
    translations: phrase.translations ?? phrase.translation ?? phrase.ukrainian,
    translation: phrase.translations ?? phrase.translation ?? phrase.ukrainian,
    uk: phrase.translations ?? phrase.translation ?? phrase.ukrainian,
    day: lesson.day,
  }))
  return [...others, ...incoming]
}

function LessonProgress({ day }) {
  const { t } = useI18n()
  const dayPercent = Math.round((day / TOTAL_DAYS) * 100)

  return (
    <section className="lesson-progress" aria-label={t('lessonProgress')}>
      <p className="lesson-progress__label">{t('dayOf', { day, total: TOTAL_DAYS })}</p>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={dayPercent}
      >
        <span className="progress-bar__fill" style={{ width: `${dayPercent}%` }} />
      </div>
    </section>
  )
}

function LessonHeader({ day, onBack, typeBadge }) {
  const { t } = useI18n()

  return (
    <header
      className="day__top"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: 'auto',
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      <button className="back-btn" type="button" onClick={onBack}>
        {t('back')}
      </button>
      {day != null ? <LessonProgress day={day} /> : null}
      {typeBadge ? (
        <div
          className="day__type-badge-wrap"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            paddingTop: 16,
            paddingBottom: 12,
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <span className="badge" style={{ display: 'inline-block', position: 'relative' }}>
            {typeBadge}
          </span>
        </div>
      ) : null}
    </header>
  )
}

function toneClass(tone, selected) {
  if (!selected) return ''
  if (tone === 'natural') return 'option-card--correct'
  if (tone === 'bookish') return 'option-card--bookish'
  return 'option-card--wrong'
}

function DialogueStep({ step, boss, picked, onPick }) {
  const { t, locale } = useI18n()
  const [slow, setSlow] = useState(true)
  const [showUk, setShowUk] = useState(false)
  const rate = slow ? DEFAULT_SPEECH_RATE : FAST_SPEECH_RATE
  const choices = Array.isArray(step?.options) ? step.options : []
  const lineUk = displayContentText(
    step?.translations ?? step?.translation ?? step?.ukrainian,
    locale,
  )

  function chooseOption(option) {
    onPick?.(option)
  }

  return (
    <article className="dialogue-card">
      <p className="dialogue-line__who">{step?.speaker}</p>
      <div className="it-line">
        <p className="phrase-card__it">{capitalizePhrase(step?.text)}</p>
        {step?.text ? <SpeakButton text={step.text} rate={rate} /> : null}
      </div>
      {!boss && showUk && lineUk ? <p className="phrase-card__uk">{lineUk}</p> : null}
      <div className="phrase-card__actions">
        <button
          className={`chip-btn ${slow ? 'chip-btn--on' : ''}`}
          type="button"
          onClick={() => setSlow((value) => !value)}
        >
          {slow ? '0.75x 🐢' : '1.0x'}
        </button>
        {boss ? null : (
          <button
            className={`chip-btn ${showUk ? 'chip-btn--on' : ''}`}
            type="button"
            onClick={() => setShowUk((value) => !value)}
          >
            {showUk ? t('hideTranslation') : t('translation')}
          </button>
        )}
      </div>
      <div className="dialogue-options">
        {choices.map((option, optionIndex) => (
          <article
            key={`${option.text}-${optionIndex}`}
            className={`option-card ${toneClass(option.tone, picked?.text === option.text)}`}
          >
            <div className="it-line">
              <p className="option-card__text">{capitalizePhrase(option.text)}</p>
              <SpeakButton text={option.text} rate={rate} />
            </div>
            {!boss &&
            showUk &&
            displayContentText(
              option.translations || option.translation || option.ukrainian,
              locale,
            ) ? (
              <p className="phrase-card__uk">
                {displayContentText(
                  option.translations || option.translation || option.ukrainian,
                  locale,
                )}
              </p>
            ) : null}
            <button
              className="btn-primary"
              type="button"
              onClick={() => chooseOption(option)}
            >
              {t('choose')}
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
          {displayContentText(picked.feedback, locale)}
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
  onMarkComplete,
  isUnlocked,
  onQuizError,
  onStartNextDay,
}) {
  const { t, locale } = useI18n()
  const boss = lesson.mode === 'boss'
  const hideTranslation = boss
  const quiz = lesson.questions
  const hasQuiz = quiz.length > 0
  const daySteps = useMemo(() => buildDaySteps(lesson), [lesson])
  const dayStages = useMemo(() => buildDayStages(daySteps), [daySteps])
  const [culturaOpen, setCulturaOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [dialogueAnswers, setDialogueAnswers] = useState({})
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [dayDone, setDayDone] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const [activeKind, setActiveKind] = useState(dayStages[0]?.kind ?? 'text')
  const [mistakesList, setMistakesList] = useState([])
  const [mistakesPhase, setMistakesPhase] = useState('idle')
  const [claimReady, setClaimReady] = useState(false)
  const mistakesRef = useRef([])
  const advanceTimer = useRef(null)
  const skipDialogueScroll = useRef(true)
  const persistReady = useRef(false)
  const deck = useMemo(
    () => buildPracticeDeck(lesson, locale).filter((card) => card.day === lesson.day),
    [lesson, locale],
  )
  const miniQuestions = useMemo(
    () => buildMiniQuiz(deck, lesson.day),
    [deck, lesson.day],
  )
  const dialogueSteps = Array.isArray(lesson.dialogue) ? lesson.dialogue : []
  const safeIndex = Math.min(Math.max(stepIndex, 0), Math.max(dialogueSteps.length - 1, 0))
  const step = dialogueSteps[safeIndex]
  const question = quiz[stepIndex]
  const trackLength = hasQuiz ? quiz.length : dialogueSteps.length
  const total = maxScore(lesson)
  const nextDay = lesson.day < TOTAL_DAYS ? lesson.day + 1 : null
  const flowIndex = currentDayStepIndex({
    steps: daySteps,
    stepIndex,
    trackLength,
    finished,
    engaged: Boolean(picked) || stepIndex > 0,
  })
  const flowKind = daySteps[flowIndex]?.kind ?? activeKind

  useEffect(() => {
    const session = state?.lessonSessions?.[String(lesson.day)]
    const completed = isDayCompleted(lesson.day, state?.completedDays)
    setCulturaOpen(false)
    setJustFinished(false)
    window.scrollTo(0, 0)
    if (completed) {
      setStepIndex(0)
      setMaxReached(0)
      setDialogueAnswers({})
      setPicked(null)
      setScore(session?.score ?? 0)
      setFinished(false)
      setDayDone(false)
      setMistakesList([])
      setMistakesPhase('idle')
      setClaimReady(false)
      mistakesRef.current = []
    } else if (session) {
      const restoredIndex = session.stepIndex ?? 0
      setStepIndex(restoredIndex)
      setMaxReached(session.maxReached ?? restoredIndex)
      setDialogueAnswers(session.dialogueAnswers ?? {})
      setPicked(session.picked ?? null)
      setScore(session.score ?? 0)
      setFinished(Boolean(session.finished))
      setDayDone(Boolean(session.dayDone))
      setMistakesList(Array.isArray(session.mistakesList) ? session.mistakesList : [])
      setMistakesPhase(session.mistakesPhase || (session.reviewingMistakes ? 'summary' : 'idle'))
      setClaimReady(Boolean(session.claimReady))
      mistakesRef.current = Array.isArray(session.mistakesList)
        ? session.mistakesList
        : []
      if (session.activeKind) setActiveKind(session.activeKind)
    } else {
      setStepIndex(0)
      setMaxReached(0)
      setDialogueAnswers({})
      setPicked(null)
      setScore(0)
      setFinished(false)
      setDayDone(false)
      setMistakesList([])
      setMistakesPhase('idle')
      setClaimReady(false)
      mistakesRef.current = []
      setActiveKind(buildDayStages(buildDaySteps(lesson))[0]?.kind ?? 'text')
    }
    skipDialogueScroll.current = true
    persistReady.current = false
    const readyId = window.requestAnimationFrame(() => {
      persistReady.current = true
    })
    return () => {
      window.cancelAnimationFrame(readyId)
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    }
  }, [lesson.day])

  useEffect(() => {
    if (!persistReady.current) return
    if (isDayCompleted(lesson.day, state?.completedDays) && !justFinished) return
    onStateChange?.((prev) => ({
      ...prev,
      lessonSessions: {
        ...(prev.lessonSessions ?? {}),
        [String(lesson.day)]: {
          stepIndex,
          maxReached,
          dialogueAnswers,
          picked,
          finished,
          score,
          dayDone,
          mistakesPhase,
          claimReady,
          reviewingMistakes: mistakesPhase === 'summary' || mistakesPhase === 'retry',
          mistakesList,
          activeKind,
        },
      },
    }))
  }, [
    activeKind,
    dayDone,
    dialogueAnswers,
    finished,
    justFinished,
    lesson.day,
    mistakesList,
    mistakesPhase,
    claimReady,
    maxReached,
    onStateChange,
    picked,
    score,
    stepIndex,
  ])

  useEffect(() => {
    if (skipDialogueScroll.current) {
      skipDialogueScroll.current = false
      return
    }
    if (finished) return
    scrollDialogueIntoView(hasQuiz || boss ? 'day-step-boss' : 'day-step-dialogue')
  }, [stepIndex, finished, hasQuiz, boss])

  useEffect(() => {
    if (hasQuiz) return
    if (dialogueSteps.length === 0) return
    if (stepIndex >= dialogueSteps.length) {
      setFinished(true)
      setPicked(null)
      return
    }
    if (stepIndex < maxReached || finished) return
    const current = dialogueSteps[stepIndex]
    const choices = Array.isArray(current?.options) ? current.options : []
    if (!current || choices.length === 0) {
      if (stepIndex + 1 >= dialogueSteps.length) {
        setFinished(true)
        setPicked(null)
        return
      }
      setStepIndex((index) => index + 1)
      setMaxReached((value) => Math.max(value, stepIndex + 1))
      setPicked(null)
    }
  }, [hasQuiz, dialogueSteps, stepIndex, maxReached, finished])

  useEffect(() => {
    if (!finished || dayDone || claimReady) return
    if (mistakesPhase === 'summary' || mistakesPhase === 'retry' || mistakesPhase === 'cleared') {
      return
    }
    if (!hasQuiz && miniQuestions.length > 0) return
    if (mistakesRef.current.length > 0) {
      setMistakesPhase('summary')
      setClaimReady(false)
      return
    }
    setMistakesPhase('cleared')
    setClaimReady(true)
  }, [
    finished,
    miniQuestions.length,
    dayDone,
    mistakesPhase,
    claimReady,
    mistakesList,
    hasQuiz,
  ])

  function rememberSessionMistake(item) {
    if (!item) return
    setMistakesList((prev) => {
      const next = upsertMistake(prev, item)
      mistakesRef.current = next
      return next
    })
  }

  function forgetSessionMistake(id) {
    setMistakesList((prev) => {
      const next = removeMistake(prev, id)
      mistakesRef.current = next
      return next
    })
  }

  function completeDayNow() {
    if (
      !boss &&
      (mistakesRef.current.length > 0 ||
        mistakesPhase === 'summary' ||
        mistakesPhase === 'retry')
    ) {
      setMistakesPhase('summary')
      setClaimReady(false)
      return
    }
    onMarkComplete?.()
    setMistakesPhase('idle')
    setClaimReady(false)
    setJustFinished(true)
    setDayDone(true)
  }

  function openMistakesSummary() {
    if (mistakesRef.current.length === 0) {
      setMistakesPhase('cleared')
      setClaimReady(true)
      return
    }
    setClaimReady(false)
    setMistakesPhase('summary')
  }

  function finishMistakesReview() {
    mistakesRef.current = []
    setMistakesList([])
    setMistakesPhase('cleared')
    setClaimReady(true)
  }

  function answerAt(index) {
    return dialogueAnswers[String(index)] ?? null
  }

  function goDialogueBack() {
    if (stepIndex <= 0) return
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    const prev = stepIndex - 1
    setStepIndex(prev)
    setPicked(answerAt(prev))
  }

  function goDialogueForward() {
    if (stepIndex >= maxReached) return
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    const next = stepIndex + 1
    setStepIndex(next)
    setPicked(answerAt(next))
  }

  function advanceDialogue() {
    setStepIndex((index) => {
      const next = index + 1
      if (next >= dialogueSteps.length) {
        setFinished(true)
        setMaxReached((value) => Math.max(value, index))
        setPicked(answerAt(index))
        return index
      }
      setMaxReached((value) => Math.max(value, next))
      setPicked(answerAt(next))
      return next
    })
  }

  function pick(option) {
    const current = dialogueSteps[safeIndex]
    const choices = current?.options ?? []
    if (!current || choices.length === 0) {
      advanceDialogue()
      return
    }
    if (picked?.text === option.text) return
    if (isWrongChoice(option)) {
      rememberSessionMistake(fromDialogueStep(current, lesson.day, safeIndex, locale))
    } else {
      forgetSessionMistake(`dlg-${lesson.day}-${current.step ?? safeIndex}`)
    }
    setDialogueAnswers((prev) => ({ ...prev, [String(safeIndex)]: option }))
    setPicked(option)
    setScore((value) => {
      const previous = !boss && picked ? (picked.points ?? 0) : 0
      return value - previous + (option.points ?? 0)
    })
    if (safeIndex < maxReached) return
    if (!boss) return
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => {
      advanceDialogue()
    }, 600)
  }

  function pickQuiz(index) {
    const current = quiz[stepIndex]
    if (!current || !Array.isArray(current.options) || current.options.length === 0) {
      advanceDialogue()
      return
    }
    const correct = index === current.correctAnswer
    const reviewItem = fromBossQuestion(current, lesson.day, stepIndex, locale)
    if (!correct) {
      rememberSessionMistake(reviewItem)
      const item = {
        id: reviewItem?.id ?? `boss-${lesson.day}-${current.id ?? stepIndex}`,
        it: resolveQuizOption(current.options[current.correctAnswer], locale),
        uk: resolveContentText(current.explanation || current.question, locale),
        translation: current.explanation || current.question,
        day: lesson.day,
      }
      if (onQuizError) onQuizError(item)
      else onStateChange?.((prev) => rememberQuizError(prev, item))
    } else if (reviewItem) {
      forgetSessionMistake(reviewItem.id)
    }
    setScore((value) => value + (correct ? 10 : 0))
    window.setTimeout(() => {
      if (stepIndex + 1 >= quiz.length) {
        setFinished(true)
        setPicked(null)
        return
      }
      setStepIndex((value) => value + 1)
      setPicked(null)
    }, correct ? 600 : 400)
  }

  function nextStep() {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceDialogue()
  }

  function handleQuizComplete() {
    openMistakesSummary()
  }

  function saveDayPhrases() {
    if (!onStateChange || !state || lesson.phrases.length === 0) return
    onStateChange((prev) => {
      const phrases = mergeDayPhrases(prev.savedPhrases ?? [], lesson)
      return rememberSavedPhrases({ ...prev, savedPhrases: phrases }, phrases)
    })
  }

  function onMiniQuizMiss(question) {
    rememberSessionMistake(question)
    const item = {
      id: question.id,
      it: question.speak || question.options[question.correctIndex],
      uk: question.explain || question.prompt,
      day: lesson.day,
    }
    if (onQuizError) onQuizError(item)
    else onStateChange?.((prev) => rememberQuizError(prev, item))
  }

  if (boss && !justFinished && !dayDone) {
    const typeBadge =
      resolveContentText(lesson.type, locale) ||
      `День ${lesson.day} · Boss Level 🏆`
    return (
      <main className="day">
        <LessonHeader day={lesson.day} onBack={onBack} typeBadge={typeBadge} />
        <h1 className="day__title">{resolveContentText(lesson.title, locale)}</h1>
        {lesson.module ? <p className="day__lead">{lesson.module}</p> : null}
        <VoiceBossLevel
          lesson={lesson}
          onBack={onBack}
          onClaimDay={() => completeDayNow()}
        />
      </main>
    )
  }

  if (mistakesPhase === 'summary' && mistakesList.length > 0) {
    return (
      <main className="day">
        <LessonHeader onBack={onBack} />
        <section className="day__hero">
          <span className="badge">{t('mistakesBadge')}</span>
          <h1 className="day__title">{t('mistakesTitle')}</h1>
          <p className="day__lead">{t('mistakesSummary', { total: mistakesList.length })}</p>
        </section>
        <div className="lesson-end-actions">
          <button
            className="btn-primary"
            type="button"
            onClick={() => setMistakesPhase('retry')}
          >
            {t('mistakesStart')}
          </button>
        </div>
      </main>
    )
  }

  if (mistakesPhase === 'retry' && mistakesList.length > 0) {
    return (
      <main className="day">
        <LessonHeader onBack={onBack} />
        <section className="day__hero">
          <span className="badge">{t('mistakesBadge')}</span>
          <h1 className="day__title">{t('mistakesTitle')}</h1>
          <p className="day__lead">{t('mistakesLead', { total: mistakesList.length })}</p>
        </section>
        <PracticeQuiz
          questions={mistakesList}
          heading={t('mistakesTitle')}
          lead={t('mistakesLead', { total: mistakesList.length })}
          onComplete={finishMistakesReview}
          retryMissed
          autoScroll
        />
      </main>
    )
  }

  if (justFinished && dayDone) {
    return (
      <main className="day">
        <LessonHeader onBack={onBack} />
        <section className="result-card">
          <span className="badge">{t('dayCompleteTitle', { day: lesson.day })}</span>
          <h1 className="day__title">
            {resolveContentText(lesson.successTitle, locale) ||
              t('dayCompleteTitle', { day: lesson.day })}
          </h1>
          {resolveContentText(lesson.successMessage, locale) ? (
            <p className="day__lead">{resolveContentText(lesson.successMessage, locale)}</p>
          ) : null}
        </section>
        <div className="lesson-end-actions">
          {nextDay ? (
            <button
              className="btn-primary"
              type="button"
              onClick={() => onStartNextDay?.(nextDay)}
            >
              {t('startDay', { day: nextDay })}
            </button>
          ) : (
            <button className="btn-primary" type="button" onClick={onBack}>
              {t('goHome')}
            </button>
          )}
        </div>
      </main>
    )
  }

  const typeBadge =
    resolveContentText(lesson.type, locale) ||
    (boss ? `День ${lesson.day} · Boss Level 🏆` : `День ${lesson.day}`)
  const showLessonNext =
    !boss && !finished && Boolean(step) && Boolean(picked) && stepIndex >= maxReached
  const hasInteractiveTrack = hasQuiz || dialogueSteps.length > 0

  return (
    <main className={`day${showLessonNext ? ' day--with-next' : ''}`}>
      <LessonHeader day={lesson.day} onBack={onBack} typeBadge={typeBadge} />

      <section className="day__hero">
        {lesson.module ? <p className="day__lead">{lesson.module}</p> : null}
        <h1 className="day__title">{resolveContentText(lesson.title, locale)}</h1>
        <DayStepsNav
          stages={dayStages}
          activeKind={flowKind}
          onSelect={(stage) => {
            setActiveKind(stage.kind)
            document
              .getElementById(`day-step-${stage.kind}`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
      </section>

      <div id="day-step-text">
      {resolveContentText(lesson.story, locale) ? (
        <article className="phrase-card">
          <p className={boss ? 'phrase-card__it' : 'day__lead'}>
            {resolveContentText(lesson.story, locale)}
          </p>
        </article>
      ) : null}

      {lesson.documents.length > 0 ? (
        <>
          <h2 className="day__section">{t('docs')}</h2>
          <ul className="doc-list">
            {lesson.documents.map((doc) => (
              <li key={doc.item} className="phrase-card doc-card">
                <div className="it-line">
                  <p className="phrase-card__it">{capitalizePhrase(doc.item)}</p>
                  <SpeakButton text={doc.item} />
                </div>
                {!hideTranslation &&
                displayContentText(
                  doc.translations ?? doc.translation ?? doc.ukrainian,
                  locale,
                ) ? (
                  <p className="phrase-card__uk">
                    {displayContentText(
                      doc.translations ?? doc.translation ?? doc.ukrainian,
                      locale,
                    )}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <TipList items={lesson.restaurantEtiquette} heading={t('etiquette')} locale={locale} />
      <TipList items={lesson.housingNuances} heading={t('housing')} locale={locale} />
      <TipList items={lesson.postOfficeTips} heading={t('postePractice')} locale={locale} />
      <TipList items={lesson.patronatoTips} heading={t('patronatoPractice')} locale={locale} />
      <TipList items={lesson.barRules} heading={t('barRules')} locale={locale} />
      <TipList items={lesson.supermarketEtiquette} heading={t('shopEtiquette')} locale={locale} />
      <TipList items={lesson.transportTips} heading={t('transportPractice')} locale={locale} />
      <TipList items={lesson.beautyTips} heading={t('salonPractice')} locale={locale} />

      {lesson.phrases.length > 0 ? (
        <>
          <h2 className="day__section">{t('phrases')}</h2>
          <div className="day__phrase-list">
            {lesson.phrases.map((phrase) => (
              <PhraseCard
                key={phrase.audio_id}
                hideTranslation={hideTranslation}
                phrase={{
                  it: capitalizePhrase(phrase.italian),
                  translation: phrase.translations ?? phrase.translation ?? phrase.ukrainian,
                  uk: phrase.translations ?? phrase.translation ?? phrase.ukrainian,
                }}
              />
            ))}
          </div>
        </>
      ) : null}

      {lesson.grammar ? (
        <>
          <h2 className="day__section">{resolveContentText(lesson.grammar.title, locale)}</h2>
          <div className="day__phrase-list">
            {lesson.grammar.rules.map((item) => (
              <article key={resolveContentText(item.rule, 'en') || resolveContentText(item.rule, 'uk')} className="phrase-card">
                <p className="phrase-card__rule">{resolveContentText(item.rule, locale)}</p>
                {item.examples?.map((example) => {
                  const italian =
                    typeof example === 'string' ? example : example.italian
                  const translated =
                    typeof example === 'string'
                      ? ''
                      : resolveContentText(
                          example.translations || example.translation || example.ukrainian,
                          locale,
                        )
                  return (
                    <div key={italian} className="phrase-example">
                      <div className="it-line">
                        <p className="phrase-card__it">{capitalizePhrase(italian)}</p>
                        <SpeakButton text={italian} />
                      </div>
                      {translated ? (
                        <p className="phrase-card__uk">{capitalizePhrase(translated)}</p>
                      ) : null}
                    </div>
                  )
                })}
              </article>
            ))}
          </div>
        </>
      ) : null}

      {!boss && resolveContentText(lesson.culturaTip, locale) ? (
        <section className="cultura">
          <button
            className="cultura__toggle"
            type="button"
            aria-expanded={culturaOpen}
            onClick={() => setCulturaOpen((open) => !open)}
          >
            {t('cultura')}
            <span>{culturaOpen ? '−' : '+'}</span>
          </button>
          {culturaOpen ? (
            <p className="cultura__body">{resolveContentText(lesson.culturaTip, locale)}</p>
          ) : null}
        </section>
      ) : null}
      </div>

      {finished && boss ? (
        <section className="result-card">
          <span className="badge">
            {resolveContentText(lesson.successBadge, locale) || 'Boss Level 🏆'}
          </span>
          <h1 className="day__title">
            {resolveContentText(lesson.successTitle, locale) ||
              resolveContentText(lesson.successMessage, locale)}
          </h1>
          <p className="result-score">{t('score')}</p>
          <p className="result-score__value">
            {score} / {total}
          </p>
        </section>
      ) : null}

      {hasQuiz && question && !finished ? (
        <div id="day-step-boss">
          <h2 className="day__section">
            {t('simulation')} · {stepIndex + 1}/{quiz.length}
          </h2>
          <article className="dialogue-card">
            <p className="phrase-card__it">
              {displayContentText(question.question, locale)}
            </p>
            <div className="dialogue-options">
              {(question.options ?? []).map((option, index) => {
                const label = resolveQuizOption(option, locale)
                const speakText = typeof option === 'string' ? option : option?.text
                return (
                <article key={`${index}-${label}`} className="option-card">
                  <div className="it-line">
                    <p className="option-card__text">{capitalizePhrase(label)}</p>
                    {isItalianPrompt(speakText) ? <SpeakButton text={speakText} /> : null}
                  </div>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => pickQuiz(index)}
                  >
                    {t('choose')}
                  </button>
                </article>
                )
              })}
            </div>
          </article>
        </div>
      ) : null}

      {!hasQuiz && step && !dayDone ? (
        <div id={boss ? 'day-step-boss' : 'day-step-dialogue'}>
          <h2 className="day__section">
            {boss ? t('simulation') : t('dialogueHeading')}
          </h2>
          <StepNav
            index={safeIndex}
            total={dialogueSteps.length}
            canBack={safeIndex > 0}
            canForward={safeIndex < maxReached}
            onBack={goDialogueBack}
            onForward={goDialogueForward}
          />
          <DialogueStep
            key={stepIndex}
            step={step}
            boss={boss}
            picked={picked ?? answerAt(safeIndex)}
            onPick={pick}
          />
        </div>
      ) : null}

      {showLessonNext ? (
        <div className="lesson-next-bar">
          <button className="btn-primary" type="button" onClick={nextStep}>
            {t('next')}
          </button>
        </div>
      ) : null}

      {!boss && onStateChange && lesson.phrases.length > 0 ? (
        <button className="fab" type="button" onClick={saveDayPhrases}>
          {t('saveDayPhrases')}
        </button>
      ) : null}

      <Flashcards key={`flash-${lesson.day}`} deck={deck} />
      {(claimReady || (!hasInteractiveTrack && !finished && !dayDone)) && !dayDone ? (
        <div className="lesson-end-actions">
          {claimReady && mistakesPhase === 'cleared' ? (
            <p className="day__intro">{t('mistakesCleared')}</p>
          ) : null}
          <button
            className="btn-primary"
            type="button"
            disabled={!claimReady && hasInteractiveTrack}
            onClick={() => completeDayNow()}
          >
            {t('markComplete')}
          </button>
        </div>
      ) : null}
      {finished && mistakesPhase === 'idle' && !claimReady ? (
        <PracticeQuiz
          key={`quiz-${lesson.day}`}
          questions={miniQuestions}
          onMiss={onMiniQuizMiss}
          onComplete={handleQuizComplete}
          autoScroll
        />
      ) : null}

    </main>
  )
}
