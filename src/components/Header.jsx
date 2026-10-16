import { useState } from 'react'
import { LOCALES, useI18n } from '../i18n.js'
import { formatReminderTime } from '../notifications.js'
import SavedPhrasesSheet from './SavedPhrasesSheet.jsx'
import './Header.css'
import '../screens/HomeScreen.css'

export default function Header({
  remindersEnabled,
  reminderHour,
  reminderMinute,
  onToggleReminders,
  onReminderTimeChange,
  savedPhrases = [],
}) {
  const { locale, setLocale, theme, setTheme, t } = useI18n()
  const [phrasesOpen, setPhrasesOpen] = useState(false)
  const enabled = Boolean(remindersEnabled)
  const timeValue = formatReminderTime(reminderHour ?? 19, reminderMinute ?? 0)

  function handleTimeActivate(event) {
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
    <header className="app-header">
      <p className="app-header__brand">{t('appName')}</p>
      <div className="app-header__controls">
        <div className="lang-switch" role="group" aria-label={t('lang')}>
          {LOCALES.map((item) => (
            <button
              key={item.id}
              className={`chip-btn lang-switch__chip${locale === item.id ? ' chip-btn--on' : ''}`}
              type="button"
              aria-pressed={locale === item.id}
              onClick={() => setLocale(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          className="chip-btn theme-switch"
          type="button"
          aria-pressed={theme === 'light'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? t('themeDark') : t('themeLight')}
        </button>
        <button
          className="chip-btn"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={phrasesOpen}
          onClick={() => setPhrasesOpen(true)}
        >
          {t('savedPhrases')}
        </button>
        <div className="reminder-section">
          <label className="reminder-toggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => onToggleReminders?.(event.target.checked)}
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
            <span className="reminder-toggle__text">{t('reminders.toggle')}</span>
          </label>
          <label
            className={`reminder-section__time-wrap${enabled ? '' : ' is-disabled'}`}
          >
            <span className="reminder-section__time-face" aria-hidden="true">
              {timeValue}
            </span>
            <input
              className="reminder-section__time"
              type="time"
              lang="en-GB"
              aria-label={t('reminders.time')}
              value={timeValue}
              tabIndex={enabled ? 0 : -1}
              onChange={(event) => onReminderTimeChange?.(event.target.value)}
              onPointerUp={handleTimeActivate}
            />
          </label>
        </div>
      </div>
      <SavedPhrasesSheet
        open={phrasesOpen}
        phrases={savedPhrases}
        onClose={() => setPhrasesOpen(false)}
      />
    </header>
  )
}
