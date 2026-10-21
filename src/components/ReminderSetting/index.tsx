import { useEffect, useState, type ChangeEvent } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { useI18n } from '../../i18n.js'
import {
  LESSON_REMINDER_ID,
  formatReminderTime,
  parseReminderTime,
} from '../../notifications.js'
import './ReminderSetting.css'

const ANDROID_CHANNEL_ID = 'lesson-reminders'
const STORAGE_ENABLED = 'notificationsEnabled'
const STORAGE_TIME = 'app_reminder_time'
const STORAGE_LAST_FIRE = 'app_reminder_last_fired'
const WEB_TITLE = 'Italian Life Tracker'
const WEB_BODY = 'Час для щоденного уроку італійської!'
const WEB_ICON = '/icon.png'

type ReminderSettingProps = {
  remindersEnabled?: boolean
  reminderHour?: number
  reminderMinute?: number
  title?: string
  body?: string
  onToggleReminders?: (enabled: boolean) => void
  onReminderTimeChange?: (value: string) => void
  onDenied?: (message?: string) => void
}

async function ensureAndroidChannel() {
  if (Capacitor.getPlatform() !== 'android') return
  try {
    await LocalNotifications.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: 'Lesson reminders',
      description: 'Daily Italian Tracker lesson reminder',
      importance: 5,
      visibility: 1,
    })
  } catch {
    /* Channel may already exist */
  }
}

/** Device wall-clock hour:minute — not a UTC Date, so the time is timezone-stable. */
export async function scheduleLocalDailyReminder({
  hour,
  minute,
  title,
  body,
}: {
  hour: number
  minute: number
  title: string
  body: string
}) {
  await ensureAndroidChannel()
  await LocalNotifications.cancel({
    notifications: [{ id: LESSON_REMINDER_ID }],
  })
  await LocalNotifications.schedule({
    notifications: [
      {
        id: LESSON_REMINDER_ID,
        title,
        body,
        channelId: ANDROID_CHANNEL_ID,
        schedule: {
          on: { hour, minute },
          repeats: true,
          allowWhileIdle: true,
        },
      },
    ],
  })
}

export async function cancelLocalDailyReminder() {
  await LocalNotifications.cancel({
    notifications: [{ id: LESSON_REMINDER_ID }],
  })
}

function readStoredEnabled() {
  try {
    const raw = localStorage.getItem(STORAGE_ENABLED)
    if (raw === null) return null
    return JSON.parse(raw) === true
  } catch {
    return null
  }
}

function readStoredTime() {
  try {
    return localStorage.getItem(STORAGE_TIME)
  } catch {
    return null
  }
}

function writeStored(enabled: boolean, time: string) {
  try {
    localStorage.setItem(STORAGE_ENABLED, JSON.stringify(enabled))
    localStorage.setItem(STORAGE_TIME, time)
  } catch {
    /* private mode */
  }
}

function msUntilNext(hour: number, minute: number) {
  const now = new Date()
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0,
  )
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1)
  return next.getTime() - now.getTime()
}

function fireWebNotification() {
  try {
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    const stamp = new Date()
    const key = `${stamp.getFullYear()}-${stamp.getMonth()}-${stamp.getDate()}-${stamp.getHours()}-${stamp.getMinutes()}`
    if (localStorage.getItem(STORAGE_LAST_FIRE) === key) return
    localStorage.setItem(STORAGE_LAST_FIRE, key)
    new Notification(WEB_TITLE, { body: WEB_BODY, icon: WEB_ICON })
  } catch {
    /* LAN / no HTTPS — ignore */
  }
}

export default function ReminderSetting({
  remindersEnabled,
  reminderHour = 19,
  reminderMinute = 0,
  title,
  body,
  onToggleReminders,
  onReminderTimeChange,
}: ReminderSettingProps) {
  const { t } = useI18n()
  const reminderTitle = title || t('reminders.title')
  const reminderBody = body || t('reminders.body')
  const storedEnabled = readStoredEnabled()
  const storedTime = readStoredTime()
  const [isEnabled, setIsEnabled] = useState(
    storedEnabled ?? Boolean(remindersEnabled),
  )
  const [reminderTime, setReminderTime] = useState(
    storedTime || formatReminderTime(reminderHour, reminderMinute),
  )
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    if (storedEnabled === null) setIsEnabled(Boolean(remindersEnabled))
  }, [remindersEnabled, storedEnabled])

  useEffect(() => {
    if (!storedTime) setReminderTime(formatReminderTime(reminderHour, reminderMinute))
  }, [reminderHour, reminderMinute, storedTime])

  useEffect(() => {
    if (!isEnabled) return
    const { hour, minute } = parseReminderTime(reminderTime)
    let timer = window.setTimeout(function tick() {
      fireWebNotification()
      timer = window.setTimeout(tick, msUntilNext(hour, minute))
    }, msUntilNext(hour, minute))
    return () => window.clearTimeout(timer)
  }, [isEnabled, reminderTime])

  async function scheduleNative(timeValue: string) {
    const next = parseReminderTime(timeValue)
    await scheduleLocalDailyReminder({
      hour: next.hour,
      minute: next.minute,
      title: reminderTitle,
      body: reminderBody,
    })
  }

  function persistEnabled(nextState: boolean, timeValue = reminderTime) {
    setIsEnabled(nextState)
    writeStored(nextState, timeValue)
    onToggleReminders?.(nextState)
  }

  function tryWebPermission() {
    if (typeof Notification === 'undefined') return
    try {
      void Promise.resolve(Notification.requestPermission()).catch(() => {})
    } catch {
      /* unsupported */
    }
  }

  function handleToggle() {
    const nextState = !isEnabled
    persistEnabled(nextState)

    if (!nextState) {
      if (isNative) void cancelLocalDailyReminder()
      return
    }

    if (isNative) {
      void (async () => {
        try {
          await LocalNotifications.requestPermissions()
          await scheduleNative(reminderTime)
        } catch {
          /* Keep the bell on even if native scheduling fails */
        }
      })()
      return
    }

    tryWebPermission()
  }

  async function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    const newTime = event.target.value
    setReminderTime(newTime)
    writeStored(isEnabled, newTime)
    onReminderTimeChange?.(newTime)

    if (isEnabled && isNative) {
      try {
        await scheduleNative(newTime)
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="reminder-setting">
      <div className="reminder-setting__lead">
        <button
          className={`reminder-setting__bell${isEnabled ? ' is-on' : ''}`}
          type="button"
          onClick={handleToggle}
          aria-pressed={isEnabled}
          aria-label={isEnabled ? t('reminders.off') : t('reminders.on')}
        >
          {isEnabled ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
        <div className="reminder-setting__copy">
          <div className="reminder-setting__title">{t('reminders.toggle')}</div>
          <div className="reminder-setting__hint">
            {isEnabled ? t('reminders.dailyLocal') : t('reminders.off')}
          </div>
        </div>
      </div>

      <input
        className="reminder-setting__time"
        type="time"
        lang="en-GB"
        value={reminderTime}
        onChange={(event) => void handleTimeChange(event)}
        disabled={!isEnabled}
        aria-label={t('reminders.time')}
      />
    </div>
  )
}
