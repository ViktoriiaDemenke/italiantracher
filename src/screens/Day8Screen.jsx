import ArcLessonScreen from './ArcLessonScreen.jsx'
import day8Json from '../content/day8.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day8Json, 8)

export default function Day8Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 9" {...props} />
}
