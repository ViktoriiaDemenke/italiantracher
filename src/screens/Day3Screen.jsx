import ArcLessonScreen from './ArcLessonScreen.jsx'
import day3Json from '../content/day3.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day3Json, 3)

export default function Day3Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="На головну" {...props} />
}
