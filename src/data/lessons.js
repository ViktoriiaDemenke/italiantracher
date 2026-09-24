import day1 from '../content/day1.json'
import day2 from '../content/day2.json'
import day3 from '../content/day3.json'
import day4 from '../content/day4.json'
import day5 from '../content/day5.json'
import day6 from '../content/day6.json'
import day7 from '../content/day7.json'
import day8 from '../content/day8.json'
import day9 from '../content/day9.json'
import day10 from '../content/day10.json'
import day11 from '../content/day11.json'
import day12 from '../content/day12.json'
import day13 from '../content/day13.json'
import day14 from '../content/day14.json'
import day15 from '../content/day15.json'
import day16 from '../content/day16.json'
import day17 from '../content/day17.json'
import day18 from '../content/day18.json'
import day19 from '../content/day19.json'
import day20 from '../content/day20.json'
import day21 from '../content/day21.json'
import day22 from '../content/day22.json'
import day23 from '../content/day23.json'
import day24 from '../content/day24.json'
import day25 from '../content/day25.json'
import day26 from '../content/day26.json'
import day27 from '../content/day27.json'
import day28 from '../content/day28.json'
import day29 from '../content/day29.json'
import day30 from '../content/day30.json'
import { loadLesson } from '../content/loadLesson.js'

const RAW_BY_DAY = {
  1: day1,
  2: day2,
  3: day3,
  4: day4,
  5: day5,
  6: day6,
  7: day7,
  8: day8,
  9: day9,
  10: day10,
  11: day11,
  12: day12,
  13: day13,
  14: day14,
  15: day15,
  16: day16,
  17: day17,
  18: day18,
  19: day19,
  20: day20,
  21: day21,
  22: day22,
  23: day23,
  24: day24,
  25: day25,
  26: day26,
  27: day27,
  28: day28,
  29: day29,
  30: day30,
}

export const LESSONS = Object.fromEntries(
  Object.entries(RAW_BY_DAY).map(([day, raw]) => {
    const number = Number(day)
    return [number, loadLesson(raw, number)]
  }),
)

export const OPEN_DAYS = Object.keys(LESSONS)
  .map(Number)
  .sort((a, b) => a - b)

export function getLesson(day) {
  return LESSONS[day] ?? null
}

export function nextAfter(day) {
  const index = OPEN_DAYS.indexOf(day)
  const nextDay = OPEN_DAYS[index + 1]
  if (!nextDay) {
    return { screen: 'home', day, label: 'На головну' }
  }
  return {
    screen: `day${nextDay}`,
    day: nextDay,
    label: `День ${nextDay}`,
  }
}
