import { useEffect, useMemo, useRef, useState } from 'react'
import DayStepsNav from '../components/DayStepsNav.jsx'
import PhraseCard from '../components/PhraseCard.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import SpeakButton from '../components/SpeakButton.jsx'
import Flashcards from '../components/Flashcards.jsx'
import PracticeQuiz from '../components/PracticeQuiz.jsx'
import { maxScore } from '../content/loadLesson.js'
import { buildMiniQuiz, buildPracticeDeck } from '../learn/practice.js'
import {
  buildDayStages,
  buildDaySteps,
  currentDayStepIndex,
} from '../learn/daySteps.js'
import { TOTAL_DAYS } from '../progress.js'
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
import '../screens/HomeScreen.css'
import './Lesson.css'
import './Day1Screen.css'
import '../components/Learn.css'

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

function LessonProgress({ day, step, steps }) {
  const { t } = useI18n()
  const dayPercent = Math.round((day / TOTAL_DAYS) * 100)
  const totalSteps = Math.max(steps, 0)
  const currentStep =
    totalSteps > 0 ? Math.min(Math.max(step, 1), totalSteps) : 0
  const stepPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0

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
      {steps > 0 ? (
        <>
          <p className="lesson-progress__label">
            {t('stepOf', { step: currentStep, total: steps })}
          </p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={stepPercent}
          >
            <span className="progress-bar__fill" style={{ width: `${stepPercent}%` }} />
          </div>
        </>
      ) : null}
    </section>
  )
}

function toneClass(tone, selected) {
  if (!selected) return ''
  if (tone === 'natural') return 'option-card--correct'
  if (tone === 'bookish') return 'option-card--bookish'
  return 'option-card--wrong'
}

