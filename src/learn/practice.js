function uniqueDeck(items) {
  const seen = new Set()
  const deck = []
  for (const item of items) {
    const it = String(item.it ?? '').trim()
    if (!it || seen.has(it)) continue
    seen.add(it)
    deck.push({
      it,
      uk: String(item.uk ?? '').trim(),
      context: String(item.context ?? '').trim(),
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

export function buildPracticeDeck(lesson) {
  const items = []
  for (const phrase of lesson.phrases ?? []) {
    items.push({
      it: phrase.italian,
      uk: phrase.ukrainian,
      context: lesson.module || 'Фраза дня',
    })
  }
  for (const doc of lesson.documents ?? []) {
    items.push({
      it: doc.item,
      uk: doc.ukrainian,
      context: 'Документ / термін',
    })
  }
  for (const step of lesson.dialogue ?? []) {
    items.push({
      it: step.text,
      uk: `${step.speaker}`,
      context: 'Репліка діалогу',
    })
    const correct = (step.options ?? []).find((option) => option.isCorrect)
    if (correct) {
      items.push({
        it: correct.text,
        uk: correct.feedback || 'Правильна відповідь у діалозі',
        context: step.speaker,
      })
    }
  }
  for (const rule of lesson.grammar?.rules ?? []) {
    for (const example of rule.examples ?? []) {
      items.push({
        it: example,
        uk: rule.rule,
        context: lesson.grammar.title,
      })
    }
  }
  return uniqueDeck(items)
}

function italianTokens(text) {
  return String(text)
    .split(/[\s',.!?…]+/)
    .map((token) => token.replace(/^[«"“]+|[»"”]+$/g, ''))
    .filter((token) => token.length >= 4)
}

function otherValues(deck, field, except) {
  return deck
    .map((item) => item[field])
    .filter((value) => value && value !== except)
}

function mcOptions(correct, extras) {
  const pool = shuffleList([...new Set(extras.filter(Boolean))])
  const options = shuffleList([correct, ...pool.slice(0, 2)].filter(Boolean))
  if (options.length < 2 || !options.includes(correct)) {
    return { options: [], correctIndex: -1 }
  }
  return {
    options,
    correctIndex: options.indexOf(correct),
  }
}

export function buildMiniQuiz(deck, lesson) {
  const questions = []
  const withUk = deck.filter((item) => item.uk)
  const phrase = withUk[0] ?? deck[0]

  if (phrase?.uk) {
    const { options, correctIndex } = mcOptions(
      phrase.uk,
      otherValues(withUk, 'uk', phrase.uk),
    )
    if (options.length >= 2 && correctIndex >= 0) {
      questions.push({
        id: 'mc-uk',
        type: 'mc',
        prompt: `Оберіть переклад: «${phrase.it}»`,
        options,
        correctIndex,
        speak: phrase.it,
      })
    }
  }

  const blankSource = deck.find((item) => italianTokens(item.it).length >= 2) ?? deck[1]
  if (blankSource) {
    const tokens = italianTokens(blankSource.it)
    const missing = tokens[Math.min(1, tokens.length - 1)]
    const extras = deck
      .flatMap((item) => italianTokens(item.it))
      .filter((token) => token.toLowerCase() !== missing.toLowerCase())
    const { options, correctIndex } = mcOptions(missing, extras)
    if (missing && options.length >= 2 && correctIndex >= 0) {
      questions.push({
        id: 'blank',
        type: 'blank',
        prompt: `Вставте пропущене слово: «${blankSource.it.replace(missing, '______')}»`,
        options,
        correctIndex,
        speak: blankSource.it,
      })
    }
  }

  const dialogueStep = (lesson.dialogue ?? []).find(
    (step) => (step.options ?? []).length >= 2,
  )
  if (dialogueStep) {
    const correct = dialogueStep.options.find((option) => option.isCorrect)
    const options = dialogueStep.options.map((option) => option.text)
    const correctIndex = options.findIndex((text) => text === correct?.text)
    if (correct && correctIndex >= 0) {
      questions.push({
        id: 'dialogue',
        type: 'mc',
        prompt: `${dialogueStep.speaker}: «${dialogueStep.text}» — оберіть відповідь.`,
        options,
        correctIndex,
        speak: dialogueStep.text,
      })
    }
  }

  const unique = []
  const seen = new Set()
  for (const question of questions) {
    if (seen.has(question.id)) continue
    seen.add(question.id)
    unique.push(question)
  }
  return unique.slice(0, 3)
}
