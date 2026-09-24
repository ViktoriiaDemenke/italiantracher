import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import ArcLessonScreen from './screens/ArcLessonScreen.jsx'
import { getLesson, nextAfter, OPEN_DAYS } from './data/lessons.js'
import { loadState, saveState } from './storage'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [state, setState] = useState(loadState)

  function persist(next) {
    setState(next)
    saveState(next)
  }

  function goHome() {
    setScreen('home')
  }

  function openDay(day) {
    persist({ ...state, started: true, currentDay: day })
    setScreen(`day${day}`)
  }

  function startFromHome() {
    const day = OPEN_DAYS.includes(state.currentDay) ? state.currentDay : 1
    openDay(day)
  }

  function completeAndGo(fromDay, toScreen, nextDay) {
    const completedDays = state.completedDays.includes(fromDay)
      ? state.completedDays
      : [...state.completedDays, fromDay]
    persist({
      ...state,
      started: true,
      completedDays,
      currentDay: nextDay ?? fromDay,
    })
    setScreen(toScreen)
  }

  const dayMatch = /^day(\d+)$/.exec(screen)
  if (dayMatch) {
    const day = Number(dayMatch[1])
    const lesson = getLesson(day)
    if (lesson) {
      const next = nextAfter(day)
      return (
        <ArcLessonScreen
          lesson={lesson}
          state={state}
          onBack={goHome}
          onStateChange={persist}
          onOpenDay={openDay}
          continueLabel={next.label}
          onContinue={() => completeAndGo(day, next.screen, next.day)}
        />
      )
    }
  }

  return <HomeScreen state={state} onStart={startFromHome} onOpenDay={openDay} />
}
