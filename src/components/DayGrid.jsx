import { isDayCompleted, isDayUnlocked, TOTAL_DAYS } from '../progress.js'
import './Progress.css'

export default function DayGrid({ completedDays, currentDay, onOpenDay }) {
  const days = Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1)

  return (
    <section className="day-grid-wrap" aria-labelledby="roadmap-heading">
      <h2 id="roadmap-heading" className="home__section-title">
        30-Day Roadmap
      </h2>
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
                disabled={!unlocked}
                aria-label={
                  done
                    ? `День ${day}, пройдено`
                    : unlocked
                      ? `День ${day}`
                      : `День ${day}, заблоковано`
                }
                onClick={() => unlocked && onOpenDay(day)}
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
