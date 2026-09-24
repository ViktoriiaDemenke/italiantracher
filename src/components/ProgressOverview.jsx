import { progressStats, TOTAL_DAYS } from '../progress.js'
import './Progress.css'

export default function ProgressOverview({ completedDays, streak }) {
  const { done, percent } = progressStats(completedDays)
  const streakCount = streak ?? 0

  return (
    <section className="progress-overview" aria-label="Прогрес челенджу">
      <div className="progress-overview__row">
        <p className="progress-overview__label">
          {done}/{TOTAL_DAYS} days completed • {percent}%
        </p>
        <span className="streak-badge" aria-label={`${streakCount} day streak`}>
          🔥 {streakCount} Day Streak
        </span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Загальний прогрес"
      >
        <span className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
