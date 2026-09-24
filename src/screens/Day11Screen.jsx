import ArcLessonScreen from './ArcLessonScreen.jsx'
import day11Json from '../content/day11.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day11Json, 11)

export default function Day11Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 12" {...props} />
}
