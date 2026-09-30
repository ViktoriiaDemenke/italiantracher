import { useRef, useState } from 'react'
import { CANONICAL_MODULES } from '../data/modules'
import CycleNav, { MODULE_CYCLES } from '../components/CycleNav.jsx'
import SavedPhrasesSheet from '../components/SavedPhrasesSheet.jsx'
import ProgressOverview from '../components/ProgressOverview.jsx'
import DayGrid from '../components/DayGrid.jsx'
import { useI18n } from '../i18n.js'
import './HomeScreen.css'

export default function HomeScreen({
  state,
  onStart,
  onOpenDay,
  isUnlocked,
  onLockedDay,
  onOpenReview,
  onExport,
  onImportFile,
}) {
  const [phrasesOpen, setPhrasesOpen] = useState(false)
  const importRef = useRef(null)
  const savedPhrases = state.savedPhrases ?? []
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
          <button className="chip-btn" type="button" onClick={onExport}>
            {t('export')}
          </button>
          <button
            className="chip-btn"
            type="button"
            onClick={() => importRef.current?.click()}
          >
            {t('import')}
          </button>
          <input
            ref={importRef}
            className="home__import-input"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onImportFile?.(file)
              event.target.value = ''
            }}
          />
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
        currentDay={state.currentDay}
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
                    <p className="card__subtitle">{t(`module.${mod.id}`)}</p>
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

      <button
        className="fab"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={phrasesOpen}
        onClick={() => setPhrasesOpen(true)}
      >
        {t('savedPhrases')}
      </button>

      <SavedPhrasesSheet
        open={phrasesOpen}
        phrases={savedPhrases}
        onClose={() => setPhrasesOpen(false)}
      />
    </main>
  )
}
