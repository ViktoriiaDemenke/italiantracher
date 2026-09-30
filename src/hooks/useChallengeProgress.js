import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isDayCompleted,
  isDayUnlocked,
  markDayComplete,
  progressStats,
  TOTAL_DAYS,
} from '../progress.js'
import {
  downloadBackup,
  gradeReviewItem,
  loadState,
  readBackupFile,
  rememberQuizError,
  saveState,
} from '../storage.js'
import { useI18n } from '../i18n.js'

export function useChallengeProgress() {
  const { t } = useI18n()
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

  useEffect(() => {
    function onVoiceToast() {
      showToast(t('voiceUnavailable'))
    }
    window.addEventListener('italian-tracker:toast', onVoiceToast)
    return () => window.removeEventListener('italian-tracker:toast', onVoiceToast)
  }, [showToast, t])

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
            showToast(t('dayDoneToast', { day, streak: next.streak }))
          })
        }
        return next
      })
    },
    [persist, showToast, t],
  )

  const stats = progressStats(state.completedDays)

  const recordQuizError = useCallback(
    (item) => persist((prev) => rememberQuizError(prev, item)),
    [persist],
  )

  const gradeReview = useCallback(
    (id, knew) => persist((prev) => gradeReviewItem(prev, id, knew)),
    [persist],
  )

  const exportBackup = useCallback(() => {
    downloadBackup(state)
    showToast(t('backupSaved'))
  }, [state, showToast, t])

  const importBackup = useCallback(
    async (file) => {
      try {
        const next = await readBackupFile(file)
        persist(next)
        showToast(t('backupRestored'))
      } catch {
        showToast(t('backupFailed'))
      }
    },
    [persist, showToast, t],
  )

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
    recordQuizError,
    gradeReview,
    exportBackup,
    importBackup,
    dismissToast: () => setToast(null),
  }
}
