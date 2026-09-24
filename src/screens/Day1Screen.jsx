import ArcLessonScreen from './ArcLessonScreen.jsx'
import day1Json from '../content/day1.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day1Json, 1)

export default function Day1Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="День 2" {...props} />
}
