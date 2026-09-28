import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isDayCompleted,
  isDayUnlocked,
  markDayComplete,
  progressStats,
  TOTAL_DAYS,
} from '../progress.js'
import { loadState, saveState } from '../storage.js'

export function useChallengeProgress() {
  const [state, setState] = useState(loadState)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = useCallback((message) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  const persist = useCallback((next) => {
    setState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next
      saveState(value)
      return value
    })
  }, [])

  const completeDay = useCallback(
    (day) => {
      persist((prev) => {
        const freshlyCompleted = !isDayCompleted(day, prev.completedDays)
        const next = markDayComplete(prev, day)
        if (freshlyCompleted) {
          queueMicrotask(() => {
            showToast(`День ${day} пройдено! 🔥 ${next.streak} Day Streak`)
          })
        }
        return next
      })
    },
    [persist, showToast],
  )

  const stats = progressStats(state.completedDays)

  return {
    state,
    persist,
    toast,
    stats,
    totalDays: TOTAL_DAYS,
    isCompleted: (day) => isDayCompleted(day, state.completedDays),
    isUnlocked: (day) => isDayUnlocked(day, state.completedDays),
    completeDay,
    showToast,
    dismissToast: () => setToast(null),
  }
}
