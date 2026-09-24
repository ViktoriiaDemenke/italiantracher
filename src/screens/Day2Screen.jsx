import ArcLessonScreen from './ArcLessonScreen.jsx'
import day2Json from '../content/day2.json'
import { loadLesson } from '../content/loadLesson.js'

const lesson = loadLesson(day2Json, 2)

export default function Day2Screen(props) {
  return <ArcLessonScreen lesson={lesson} continueLabel="Boss Level" {...props} />
}
