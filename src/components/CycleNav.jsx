import { useI18n } from '../i18n.js'

export const SUPER_QUEST_DAYS = [7, 14, 21, 28]

export const MODULE_CYCLES = {
  anagrafe: [1, 2, 3],
  asl: [4, 5, 6],
  ristorante: [7, 8, 9],
  casa: [10, 11, 12],
  poste: [13, 14, 15],
  patronato: [16, 17, 18],
  bar: [19, 20, 21],
  supermercato: [22, 23, 24],
  trasporti: [25, 26, 27],
  bellezza: [28, 29, 30],
}

function kindForDay(day) {
  const slot = (day - 1) % 3
  if (slot === 0) return 'immersion'
  if (slot === 1) return 'dialogue'
  return 'boss'
}

export default function CycleNav({
  currentDay,
  onOpenDay,
  cycle = 'anagrafe',
  isUnlocked,
}) {
  const { t } = useI18n()
  const days = MODULE_CYCLES[cycle] ?? MODULE_CYCLES.anagrafe

  return (
    <nav className="cycle-nav" aria-label={t('cycleNav')}>
      {days.map((day) => {
        const locked = isUnlocked ? !isUnlocked(day) : false
        const quest = SUPER_QUEST_DAYS.includes(day)
        const kind = t(`kind.${kindForDay(day)}`)
        return (
          <button
            key={day}
            className={`cycle-nav__btn${currentDay === day ? ' cycle-nav__btn--on' : ''}${locked ? ' cycle-nav__btn--locked' : ''}${quest ? ' cycle-nav__btn--quest' : ''}`}
            type="button"
            aria-disabled={locked}
            onClick={() => onOpenDay(day)}
          >
            <span>{t('cycleLabel', { day, kind })}</span>
            {quest ? <span className="cycle-nav__quest">{t('superQuest')}</span> : null}
          </button>
        )
      })}
    </nav>
  )
}
