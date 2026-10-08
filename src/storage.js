import { STORAGE_KEY, DEFAULT_STATE, applyStaleStreak, uniqueCompleted } from './progress.js'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw)
    return applyStaleStreak({
      ...DEFAULT_STATE,
      ...parsed,
      completedDays: uniqueCompleted(parsed.completedDays),
    })
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function reviewId(item) {
  return String(item.id ?? `${item.day ?? 0}:${item.it}`)
}

export function rememberSavedPhrases(state, phrases) {
  const now = Date.now()
  const list = Array.isArray(state.reviewItems) ? [...state.reviewItems] : []
  for (const phrase of phrases ?? []) {
    const id = reviewId({
      id: `saved:${phrase.day ?? 0}:${phrase.it}`,
      it: phrase.it,
      day: phrase.day,
    })
    if (list.some((entry) => entry.id === id)) continue
    list.push({
      id,
      it: String(phrase.it ?? ''),
      uk: phrase.uk ?? phrase.translation ?? '',
      translation: phrase.translation ?? phrase.uk ?? '',
      day: Number(phrase.day) || 0,
      source: 'saved',
      box: 1,
      intervalDays: 0,
      due: now,
      mistakes: 0,
    })
  }
  return { ...state, reviewItems: list }
}

export function rememberQuizError(state, item) {
  const id = reviewId(item)
  const now = Date.now()
  const list = Array.isArray(state.reviewItems) ? [...state.reviewItems] : []
  const index = list.findIndex((entry) => entry.id === id)
  const nextItem = {
    id,
    it: String(item.it ?? ''),
    uk: item.uk ?? item.translation ?? '',
    translation: item.translation ?? item.uk ?? '',
    day: Number(item.day) || 0,
    source: 'quiz',
    box: 1,
    intervalDays: 0,
    due: now,
    mistakes: (list[index]?.mistakes ?? 0) + 1,
  }
  if (index >= 0) list[index] = { ...list[index], ...nextItem }
  else list.push(nextItem)
  return { ...state, reviewItems: list }
}

export function dueReviewItems(state, now = Date.now()) {
  return (state.reviewItems ?? [])
    .filter((item) => item.it && item.due <= now)
    .sort((a, b) => a.due - b.due)
}

export function gradeReviewItem(state, id, knew, now = Date.now()) {
  const list = (state.reviewItems ?? []).map((item) => {
    if (item.id !== id) return item
    if (!knew) {
      return { ...item, box: 1, intervalDays: 0, due: now, source: item.source }
    }
    const box = Math.min(5, (item.box ?? 1) + 1)
    const intervalDays = [0, 1, 2, 4, 7, 14][box] ?? 14
    return {
      ...item,
      box,
      intervalDays,
      due: now + intervalDays * 24 * 60 * 60 * 1000,
    }
  })
  return { ...state, reviewItems: list }
}

export function buildBackupPayload(state) {
  return {
    version: 1,
    key: STORAGE_KEY,
    exportedAt: new Date().toISOString(),
    state,
  }
}

export function parseBackupPayload(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  const incoming = data?.state && typeof data.state === 'object' ? data.state : data
  if (!incoming || typeof incoming !== 'object') {
    throw new Error('Невірний файл прогресу')
  }
  return applyStaleStreak({ ...DEFAULT_STATE, ...incoming })
}

export function downloadBackup(state) {
  const payload = JSON.stringify(buildBackupPayload(state), null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `italian-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file) {
  const text = await file.text()
  return parseBackupPayload(text)
}
