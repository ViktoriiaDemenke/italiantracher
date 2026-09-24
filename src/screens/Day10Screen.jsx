import ArcLessonScreen from './ArcLessonScreen.jsx'
import day10Json from '../content/day10.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day10Json, 10)

export default function Day10Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 11" {...props} />
}
