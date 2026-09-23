import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import Day1Screen from './screens/Day1Screen.jsx'
import { loadState, saveState } from './storage'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [state, setState] = useState(loadState)

  function persist(next) {
    setState(next)
    saveState(next)
  }

  function startDay1() {
    persist({ ...state, started: true, currentDay: 1 })
    setScreen('day1')
  }

  function goHome() {
    setScreen('home')
  }

  if (screen === 'day1') {
    return (
      <Day1Screen state={state} onBack={goHome} onStateChange={persist} />
    )
  }

  return <HomeScreen state={state} onStart={startDay1} />
}
