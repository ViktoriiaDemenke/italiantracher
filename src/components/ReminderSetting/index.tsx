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

type ReminderSettingProps = {
  remindersEnabled?: boolean
  reminderHour?: number
  reminderMinute?: number
  title?: string
  body?: string
  onToggleReminders?: (enabled: boolean) => void
  onReminderTimeChange?: (value: string) => void
  onDenied?: () => void
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

export default function ReminderSetting({
  remindersEnabled,
  reminderHour = 19,
  reminderMinute = 0,
  title,
  body,
  onToggleReminders,
  onReminderTimeChange,
  onDenied,
}: ReminderSettingProps) {
  const { t } = useI18n()
  const reminderTitle = title || t('reminders.title')
  const reminderBody = body || t('reminders.body')
  const [isEnabled, setIsEnabled] = useState(Boolean(remindersEnabled))
  const [reminderTime, setReminderTime] = useState(
    formatReminderTime(reminderHour, reminderMinute),
  )
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    setIsEnabled(Boolean(remindersEnabled))
  }, [remindersEnabled])

  useEffect(() => {
    setReminderTime(formatReminderTime(reminderHour, reminderMinute))
  }, [reminderHour, reminderMinute])

  async function scheduleNative(timeValue: string) {
    const next = parseReminderTime(timeValue)
    await scheduleLocalDailyReminder({
      hour: next.hour,
      minute: next.minute,
      title: reminderTitle,
      body: reminderBody,
    })
  }

  async function handleToggle() {
    const nextState = !isEnabled

    if (nextState) {
      if (isNative) {
        const permission = await LocalNotifications.requestPermissions()
        if (permission.display !== 'granted') {
          onDenied?.()
          return
        }
        await scheduleNative(reminderTime)
      } else {
        if (!('Notification' in window)) {
          onDenied?.()
          return
        }
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          onDenied?.()
          return
        }
        new Notification(reminderTitle, {
          body: `${t('reminders.on')} · ${reminderTime}`,
        })
      }
    } else if (isNative) {
      await cancelLocalDailyReminder()
    }

    setIsEnabled(nextState)
    onToggleReminders?.(nextState)
  }

  async function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    const newTime = event.target.value
    setReminderTime(newTime)
    onReminderTimeChange?.(newTime)

    if (isEnabled && isNative) {
      await scheduleNative(newTime)
    }
  }

  return (
    <div className="reminder-setting">
      <div className="reminder-setting__lead">
        <button
          className={`reminder-setting__bell${isEnabled ? ' is-on' : ''}`}
          type="button"
          onClick={() => void handleToggle()}
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
