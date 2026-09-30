import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import ArcLessonScreen from './screens/ArcLessonScreen.jsx'
import ReviewScreen from './screens/ReviewScreen.jsx'
import Header from './components/Header.jsx'
import { getLesson, nextAfter, OPEN_DAYS } from './data/lessons.js'
import { useChallengeProgress } from './hooks/useChallengeProgress.js'
import { useI18n } from './i18n.js'
import './components/Progress.css'

function Toast({ toast }) {
  if (!toast) return null
  return (
    <p className="toast" role="status">
      {toast}
    </p>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const { t } = useI18n()
  const progress = useChallengeProgress()
  const {
    state,
    persist,
    toast,
    isUnlocked,
    isCompleted,
    completeDay,
    recordQuizError,
    gradeReview,
    exportBackup,
    importBackup,
  } = progress

  function goHome() {
    setScreen('home')
  }

  function openDay(day) {
    if (!isUnlocked(day)) {
      progress.showToast(t('lockedDay'))
      return
    }
    persist({ ...state, started: true, currentDay: day })
    setScreen(`day${day}`)
  }

  function startFromHome() {
    const preferred = state.currentDay
    const nextOpen =
      OPEN_DAYS.find(
        (item) => isUnlocked(item) && !state.completedDays.includes(item),
      ) ?? 1
    const day =
      OPEN_DAYS.includes(preferred) && isUnlocked(preferred) ? preferred : nextOpen
    openDay(day)
  }

  function completeAndGo(fromDay, toScreen) {
    completeDay(fromDay)
    setScreen(toScreen)
  }

  function continueLabelFor(day) {
    const next = nextAfter(day)
    if (next.screen === 'home') return t('goHome')
    return t('dayN', { day: next.day })
  }

  let body = (
    <HomeScreen
      state={state}
      onStart={startFromHome}
      onOpenDay={openDay}
      isUnlocked={isUnlocked}
      onLockedDay={() => progress.showToast(t('lockedDay'))}
      onOpenReview={() => setScreen('review')}
      onExport={exportBackup}
      onImportFile={importBackup}
    />
  )

  if (screen === 'review') {
    body = <ReviewScreen state={state} onGrade={gradeReview} onBack={goHome} />
  } else {
    const dayMatch = /^day(\d+)$/.exec(screen)
    if (dayMatch) {
      const day = Number(dayMatch[1])
      const lesson = getLesson(day)
      if (lesson && isUnlocked(day)) {
        const next = nextAfter(day)
        body = (
          <ArcLessonScreen
            lesson={lesson}
            state={state}
            onBack={goHome}
            onStateChange={persist}
            onOpenDay={openDay}
            isUnlocked={isUnlocked}
            dayCompleted={isCompleted(day)}
            onMarkComplete={() => completeDay(day)}
            continueLabel={continueLabelFor(day)}
            onContinue={() => completeAndGo(day, next.screen)}
            onQuizError={recordQuizError}
          />
        )
      }
    }
  }

  return (
    <>
      <Header />
      {body}
      <Toast toast={toast} />
    </>
  )
}
