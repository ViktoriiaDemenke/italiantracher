export const LESSON_REMINDER_ID = 1900
export const DEFAULT_REMINDER_HOUR = 19
export const DEFAULT_REMINDER_MINUTE = 0

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatReminderTime(hour, minute) {
  return `${pad(hour)}:${pad(minute)}`
}

export function parseReminderTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''))
  if (!match) {
    return { hour: DEFAULT_REMINDER_HOUR, minute: DEFAULT_REMINDER_MINUTE }
  }
  const hour = Math.min(23, Math.max(0, Number(match[1])))
  const minute = Math.min(59, Math.max(0, Number(match[2])))
  return { hour, minute }
}

async function plugin() {
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  return LocalNotifications
}

export async function checkNotificationPermission() {
  try {
    const LocalNotifications = await plugin()
    const status = await LocalNotifications.checkPermissions()
    return status.display === 'granted'
  } catch {
    if (typeof Notification === 'undefined') return false
    return Notification.permission === 'granted'
  }
}

export async function requestNotificationPermission() {
  try {
    const LocalNotifications = await plugin()
    const status = await LocalNotifications.requestPermissions()
    return status.display === 'granted'
  } catch {
    if (typeof Notification === 'undefined') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }
}

export async function cancelLessonReminder() {
  try {
    const { cancelLocalDailyReminder } = await import('./components/ReminderSetting/index.tsx')
    await cancelLocalDailyReminder()
  } catch {
    /* Ignore missing plugin on web */
  }
}

export async function scheduleDailyLessonReminder({
  hour = DEFAULT_REMINDER_HOUR,
  minute = DEFAULT_REMINDER_MINUTE,
  title,
  body,
}) {
  const { scheduleLocalDailyReminder } = await import('./components/ReminderSetting/index.tsx')
  await scheduleLocalDailyReminder({ hour, minute, title, body })
}

export async function syncLessonReminder(enabled, hour, minute, copy) {
  if (!enabled) {
    await cancelLessonReminder()
    return false
  }
  const granted = await checkNotificationPermission()
  if (!granted) return false
  try {
    await scheduleDailyLessonReminder({
      hour,
      minute,
      title: copy.title,
      body: copy.body,
    })
    return true
  } catch {
    return false
  }
}
