import { shuffleList } from './practice.js'
import { resolveContentText } from '../content/localize.js'

export function isWrongChoice(option) {
  if (!option) return true
  return !(option.isCorrect || option.tone === 'natural')
}

export function shuffleQuestion(question) {
  const options = shuffleList([...(question.options ?? [])])
  const correctText = question.options?.[question.correctIndex]
  return {
    ...question,
    options,
    correctIndex: Math.max(options.indexOf(correctText), 0),
  }
}

export function fromDialogueStep(step, day, stepIndex, locale) {
  const choices = Array.isArray(step?.options) ? step.options : []
  if (choices.length < 2) return null
  const correctIndex = choices.findIndex(
    (option) => option.isCorrect || option.tone === 'natural',
  )
  if (correctIndex < 0) return null
  return shuffleQuestion({
    id: `dlg-${day}-${step.step ?? stepIndex}`,
    prompt: step.text,
    speak: step.text,
    options: choices.map((option) => option.text),
    correctIndex,
    explain:
      resolveContentText(choices[correctIndex]?.translation, locale) ||
      choices[correctIndex]?.text,
  })
}

export function fromBossQuestion(question, day, index, locale) {
  if (!question || !Array.isArray(question.options) || question.options.length < 2) {
    return null
  }
  return shuffleQuestion({
    id: `boss-${day}-${question.id ?? index}`,
    prompt: resolveContentText(question.question, locale),
    speak: question.options[question.correctAnswer],
    options: question.options,
    correctIndex: question.correctAnswer,
    explain:
      resolveContentText(question.explanation, locale) ||
      question.options[question.correctAnswer],
  })
}

export function upsertMistake(list, item) {
  if (!item?.id) return list
  if (list.some((entry) => entry.id === item.id)) return list
  return [...list, item]
}

export function removeMistake(list, id) {
  return list.filter((entry) => entry.id !== id)
}
