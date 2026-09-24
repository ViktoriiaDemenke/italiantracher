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
