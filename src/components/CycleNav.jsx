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
}

export default function CycleNav({ currentDay, onOpenDay, cycle = 'anagrafe' }) {
  const items = MODULE_CYCLES[cycle] ?? MODULE_CYCLES.anagrafe

  return (
    <nav className="cycle-nav" aria-label="Цикл модуля">
      {items.map((item) => (
        <button
          key={item.day}
          className={`cycle-nav__btn${currentDay === item.day ? ' cycle-nav__btn--on' : ''}`}
          type="button"
          onClick={() => onOpenDay(item.day)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
