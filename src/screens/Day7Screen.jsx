import ArcLessonScreen from './ArcLessonScreen.jsx'
import day7Json from '../content/day7.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day7Json, 7)

export default function Day7Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 8" {...props} />
}
