import { CANONICAL_MODULES } from '../data/modules'
import CycleNav, { MODULE_CYCLES } from '../components/CycleNav.jsx'
import ProgressOverview from '../components/ProgressOverview.jsx'
import DayGrid from '../components/DayGrid.jsx'
import { PAYWALL_ENABLED } from '../progress.js'
import { useI18n } from '../i18n.js'
import './HomeScreen.css'

export default function HomeScreen({
  state,
  onStart,
  onOpenDay,
  isUnlocked,
  onLockedDay,
  onOpenReview,
  onOpenPaywall,
}) {
  const { t } = useI18n()

  function openModule(mod) {
    const days = MODULE_CYCLES[mod.id] ?? []
    const target = days.find((day) => isUnlocked?.(day))
    if (target) {
      onOpenDay(target)
      return
    }
    onLockedDay?.()
  }

  return (
    <main className="home">
      <header className="home__hero">
        <span className="badge">{t('challengeBadge')}</span>
        <h1 className="home__title">{t('appName')}</h1>
        <p className="home__lead">{t('lead')}</p>
        <div className="home__toolbar">
          <button className="chip-btn" type="button" onClick={onOpenReview}>
            {t('review')}
          </button>
          {PAYWALL_ENABLED && !state.isPremium ? (
            <button className="chip-btn" type="button" onClick={onOpenPaywall}>
              {t('paywall.badge')}
            </button>
          ) : null}
        </div>
        <ProgressOverview
          completedDays={state.completedDays}
          streak={state.streak}
        />
        <button className="btn-primary" type="button" onClick={onStart}>
          {t('start')}
        </button>
      </header>

      <DayGrid
        completedDays={state.completedDays}
        unlockedDays={state.unlockedDays}
        currentDay={state.currentDay}
        isPremium={Boolean(state.isPremium)}
        onOpenDay={onOpenDay}
        onLockedDay={onLockedDay}
      />

      <section className="home__modules" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="home__section-title">
          {t('modules')}
        </h2>
        <ul className="module-list">
          {CANONICAL_MODULES.map((mod, index) => (
            <li key={mod.id} className="card">
              <div>
                <button
                  className="card__launch"
                  type="button"
                  onClick={() => openModule(mod)}
                >
                  <span className="card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <h3 className="card__title">{mod.title}</h3>
                    <p className="card__subtitle">{t(mod.subtitleKey)}</p>
                  </span>
                </button>
                {MODULE_CYCLES[mod.id] ? (
                  <CycleNav
                    cycle={mod.id}
                    currentDay={state.currentDay}
                    onOpenDay={onOpenDay}
                    isUnlocked={isUnlocked}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

    </main>
  )
}
