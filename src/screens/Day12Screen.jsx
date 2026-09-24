import ArcLessonScreen from './ArcLessonScreen.jsx'
import day12Json from '../content/day12.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day12Json, 12)

export default function Day12Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="На головну" {...props} />
}