function DialogueStep({ step, boss, picked, onPick }) {
  const { t } = useI18n()
  const [slow, setSlow] = useState(true)
  const [showUk, setShowUk] = useState(false)
  const rate = slow ? DEFAULT_SPEECH_RATE : FAST_SPEECH_RATE
  const choices = Array.isArray(step?.options) ? step.options : []
  const lineUk = step?.translation || step?.ukrainian

  return (
    <article className="dialogue-card">
      <p className="dialogue-line__who">{step?.speaker}</p>
      <div className="it-line">
        <p className="phrase-card__it">{step?.text}</p>
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
              <p className="option-card__text">{option.text}</p>
              <SpeakButton text={option.text} rate={rate} />
            </div>
            {!boss && showUk && (option.translation || option.ukrainian) ? (
              <p className="phrase-card__uk">{option.translation || option.ukrainian}</p>
            ) : null}
            <button
              className="btn-primary"
              type="button"
              disabled={Boolean(picked) && !boss}
              onClick={() => onPick(option)}
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
  onMarkComplete,
  isUnlocked,
  onQuizError,
  onStartNextDay,
}) {
  const { t } = useI18n()
  const boss = lesson.mode === 'boss'
  const hideTranslation = boss
  const quiz = lesson.questions
  const hasQuiz = quiz.length > 0
  const daySteps = useMemo(() => buildDaySteps(lesson), [lesson])
  const dayStages = useMemo(() => buildDayStages(daySteps), [daySteps])
  const [culturaOpen, setCulturaOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [dayDone, setDayDone] = useState(false)
  const [activeKind, setActiveKind] = useState(dayStages[0]?.kind ?? 'text')
  const [mistakesList, setMistakesList] = useState([])
  const [reviewingMistakes, setReviewingMistakes] = useState(false)
  const mistakesRef = useRef([])
  const advanceTimer = useRef(null)
  const savedPhrases = state?.savedPhrases ?? []
  const deck = useMemo(
    () => buildPracticeDeck(lesson).filter((card) => card.day === lesson.day),
    [lesson],
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
    setCulturaOpen(false)
    setSheetOpen(false)
    setStepIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setDayDone(false)
    setMistakesList([])
    setReviewingMistakes(false)
    mistakesRef.current = []
    setActiveKind(buildDayStages(buildDaySteps(lesson))[0]?.kind ?? 'text')
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    }
  }, [lesson.day])

  useEffect(() => {
    if (hasQuiz) return
    if (dialogueSteps.length === 0) return
    if (stepIndex >= dialogueSteps.length) {
      setFinished(true)
      setPicked(null)
      return
    }
    const current = dialogueSteps[stepIndex]
    const choices = Array.isArray(current?.options) ? current.options : []
    if (!current || choices.length === 0) {
      if (stepIndex + 1 >= dialogueSteps.length) {
        setFinished(true)
        setPicked(null)
        return
      }
      setStepIndex((index) => index + 1)
      setPicked(null)
    }
  }, [hasQuiz, dialogueSteps, stepIndex])

  useEffect(() => {
    if (!finished || dayDone || reviewingMistakes) return
    if (miniQuestions.length > 0) return
    tryFinishDay()
  }, [finished, miniQuestions.length, dayDone, reviewingMistakes])

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
    onMarkComplete?.()
    setReviewingMistakes(false)
    setDayDone(true)
  }

  function tryFinishDay() {
    if (mistakesRef.current.length > 0) {
      setReviewingMistakes(true)
      return
    }
    completeDayNow()
  }

  function advanceDialogue() {
    setPicked(null)
    setStepIndex((index) => {
      const next = index + 1
      if (next >= dialogueSteps.length) {
        setFinished(true)
        return index
      }
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
    if (picked && !boss) return
    if (isWrongChoice(option)) {
      rememberSessionMistake(fromDialogueStep(current, lesson.day, safeIndex))
    } else {
      forgetSessionMistake(`dlg-${lesson.day}-${current.step ?? safeIndex}`)
    }
    setPicked(option)
    setScore((value) => value + (option.points ?? 0))
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
    const reviewItem = fromBossQuestion(current, lesson.day, stepIndex)
    if (!correct) {
      rememberSessionMistake(reviewItem)
      const item = {
        id: reviewItem?.id ?? `boss-${lesson.day}-${current.id ?? stepIndex}`,
        it: current.options[current.correctAnswer],
        uk: current.explanation || current.question,
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
    }, correct ? 600 : 0)
  }

  function nextStep() {
    advanceDialogue()
  }

  function handleQuizComplete() {
    tryFinishDay()
  }

  function onReviewCorrect(question) {
    window.setTimeout(() => {
      const remaining = removeMistake(mistakesRef.current, question.id)
      mistakesRef.current = remaining
      setMistakesList(remaining)
      if (remaining.length === 0) completeDayNow()
    }, 600)
  }

  function saveDayPhrases() {
    if (!onStateChange || !state || lesson.phrases.length === 0) return
    onStateChange((prev) => {
      const phrases = mergeDayPhrases(prev.savedPhrases ?? [], lesson)
      return rememberSavedPhrases({ ...prev, savedPhrases: phrases }, phrases)
    })
    setSheetOpen(true)
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

  if (reviewingMistakes && mistakesList.length > 0) {
    return (
      <main className="day">
        <header className="day__top">
          <button className="back-btn" type="button" onClick={onBack}>
            {t('back')}
          </button>
        </header>
        <section className="day__hero">
          <span className="badge">{t('mistakesBadge')}</span>
          <h1 className="day__title">{t('mistakesTitle')}</h1>
          <p className="day__lead">{t('mistakesLead', { total: mistakesList.length })}</p>
        </section>
        <PracticeQuiz
          key={mistakesList[0].id}
          questions={mistakesList}
          heading={t('mistakesTitle')}
          lead={t('mistakesLead', { total: mistakesList.length })}
          onCorrect={onReviewCorrect}
          autoAdvance={false}
          autoScroll
        />
      </main>
    )
  }

  if (dayDone) {
    return (
      <main className="day">
        <header className="day__top">
          <button className="back-btn" type="button" onClick={onBack}>
            {t('back')}
          </button>
        </header>
        <section className="result-card">
          <span className="badge">{t('dayCompleteTitle', { day: lesson.day })}</span>
          <h1 className="day__title">
            {lesson.successTitle || t('dayCompleteTitle', { day: lesson.day })}
          </h1>
          {lesson.successMessage ? (
            <p className="day__lead">{lesson.successMessage}</p>
          ) : null}
        </section>
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
      </main>
    )
  }

  return (
    <main className="day">
      <header className="day__top">
        <button className="back-btn" type="button" onClick={onBack}>
          {t('back')}
        </button>
        <LessonProgress
          day={lesson.day}
          step={flowIndex + 1}
          steps={daySteps.length}
        />
      </header>

      <section className="day__hero">
        <span className="badge">
          {lesson.type || (boss ? `День ${lesson.day} · Boss Level 🏆` : `День ${lesson.day}`)}
        </span>
        {lesson.module ? <p className="day__lead">{lesson.module}</p> : null}
        <h1 className="day__title">{lesson.title}</h1>
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
      {lesson.story ? (
        <article className="phrase-card">
          <p className={boss ? 'phrase-card__it' : 'day__lead'}>{lesson.story}</p>
        </article>
      ) : null}

      {lesson.documents.length > 0 ? (
        <>
          <h2 className="day__section">{t('docs')}</h2>
          <ul className="doc-list">
            {lesson.documents.map((doc) => (
              <li key={doc.item} className="phrase-card doc-card">
                <div className="it-line">
                  <p className="phrase-card__it">{doc.item}</p>
                  <SpeakButton text={doc.item} />
                </div>
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
          <h2 className="day__section">{t('etiquette')}</h2>
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
          <h2 className="day__section">{t('housing')}</h2>
          <ul className="doc-list">
            {lesson.housingNuances.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.postOfficeTips?.length > 0 ? (
        <>
          <h2 className="day__section">{t('postePractice')}</h2>
          <ul className="doc-list">
            {lesson.postOfficeTips.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.patronatoTips?.length > 0 ? (
        <>
          <h2 className="day__section">{t('patronatoPractice')}</h2>
          <ul className="doc-list">
            {lesson.patronatoTips.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.barRules?.length > 0 ? (
        <>
          <h2 className="day__section">{t('barRules')}</h2>
          <ul className="doc-list">
            {lesson.barRules.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.supermarketEtiquette?.length > 0 ? (
        <>
          <h2 className="day__section">{t('shopEtiquette')}</h2>
          <ul className="doc-list">
            {lesson.supermarketEtiquette.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.transportTips?.length > 0 ? (
        <>
          <h2 className="day__section">{t('transportPractice')}</h2>
          <ul className="doc-list">
            {lesson.transportTips.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.beautyTips?.length > 0 ? (
        <>
          <h2 className="day__section">{t('salonPractice')}</h2>
          <ul className="doc-list">
            {lesson.beautyTips.map((item) => (
              <li key={item} className="phrase-card doc-card">
                <p className="phrase-card__it">{item}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.phrases.length > 0 ? (
        <>
          <h2 className="day__section">{t('phrases')}</h2>
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
                {item.examples?.map((example) => {
                  const italian =
                    typeof example === 'string' ? example : example.italian
                  const ukrainian =
                    typeof example === 'string'
                      ? ''
                      : example.ukrainian || example.translation || ''
                  return (
                    <div key={italian} className="it-line">
                      <div>
                        <p className="phrase-card__it">{italian}</p>
                        {ukrainian ? (
                          <p className="phrase-card__uk">{ukrainian}</p>
                        ) : null}
                      </div>
                      <SpeakButton text={italian} />
                    </div>
                  )
                })}
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
            {t('cultura')}
            <span>{culturaOpen ? '−' : '+'}</span>
          </button>
          {culturaOpen ? <p className="cultura__body">{lesson.culturaTip}</p> : null}
        </section>
      ) : null}
      </div>

      {finished && boss ? (
        <section className="result-card">
          <span className="badge">
            {lesson.successBadge || 'Boss Level 🏆'}
          </span>
          <h1 className="day__title">
            {lesson.successTitle || lesson.successMessage}
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
            <p className="phrase-card__it">{question.question}</p>
            <div className="dialogue-options">
              {(question.options ?? []).map((option, index) => (
                <article key={option} className="option-card">
                  <div className="it-line">
                    <p className="option-card__text">{option}</p>
                    <SpeakButton text={option} />
                  </div>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => pickQuiz(index)}
                  >
                    {t('choose')}
                  </button>
                </article>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {!hasQuiz && step && !finished ? (
        <div id={boss ? 'day-step-boss' : 'day-step-dialogue'}>
          <h2 className="day__section">
            {boss ? t('simulation') : t('dialogueHeading')} ·{' '}
            {step.step ?? stepIndex + 1}/{dialogueSteps.length}
          </h2>
          <DialogueStep
            key={stepIndex}
            step={step}
            boss={boss}
            picked={picked}
            onPick={pick}
          />
          {picked ? (
            <button className="btn-primary" type="button" onClick={nextStep}>
              {t('next')}
            </button>
          ) : null}
        </div>
      ) : null}

      {!hasQuiz && dialogueSteps.length === 0 && !finished ? (
        <button className="btn-primary" type="button" onClick={() => setFinished(true)}>
          {t('next')}
        </button>
      ) : null}

      {!boss && onStateChange && lesson.phrases.length > 0 ? (
        <button className="fab" type="button" onClick={saveDayPhrases}>
          {t('saveDayPhrases')}
        </button>
      ) : null}

      <Flashcards key={`flash-${lesson.day}`} deck={deck} />
      {finished ? (
        <PracticeQuiz
          key={`quiz-${lesson.day}`}
          questions={miniQuestions}
          onMiss={onMiniQuizMiss}
          onCorrect={(question) => forgetSessionMistake(question.id)}
          onComplete={handleQuizComplete}
          autoScroll
        />
      ) : null}

      <SavedPhrasesSheet
        open={sheetOpen}
        phrases={savedPhrases}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  )
}
