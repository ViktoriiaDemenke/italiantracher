import { LOCALES, useI18n } from '../i18n.js'
import { formatReminderTime } from '../notifications.js'
import './Header.css'

export default function Header({
  remindersEnabled,
  reminderHour,
  reminderMinute,
  onToggleReminders,
  onReminderTimeChange,
}) {
  const { locale, setLocale, theme, setTheme, t } = useI18n()

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
        <label className="reminder-toggle">
          <input
            type="checkbox"
            checked={Boolean(remindersEnabled)}
            onChange={(event) => onToggleReminders?.(event.target.checked)}
          />
          <span>{t('reminders.toggle')}</span>
        </label>
        <label className="reminder-time">
          <input
            type="time"
            aria-label={t('reminders.time')}
            value={formatReminderTime(reminderHour ?? 19, reminderMinute ?? 0)}
            disabled={!remindersEnabled}
            onChange={(event) => onReminderTimeChange?.(event.target.value)}
          />
        </label>
      </div>
    </header>
  )
}
