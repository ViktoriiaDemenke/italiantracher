import { asTranslationMap } from './localize.js'

function asObject(raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  if (typeof raw !== 'string') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function asOptions(options) {
  if (!Array.isArray(options)) return []
  return options.map((option) => {
    if (typeof option === 'string') {
      return { text: option, tone: 'wrong', isCorrect: false, feedback: '', points: 0 }
    }
    const tone = option.tone ?? (option.isCorrect ? 'natural' : 'wrong')
    const points =
      option.points ?? (tone === 'natural' ? 10 : tone === 'bookish' ? 4 : 0)
    return {
      text: String(option.text ?? ''),
      tone,
      isCorrect: tone === 'natural' || Boolean(option.isCorrect),
      feedback: asTranslationMap(option.feedback),
      translation: asTranslationMap(option.translation ?? option.ukrainian),
      hint: asTranslationMap(option.hint),
      points,
    }
  })
}

function inferMode(data) {
  if (data.mode) return String(data.mode)
  const type = String(data.type ?? '')
  if (/Boss/i.test(type)) return 'boss'
  if (/Dialogue/i.test(type)) return 'dialogue'
  return 'immersion'
}

export function loadLesson(raw, fallbackDay) {
  const data = asObject(raw)
  const documents = Array.isArray(data.documents)
    ? data.documents
    : Array.isArray(data.documentsRequired)
      ? data.documentsRequired.map((item) =>
          typeof item === 'string'
            ? { item, ukrainian: asTranslationMap(''), translation: asTranslationMap('') }
            : {
                item: String(item.item ?? ''),
                ukrainian: asTranslationMap(item.ukrainian ?? item.translation),
                translation: asTranslationMap(item.translation ?? item.ukrainian),
              },
        )
      : []
  const phrases = Array.isArray(data.phrases)
    ? data.phrases.map((phrase, index) => ({
        ...phrase,
        italian: String(phrase.italian ?? ''),
        ukrainian: asTranslationMap(phrase.ukrainian ?? phrase.translation),
        translation: asTranslationMap(phrase.translation ?? phrase.ukrainian),
        hint: asTranslationMap(phrase.hint),
        audio_id: phrase.audio_id ?? `d${data.day ?? fallbackDay}_p${index + 1}`,
      }))
    : []

  return {
    day: fallbackDay ?? data.day,
    title: asTranslationMap(data.title),
    module: String(data.module ?? ''),
    type: asTranslationMap(data.type),
    story: asTranslationMap(data.story),
    mode: inferMode(data),
    phrases,
    documents,
    documentsRequired: Array.isArray(data.documentsRequired)
      ? data.documentsRequired
      : [],
    grammar: data.grammar ?? null,
    restaurantEtiquette: Array.isArray(data.restaurantEtiquette)
      ? data.restaurantEtiquette
      : [],
    housingNuances: Array.isArray(data.housingNuances)
      ? data.housingNuances
      : [],
    postOfficeTips: Array.isArray(data.postOfficeTips)
      ? data.postOfficeTips
      : [],
    patronatoTips: Array.isArray(data.patronatoTips)
      ? data.patronatoTips
      : [],
    barRules: Array.isArray(data.barRules) ? data.barRules : [],
    supermarketEtiquette: Array.isArray(data.supermarketEtiquette)
      ? data.supermarketEtiquette
      : [],
    transportTips: Array.isArray(data.transportTips)
      ? data.transportTips
      : [],
    beautyTips: Array.isArray(data.beautyTips) ? data.beautyTips : [],
    questions: Array.isArray(data.questions)
      ? data.questions.map((question) => ({
          ...question,
          question: asTranslationMap(question.question),
          explanation: asTranslationMap(question.explanation),
          options: Array.isArray(question.options) ? question.options : [],
        }))
      : [],
    culturaTip: asTranslationMap(data.culturaTip),
    successTitle: asTranslationMap(data.successTitle),
    successMessage: asTranslationMap(data.successMessage),
    successBadge: asTranslationMap(data.successBadge),
    dialogue: Array.isArray(data.dialogue)
      ? data.dialogue.map((step, index) => ({
          step: step.step ?? index + 1,
          speaker: String(step.speaker ?? ''),
          text: String(step.text ?? ''),
          translation: asTranslationMap(step.translation ?? step.ukrainian),
          options: asOptions(step.options),
        }))
      : [],
  }
}

export function maxScore(lesson) {
  if (lesson.questions.length > 0) return lesson.questions.length * 10
  return lesson.dialogue.length * 10
}

export function cycleIdForDay(day) {
  if (day >= 28 && day <= 30) return 'bellezza'
  if (day >= 25 && day <= 27) return 'trasporti'
  if (day >= 22 && day <= 24) return 'supermercato'
  if (day >= 19 && day <= 21) return 'bar'
  if (day >= 16 && day <= 18) return 'patronato'
  if (day >= 13 && day <= 15) return 'poste'
  if (day >= 10 && day <= 12) return 'casa'
  if (day >= 7 && day <= 9) return 'ristorante'
  if (day >= 4 && day <= 6) return 'asl'
  return 'anagrafe'
}
