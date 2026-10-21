import { useEffect, useState } from 'react'
import { useI18n } from '../i18n.js'
import './AppSplash.css'

const HOLD_MS = 2000
const FADE_MS = 500

export default function AppSplash({ onDone }) {
  const { t } = useI18n()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const fadeId = window.setTimeout(() => setLeaving(true), HOLD_MS)
    const doneId = window.setTimeout(() => onDone?.(), HOLD_MS + FADE_MS)
    return () => {
      window.clearTimeout(fadeId)
      window.clearTimeout(doneId)
    }
  }, [onDone])

  return (
    <div
      className={`app-splash${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label={t('splash.brand')}
      aria-busy="true"
    >
      <div className="app-splash__mark" aria-hidden="true">
        <span className="app-splash__glow" />
        <span className="app-splash__badge">
          <img className="app-splash__logo" src="/icon.svg" alt="" />
        </span>
      </div>
      <h1 className="app-splash__title">{t('splash.brand')}</h1>
      <p className="app-splash__lead">{t('splash.subtitle')}</p>
      <div className="app-splash__bar" aria-hidden="true">
        <span className="app-splash__bar-fill" />
      </div>
    </div>
  )
}
