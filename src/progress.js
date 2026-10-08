export const TOTAL_DAYS = 30
export const STORAGE_KEY = 'italian_tracker_state_v1'

export const DEFAULT_STATE = {
  currentDay: 1,
  completedDays: [],
  unlockedDays: [1],
  started: false,
  savedPhrases: [],
  reviewItems: [],
  streak: 0,
  lastActivityDate: null,
  uiScreen: 'home',
}

export function todayISO(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addCalendarDays(iso, delta) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + delta)
  return todayISO(date)
}

export function uniqueCompleted(completedDays) {
  return [...new Set((completedDays ?? []).map(Number))]
    .filter((day) => day >= 1 && day <= TOTAL_DAYS)
    .sort((a, b) => a - b)
}

export function isDayCompleted(day, completedDays) {
  return uniqueCompleted(completedDays).includes(day)
}

export function uniqueDays(days) {
  return uniqueCompleted(days)
}

export function deriveUnlockedDays(state) {
  const completed = uniqueCompleted(state.completedDays)
  return uniqueDays([
    1,
    ...(state.unlockedDays ?? []),
    ...completed.map((day) => Math.min(TOTAL_DAYS, day + 1)),
  ])
}

export function isDayUnlocked(day, completedDays, unlockedDays) {
  if (day < 1 || day > TOTAL_DAYS) return false
  if (day === 1) return true
  if ((unlockedDays ?? []).includes(Number(day))) return true
  return uniqueCompleted(completedDays).includes(day - 1)
}

export function progressStats(completedDays) {
  const done = uniqueCompleted(completedDays).length
  const percent = Math.round((done / TOTAL_DAYS) * 100)
  return { done, total: TOTAL_DAYS, percent }
}

export function nextStreak(streak, lastActivityDate, today) {
  if (!lastActivityDate) return 1
  if (lastActivityDate === today) return Math.max(streak || 0, 1)
  if (lastActivityDate === addCalendarDays(today, -1)) return (streak || 0) + 1
  return 1
}

export function applyStaleStreak(state, today = todayISO()) {
  const merged = {
    ...DEFAULT_STATE,
    ...state,
    unlockedDays: deriveUnlockedDays({ ...DEFAULT_STATE, ...state }),
  }
  const last = merged.lastActivityDate
  if (!last) {
    return { ...merged, streak: merged.streak ?? 0 }
  }
  if (last === today || last === addCalendarDays(today, -1)) {
    return { ...merged, streak: merged.streak ?? 0 }
  }
  return { ...merged, streak: 0 }
}

export function markDayComplete(state, day, today = todayISO()) {
  const completedDays = uniqueCompleted(state.completedDays)
  const alreadyDone = completedDays.includes(day)
  const nextCompleted = alreadyDone
    ? completedDays
    : uniqueCompleted([...completedDays, day])
  const streak = alreadyDone
    ? state.streak ?? 0
    : nextStreak(state.streak ?? 0, state.lastActivityDate, today)
  const following = Math.min(TOTAL_DAYS, day + 1)
  const unlockedDays = uniqueDays([
    1,
    ...(state.unlockedDays ?? [1]),
    following,
  ])

  return {
    ...state,
    started: true,
    completedDays: nextCompleted,
    unlockedDays,
    streak,
    lastActivityDate: alreadyDone ? state.lastActivityDate ?? today : today,
    currentDay: alreadyDone ? state.currentDay : following,
  }
}
