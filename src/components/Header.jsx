import { useState } from 'react'
import { LOCALES, useI18n } from '../i18n.js'
import SavedPhrasesSheet from './SavedPhrasesSheet.jsx'
import ReminderSetting from './ReminderSetting'
import './Header.css'
import '../screens/HomeScreen.css'

export default function Header({
  remindersEnabled,
  reminderHour,
  reminderMinute,
  onToggleReminders,
  onReminderTimeChange,
  onReminderDenied,
  savedPhrases = [],
}) {
  const { locale, setLocale, theme, setTheme, t } = useI18n()
  const [phrasesOpen, setPhrasesOpen] = useState(false)

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
        <ReminderSetting
          remindersEnabled={remindersEnabled}
          reminderHour={reminderHour}
          reminderMinute={reminderMinute}
          title={t('reminders.title')}
          body={t('reminders.body')}
          onToggleReminders={onToggleReminders}
          onReminderTimeChange={onReminderTimeChange}
          onDenied={onReminderDenied}
        />
      </div>
      <SavedPhrasesSheet
        open={phrasesOpen}
        phrases={savedPhrases}
        onClose={() => setPhrasesOpen(false)}
      />
    </header>
  )
}
