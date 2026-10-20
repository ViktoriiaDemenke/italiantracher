import { asTranslationMap, isItalianPrompt } from './localize.js'

function asObject(raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  if (typeof raw !== 'string') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function localizedText(value, extra) {
  return asTranslationMap(value ?? extra)
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
    const translations = localizedText(
      option.translations ?? option.translation ?? option.ukrainian,
    )
    return {
      text: String(option.text ?? ''),
      tone,
      isCorrect: tone === 'natural' || Boolean(option.isCorrect),
      feedback: localizedText(option.feedback),
      translations,
      translation: translations,
      hint: localizedText(option.hint),
      points,
    }
  })
}

function asQuizOptions(options) {
  if (!Array.isArray(options)) return []
  return options.map((option) => {
    if (typeof option === 'string') {
      if (isItalianPrompt(option)) return option
      const translations = localizedText({ uk: option })
      return { translations, translation: translations }
    }
    const translations = localizedText(
      option.translations ?? option.translation ?? option,
    )
    if (typeof option.text === 'string' && isItalianPrompt(option.text)) {
      return option.text
    }
    return { ...option, translations, translation: translations }
  })
}

function asTipList(items) {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    if (typeof item === 'string') {
      return isItalianPrompt(item) ? item : localizedText({ uk: item })
    }
    return localizedText(item)
  })
}

function inferMode(data) {
  if (data.mode) return String(data.mode)
  const blob = JSON.stringify({ type: data.type, title: data.title, story: data.story })
  if (/Boss/i.test(blob)) return 'boss'
  if (/Dialogue|Діалог/i.test(blob)) return 'dialogue'
  return 'immersion'
}

export function loadLesson(raw, fallbackDay) {
  const data = asObject(raw)
  const documents = Array.isArray(data.documents)
    ? data.documents.map((item) =>
        typeof item === 'string'
          ? {
              item,
              translations: localizedText(''),
              translation: localizedText(''),
            }
          : {
              item: String(item.item ?? ''),
              translations: localizedText(
                item.translations ?? item.translation ?? item.ukrainian,
              ),
              translation: localizedText(
                item.translations ?? item.translation ?? item.ukrainian,
              ),
            },
      )
    : Array.isArray(data.documentsRequired)
      ? data.documentsRequired.map((item) =>
          typeof item === 'string'
            ? {
                item,
                translations: localizedText(''),
                translation: localizedText(''),
              }
            : {
                item: String(item.item ?? ''),
                translations: localizedText(
                  item.translations ?? item.translation ?? item.ukrainian,
                ),
                translation: localizedText(
                  item.translations ?? item.translation ?? item.ukrainian,
                ),
              },
        )
      : []
  const phrases = Array.isArray(data.phrases)
    ? data.phrases.map((phrase, index) => {
        const translations = localizedText(
          phrase.translations ?? phrase.translation ?? phrase.ukrainian,
        )
        return {
          ...phrase,
          italian: String(phrase.italian ?? ''),
          translations,
          translation: translations,
          hint: localizedText(phrase.hint),
          audio_id: phrase.audio_id ?? `d${data.day ?? fallbackDay}_p${index + 1}`,
        }
      })
    : []

  const grammar = data.grammar
    ? {
        ...data.grammar,
        title: localizedText(data.grammar.title),
        rules: Array.isArray(data.grammar.rules)
          ? data.grammar.rules.map((item) => ({
              ...item,
              rule: localizedText(item.rule),
              examples: Array.isArray(item.examples)
                ? item.examples.map((example) =>
                    typeof example === 'string'
                      ? example
                      : {
                          ...example,
                          italian: String(example.italian ?? ''),
                          translations: localizedText(
                            example.translations ??
                              example.translation ??
                              example.ukrainian,
                          ),
                          translation: localizedText(
                            example.translations ??
                              example.translation ??
                              example.ukrainian,
                          ),
                        },
                  )
                : [],
            }))
          : [],
      }
    : null

  return {
    day: fallbackDay ?? data.day,
    title: localizedText(data.title),
    module: String(data.module ?? ''),
    type: localizedText(data.type),
    story: localizedText(data.story),
    mode: inferMode(data),
    phrases,
    documents,
    documentsRequired: Array.isArray(data.documentsRequired)
      ? data.documentsRequired
      : [],
    grammar,
    restaurantEtiquette: asTipList(data.restaurantEtiquette),
    housingNuances: asTipList(data.housingNuances),
    postOfficeTips: asTipList(data.postOfficeTips),
    patronatoTips: asTipList(data.patronatoTips),
    barRules: asTipList(data.barRules),
    supermarketEtiquette: asTipList(data.supermarketEtiquette),
    transportTips: asTipList(data.transportTips),
    beautyTips: asTipList(data.beautyTips),
    questions: Array.isArray(data.questions)
      ? data.questions.map((question) => ({
          ...question,
          question: localizedText(question.question),
          explanation: localizedText(question.explanation),
          options: asQuizOptions(question.options),
        }))
      : [],
    culturaTip: localizedText(data.culturaTip),
    successTitle: localizedText(data.successTitle),
    successMessage: localizedText(data.successMessage),
    successBadge: localizedText(data.successBadge),
    dialogue: Array.isArray(data.dialogue)
      ? data.dialogue.map((step, index) => ({
          step: step.step ?? index + 1,
          speaker: String(step.speaker ?? ''),
          text: String(step.text ?? ''),
          translations: localizedText(step.translations ?? step.translation ?? step.ukrainian),
          translation: localizedText(step.translations ?? step.translation ?? step.ukrainian),
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
