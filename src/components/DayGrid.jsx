import {
  isDayCompleted,
  isDayUnlocked,
  needsPremium,
  TOTAL_DAYS,
} from '../progress.js'
import { useI18n } from '../i18n.js'
import './Progress.css'

export default function DayGrid({
  completedDays,
  unlockedDays,
  currentDay,
  isPremium,
  onOpenDay,
  onLockedDay,
}) {
  const { t } = useI18n()
  const days = Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1)
  const isNewUser = (completedDays?.length ?? 0) === 0

  return (
    <section className="day-grid-wrap" aria-labelledby="roadmap-heading">
      <h2 id="roadmap-heading" className="home__section-title">
        {t('roadmap')}
      </h2>
      {isNewUser ? <p className="day-grid__hint">{t('roadmapHint')}</p> : null}
      <ol className="day-grid">
        {days.map((day) => {
          const done = isDayCompleted(day, completedDays)
          const unlocked = isDayUnlocked(day, completedDays, unlockedDays)
          const premiumGate = unlocked && needsPremium(day) && !isPremium
          const active = currentDay === day && unlocked && !done && !premiumGate
          const className = [
            'day-tile',
            done ? 'day-tile--done' : '',
            active ? 'day-tile--active' : '',
            !unlocked || premiumGate ? 'day-tile--locked' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={day}>
              <button
                className={className}
                type="button"
                aria-disabled={!unlocked}
                aria-label={
                  done
                    ? t('dayDone', { day })
                    : premiumGate
                      ? t('paywallLocked')
                      : unlocked
                        ? t('dayN', { day })
                        : t('dayLocked', { day })
                }
                onClick={() => {
                  if (!unlocked) {
                    onLockedDay?.()
                    return
                  }
                  onOpenDay(day)
                }}
              >
                {done ? (
                  <span className="day-tile__mark" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
                {!unlocked || premiumGate ? (
                  <span className="day-tile__mark" aria-hidden="true">
                    🔒
                  </span>
                ) : null}
                <span className="day-tile__num">{day}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
