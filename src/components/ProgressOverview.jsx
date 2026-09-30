import { progressStats, TOTAL_DAYS } from '../progress.js'
import { useI18n } from '../i18n.js'
import './Progress.css'

export default function ProgressOverview({ completedDays, streak }) {
  const { t } = useI18n()
  const { done, percent } = progressStats(completedDays)
  const streakCount = streak ?? 0

  return (
    <section className="progress-overview" aria-label={t('progressAria')}>
      <div className="progress-overview__row">
        <p className="progress-overview__label">
          {t('progressLabel', { done, total: TOTAL_DAYS, percent })}
        </p>
        <span className="streak-badge" aria-label={t('streak', { count: streakCount })}>
          {t('streak', { count: streakCount })}
        </span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={t('overallProgress')}
      >
        <span className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
