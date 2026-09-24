import ArcLessonScreen from './ArcLessonScreen.jsx'
import day6Json from '../content/day6.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day6Json, 6)

export default function Day6Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="На головну" {...props} />
}
