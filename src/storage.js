const STORAGE_KEY = 'italian_tracker_state_v1'

const DEFAULT_STATE = {
  currentDay: 1,
  completedDays: [],
  started: false,
  savedPhrases: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
