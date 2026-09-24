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
      feedback: String(option.feedback ?? ''),
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
      ? data.documentsRequired.map((item) => ({ item, ukrainian: '' }))
      : []
  const phrases = Array.isArray(data.phrases)
    ? data.phrases.map((phrase, index) => ({
        ...phrase,
        audio_id: phrase.audio_id ?? `d${data.day ?? fallbackDay}_p${index + 1}`,
      }))
    : []

  return {
    day: data.day ?? fallbackDay,
    title: String(data.title ?? ''),
    module: String(data.module ?? ''),
    type: String(data.type ?? ''),
    story: String(data.story ?? ''),
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
    questions: Array.isArray(data.questions) ? data.questions : [],
    culturaTip: String(data.culturaTip ?? ''),
    successTitle: String(data.successTitle ?? ''),
    successMessage: String(data.successMessage ?? ''),
    successBadge: String(data.successBadge ?? ''),
    dialogue: Array.isArray(data.dialogue)
      ? data.dialogue.map((step, index) => ({
          step: step.step ?? index + 1,
          speaker: String(step.speaker ?? ''),
          text: String(step.text ?? ''),
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
  if (day >= 10 && day <= 12) return 'casa'
  if (day >= 7 && day <= 9) return 'ristorante'
  if (day >= 4 && day <= 6) return 'asl'
  return 'anagrafe'
}
