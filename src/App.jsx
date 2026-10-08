import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import ArcLessonScreen from './screens/ArcLessonScreen.jsx'
import ReviewScreen from './screens/ReviewScreen.jsx'
import Header from './components/Header.jsx'
import { getLesson, OPEN_DAYS } from './data/lessons.js'
import { isDayUnlocked, uniqueDays, TOTAL_DAYS } from './progress.js'
import { loadState } from './storage.js'
import { useChallengeProgress } from './hooks/useChallengeProgress.js'
import { useI18n } from './i18n.js'
import './components/Progress.css'

function restoreUiScreen() {
  const saved = loadState()
  const raw = saved.uiScreen || 'home'
  if (raw === 'home' || raw === 'review') return raw
  const match = /^day(\d+)$/.exec(raw)
  if (!match) return 'home'
  const day = Number(match[1])
  if (
    getLesson(day) &&
    isDayUnlocked(day, saved.completedDays, saved.unlockedDays)
  ) {
    return raw
  }
  return 'home'
}

function Toast({ toast }) {
  if (!toast) return null
  return (
    <p className="toast" role="status">
      {toast}
    </p>
  )
}

export default function App() {
  const { t } = useI18n()
  const progress = useChallengeProgress()
  const {
    state,
    persist,
    toast,
    isUnlocked,
    completeDay,
    recordQuizError,
    gradeReview,
    exportBackup,
    importBackup,
  } = progress
  const [screen, setScreen] = useState(restoreUiScreen)

  function goTo(next) {
    setScreen(next)
    persist((prev) => ({ ...prev, uiScreen: next }))
  }

  function goHome() {
    goTo('home')
  }

  function openDay(day) {
    if (!isUnlocked(day)) {
      progress.showToast(t('lockedDay'))
      return
    }
    persist((prev) => ({
      ...prev,
      started: true,
      currentDay: day,
      uiScreen: `day${day}`,
    }))
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

  function startUnlockedDay(nextDay) {
    if (!nextDay || nextDay > TOTAL_DAYS) {
      goTo('home')
      return
    }
    persist((prev) => ({
      ...prev,
      started: true,
      currentDay: nextDay,
      uiScreen: `day${nextDay}`,
      unlockedDays: uniqueDays([...(prev.unlockedDays ?? [1]), nextDay]),
    }))
    setScreen(`day${nextDay}`)
  }

  let body = (
    <HomeScreen
      state={state}
      onStart={startFromHome}
      onOpenDay={openDay}
      isUnlocked={isUnlocked}
      onLockedDay={() => progress.showToast(t('lockedDay'))}
      onOpenReview={() => goTo('review')}
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
        body = (
          <ArcLessonScreen
            key={day}
            lesson={lesson}
            state={state}
            onBack={goHome}
            onStateChange={persist}
            onOpenDay={openDay}
            isUnlocked={isUnlocked}
            onMarkComplete={() => completeDay(day)}
            onQuizError={recordQuizError}
            onStartNextDay={startUnlockedDay}
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
