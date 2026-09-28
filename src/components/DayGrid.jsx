import { isDayCompleted, isDayUnlocked, TOTAL_DAYS } from '../progress.js'
import './Progress.css'

export default function DayGrid({
  completedDays,
  currentDay,
  onOpenDay,
  onLockedDay,
}) {
  const days = Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1)
  const isNewUser = (completedDays?.length ?? 0) === 0

  return (
    <section className="day-grid-wrap" aria-labelledby="roadmap-heading">
      <h2 id="roadmap-heading" className="home__section-title">
        30-Day Roadmap
      </h2>
      {isNewUser ? (
        <p className="day-grid__hint">
          Почніть з дня 1 — він уже відкритий. Решта днів з’являться після кожного
          пройденого уроку.
        </p>
      ) : null}
      <ol className="day-grid">
        {days.map((day) => {
          const done = isDayCompleted(day, completedDays)
          const unlocked = isDayUnlocked(day, completedDays)
          const active = currentDay === day && unlocked && !done
          const className = [
            'day-tile',
            done ? 'day-tile--done' : '',
            active ? 'day-tile--active' : '',
            !unlocked ? 'day-tile--locked' : '',
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
                    ? `День ${day}, пройдено`
                    : unlocked
                      ? `День ${day}`
                      : `День ${day}, заблоковано`
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
                {!unlocked ? (
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
