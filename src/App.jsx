import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import ArcLessonScreen from './screens/ArcLessonScreen.jsx'
import { getLesson, nextAfter, OPEN_DAYS } from './data/lessons.js'
import { useChallengeProgress } from './hooks/useChallengeProgress.js'
import './components/Progress.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const progress = useChallengeProgress()
  const { state, persist, toast, isUnlocked, isCompleted, completeDay, showToast } =
    progress

  function goHome() {
    setScreen('home')
  }

  function openDay(day) {
    if (!isUnlocked(day)) {
      showToast('Спочатку пройдіть попередній день')
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

  const dayMatch = /^day(\d+)$/.exec(screen)
  if (dayMatch) {
    const day = Number(dayMatch[1])
    const lesson = getLesson(day)
    if (lesson && isUnlocked(day)) {
      const next = nextAfter(day)
      return (
        <>
          <ArcLessonScreen
            lesson={lesson}
            state={state}
            onBack={goHome}
            onStateChange={persist}
            onOpenDay={openDay}
            isUnlocked={isUnlocked}
            dayCompleted={isCompleted(day)}
            onMarkComplete={() => completeDay(day)}
            continueLabel={next.label}
            onContinue={() => completeAndGo(day, next.screen)}
          />
          {toast ? (
            <p className="toast" role="status">
              {toast}
            </p>
          ) : null}
        </>
      )
    }
  }

  return (
    <>
      <HomeScreen
        state={state}
        onStart={startFromHome}
        onOpenDay={openDay}
        isUnlocked={isUnlocked}
        onLockedDay={() => showToast('Спочатку пройдіть попередній день')}
      />
      {toast ? (
        <p className="toast" role="status">
          {toast}
        </p>
      ) : null}
    </>
  )
}
