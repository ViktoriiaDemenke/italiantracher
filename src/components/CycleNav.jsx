export const MODULE_CYCLES = {
  anagrafe: [
    { day: 1, label: 'День 1 · Immersion' },
    { day: 2, label: 'День 2 · Dialogue' },
    { day: 3, label: 'День 3 · Boss Level' },
  ],
  asl: [
    { day: 4, label: 'День 4 · Immersion' },
    { day: 5, label: 'День 5 · Dialogue' },
    { day: 6, label: 'День 6 · Boss Level' },
  ],
  ristorante: [
    { day: 7, label: 'День 7 · Immersion' },
    { day: 8, label: 'День 8 · Dialogue' },
    { day: 9, label: 'День 9 · Boss Level' },
  ],
  casa: [
    { day: 10, label: 'День 10 · Immersion' },
    { day: 11, label: 'День 11 · Dialogue' },
    { day: 12, label: 'День 12 · Boss Level' },
  ],
  poste: [
    { day: 13, label: 'День 13 · Immersion' },
    { day: 14, label: 'День 14 · Dialogue' },
    { day: 15, label: 'День 15 · Boss Level' },
  ],
  patronato: [
    { day: 16, label: 'День 16 · Immersion' },
    { day: 17, label: 'День 17 · Dialogue' },
    { day: 18, label: 'День 18 · Boss Level' },
  ],
  bar: [
    { day: 19, label: 'День 19 · Immersion' },
    { day: 20, label: 'День 20 · Dialogue' },
    { day: 21, label: 'День 21 · Boss Level' },
  ],
  supermercato: [
    { day: 22, label: 'День 22 · Immersion' },
    { day: 23, label: 'День 23 · Dialogue' },
    { day: 24, label: 'День 24 · Boss Level' },
  ],
  trasporti: [
    { day: 25, label: 'День 25 · Immersion' },
    { day: 26, label: 'День 26 · Dialogue' },
    { day: 27, label: 'День 27 · Boss Level' },
  ],
  bellezza: [
    { day: 28, label: 'День 28 · Immersion' },
    { day: 29, label: 'День 29 · Dialogue' },
    { day: 30, label: 'День 30 · Boss Level' },
  ],
}

export default function CycleNav({
  currentDay,
  onOpenDay,
  cycle = 'anagrafe',
  isUnlocked,
}) {
  const items = MODULE_CYCLES[cycle] ?? MODULE_CYCLES.anagrafe

  return (
    <nav className="cycle-nav" aria-label="Цикл модуля">
      {items.map((item) => {
        const locked = isUnlocked ? !isUnlocked(item.day) : false
        return (
          <button
            key={item.day}
            className={`cycle-nav__btn${currentDay === item.day ? ' cycle-nav__btn--on' : ''}${locked ? ' cycle-nav__btn--locked' : ''}`}
            type="button"
            disabled={locked}
            onClick={() => !locked && onOpenDay(item.day)}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
