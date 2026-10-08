import { resolveContentText } from '../content/localize.js'

function uniqueDeck(items) {
  const seen = new Set()
  const deck = []
  for (const item of items) {
    const it = String(item.it ?? '').trim()
    const translation = String(item.translation ?? item.uk ?? '').trim()
    if (!it || !translation || seen.has(it)) continue
    seen.add(it)
    deck.push({
      it,
      translation,
      uk: translation,
      hint: String(item.hint ?? '').trim(),
      day: Number(item.day) || 0,
    })
  }
  return deck
}

export function shuffleList(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function phraseTranslation(phrase, locale) {
  return resolveContentText(
    phrase.translation ?? phrase.ukrainian ?? phrase.uk,
    locale,
  ).trim()
}

export function buildPracticeDeck(lesson, locale) {
  const day = Number(lesson.day) || 0
  const fromPhrases = (lesson.phrases ?? []).map((phrase) => ({
    it: phrase.italian,
    translation: phraseTranslation(phrase, locale),
    hint: resolveContentText(phrase.hint, locale),
    day,
  }))
  const fromDialogue = []
  for (const step of lesson.dialogue ?? []) {
    for (const option of step.options ?? []) {
      if (!(option.isCorrect || option.tone === 'natural')) continue
      const translation = phraseTranslation(option, locale)
      if (!option.text || !translation) continue
      fromDialogue.push({
        it: option.text,
        translation,
        hint: resolveContentText(option.hint, locale),
        day,
      })
    }
  }
  return uniqueDeck([...fromPhrases, ...fromDialogue])
}

function distractors(deck, correct, count = 3) {
  return shuffleList(
    [...new Set(deck.map((item) => item.translation).filter((value) => value && value !== correct))],
  ).slice(0, count)
}

export function buildMiniQuiz(deck, day) {
  const cards = uniqueDeck(deck).filter(
    (item) => item.translation && (!day || !item.day || item.day === day),
  )
  const questions = []

  for (const [index, card] of shuffleList(cards).entries()) {
    const wrong = distractors(cards, card.translation, 3)
    if (wrong.length === 0) continue
    while (wrong.length < 3 && wrong.length < cards.length - 1) {
      const extra = distractors(cards, card.translation, 3).find(
        (item) => !wrong.includes(item),
      )
      if (!extra) break
      wrong.push(extra)
    }
    const options = shuffleList([card.translation, ...wrong])
    questions.push({
      id: `day${card.day}-q${index}`,
      type: 'mc',
      prompt: card.it,
      speak: card.it,
      options,
      correctIndex: options.indexOf(card.translation),
      explain: card.translation,
    })
  }

  return questions
}
