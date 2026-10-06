function nonempty(list) {
  return Array.isArray(list) && list.length > 0
}

export function lessonHasText(lesson) {
  return Boolean(
    lesson.story ||
      lesson.culturaTip ||
      lesson.grammar ||
      nonempty(lesson.phrases) ||
      nonempty(lesson.documents) ||
      nonempty(lesson.documentsRequired) ||
      nonempty(lesson.restaurantEtiquette) ||
      nonempty(lesson.housingNuances) ||
      nonempty(lesson.postOfficeTips) ||
      nonempty(lesson.patronatoTips) ||
      nonempty(lesson.barRules) ||
      nonempty(lesson.supermarketEtiquette) ||
      nonempty(lesson.transportTips) ||
      nonempty(lesson.beautyTips),
  )
}

export function buildDaySteps(lesson) {
  const steps = []
  if (lessonHasText(lesson)) {
    steps.push({ id: 'text', kind: 'text' })
  }

  const questions = lesson.questions ?? []
  const dialogue = lesson.dialogue ?? []

  if (questions.length > 0) {
    questions.forEach((_, index) => {
      steps.push({ id: `boss-${index}`, kind: 'boss', index })
    })
  } else if (dialogue.length > 0) {
    const kind = lesson.mode === 'boss' ? 'boss' : 'dialogue'
    dialogue.forEach((_, index) => {
      steps.push({ id: `${kind}-${index}`, kind, index })
    })
  }

  if (steps.length === 0) {
    steps.push({ id: 'text', kind: 'text' })
  }

  return steps
}

export function buildDayStages(steps) {
  const stages = []
  const seen = new Set()
  for (const step of steps) {
    if (seen.has(step.kind)) continue
    seen.add(step.kind)
    stages.push({
      kind: step.kind,
      firstId: step.id,
      labelKey:
        step.kind === 'dialogue'
          ? 'stepDialogue'
          : step.kind === 'boss'
            ? 'stepBoss'
            : 'stepText',
    })
  }
  return stages
}

export function currentDayStepIndex({
  steps,
  stepIndex,
  trackLength,
  finished,
  engaged,
}) {
  if (!steps.length) return 0
  if (finished) return steps.length - 1
  const textOffset = steps[0]?.kind === 'text' ? 1 : 0
  if (textOffset && !engaged && stepIndex === 0) return 0
  if (trackLength <= 0) return Math.min(textOffset, steps.length - 1)
  return Math.min(textOffset + Math.max(stepIndex, 0), steps.length - 1)
}
