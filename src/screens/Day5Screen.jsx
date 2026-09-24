import ArcLessonScreen from './ArcLessonScreen.jsx'
import day5Json from '../content/day5.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day5Json, 5)

export default function Day5Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 6" {...props} />
}
