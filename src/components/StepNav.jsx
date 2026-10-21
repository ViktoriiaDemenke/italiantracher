import { useI18n } from '../i18n.js'
import './StepNav.css'

export default function StepNav({ index, total, canBack, canForward, onBack, onForward }) {
  const { t } = useI18n()
  return (
    <div className="step-nav" role="group" aria-label={t('stepNav')}>
      <button
        className="step-nav__btn"
        type="button"
        disabled={!canBack}
        aria-label={t('previous')}
        onClick={onBack}
      >
        ←
      </button>
      <span className="step-nav__count">
        {index + 1}/{total}
      </span>
      <button
        className="step-nav__btn"
        type="button"
        disabled={!canForward}
        aria-label={t('next')}
        onClick={onForward}
      >
        →
      </button>
    </div>
  )
}
