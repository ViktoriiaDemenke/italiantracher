import { useI18n } from '../i18n.js'

export default function DayStepsNav({ stages, activeKind, onSelect }) {
  const { t } = useI18n()

  if (!stages.length) return null

  return (
    <nav className="cycle-nav" aria-label={t('dayStepsNav')}>
      {stages.map((stage, index) => (
        <button
          key={stage.kind}
          className={`cycle-nav__btn${activeKind === stage.kind ? ' cycle-nav__btn--on' : ''}`}
          type="button"
          onClick={() => onSelect(stage)}
        >
          {t(stage.labelKey, { n: index + 1 })}
        </button>
      ))}
    </nav>
  )
}
