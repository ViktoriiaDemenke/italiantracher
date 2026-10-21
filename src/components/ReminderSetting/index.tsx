import { Bell, Clock } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { useI18n } from '../../i18n.js'
import {
  LESSON_REMINDER_ID,
  formatReminderTime,
  parseReminderTime,
} from '../../notifications.js'

const ANDROID_CHANNEL_ID = 'lesson-reminders'

type ReminderSettingProps = {
  remindersEnabled?: boolean
  reminderHour?: number
  reminderMinute?: number
  title?: string
  body?: string
  onToggleReminders?: (enabled: boolean) => void
  onReminderTimeChange?: (value: string) => void
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

/**
 * Schedules a repeating local notification at a wall-clock hour:minute
 * on the device. Uses Capacitor `schedule.on` (not a UTC Date), so the
 * reminder stays at 19:00 (or the chosen time) in whatever timezone the
 * phone is in.
 */
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
  const enabled = Boolean(remindersEnabled)
  const timeValue = formatReminderTime(reminderHour, reminderMinute)
  const reminderTitle = title || t('reminders.title')
  const reminderBody = body || t('reminders.body')

  async function applyNativeSchedule(nextEnabled: boolean, hour: number, minute: number) {
    if (!Capacitor.isNativePlatform()) return
    try {
      if (!nextEnabled) {
        await cancelLocalDailyReminder()
        return
      }
      await scheduleLocalDailyReminder({
        hour,
        minute,
        title: reminderTitle,
        body: reminderBody,
      })
    } catch {
      /* Web / missing plugin */
    }
  }

  function handleTimeActivate(event: { preventDefault: () => void; currentTarget: HTMLInputElement }) {
    if (!enabled) {
      event.preventDefault()
      return
    }
    const input = event.currentTarget
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
      } catch {
        input.focus()
      }
    }
  }

  return (
    <div className="reminder-section">
      <label className="reminder-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            const next = event.target.checked
            onToggleReminders?.(next)
            void applyNativeSchedule(next, reminderHour, reminderMinute)
          }}
        />
        <span className="reminder-toggle__box" aria-hidden="true">
          <svg
            className="reminder-toggle__check"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.2 8.4 6.3 11.6 12.8 4.4" />
          </svg>
        </span>
        <Bell size={16} aria-hidden="true" />
        <span className="reminder-toggle__text">{t('reminders.toggle')}</span>
      </label>
      <label className={`reminder-section__time-wrap${enabled ? '' : ' is-disabled'}`}>
        <span className="reminder-section__time-face" aria-hidden="true">
          <Clock size={14} aria-hidden="true" /> {timeValue}
        </span>
        <input
          className="reminder-section__time"
          type="time"
          lang="en-GB"
          aria-label={t('reminders.time')}
          value={timeValue}
          tabIndex={enabled ? 0 : -1}
          onChange={(event) => {
            const value = event.target.value
            const next = parseReminderTime(value)
            onReminderTimeChange?.(value)
            if (enabled) {
              void applyNativeSchedule(true, next.hour, next.minute)
            }
          }}
          onPointerUp={handleTimeActivate}
        />
      </label>
    </div>
  )
}
