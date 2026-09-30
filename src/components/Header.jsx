import { LOCALES, useI18n } from '../i18n.js'
import './Header.css'

export default function Header() {
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
      </div>
    </header>
  )
}
