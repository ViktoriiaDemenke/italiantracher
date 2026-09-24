import ArcLessonScreen from './ArcLessonScreen.jsx'
import day4Json from '../content/day4.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day4Json, 4)

export default function Day4Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 5" {...props} />
}
