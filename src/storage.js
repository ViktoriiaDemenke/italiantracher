import { STORAGE_KEY, DEFAULT_STATE, applyStaleStreak } from './progress.js'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return applyStaleStreak({ ...DEFAULT_STATE, ...JSON.parse(raw) })
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
