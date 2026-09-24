import ArcLessonScreen from './ArcLessonScreen.jsx'
import day9Json from '../content/day9.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day9Json, 9)

export default function Day9Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="На головну" {...props} />
}
