import fs from 'fs'

function ukOf(v) {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object') return v.uk || v.ua || ''
  return String(v)
}

const days = []
const lines = [
  'ITALIAN TRACKER — Revisione per madrelingua',
  'Tutte le frasi italiane del corso (giorni 1–30) con traduzione ucraina.',
  'Per favore controllare: naturalità, grammatica, articoli, registro (Lei), termini burocratici.',
  '='.repeat(72),
  '',
]

for (let d = 1; d <= 30; d += 1) {
  const data = JSON.parse(fs.readFileSync(`src/content/day${d}.json`, 'utf8'))
  const dayOut = {
    day: d,
    module: data.module || '',
    title_uk: ukOf(data.title),
    items: [],
  }
  lines.push(`##### GIORNO ${d} — ${data.module || ''} #####`)
  lines.push(`Titolo (UK): ${ukOf(data.title)}`)
  lines.push('')

  function add(kind, it, uk, extra = '') {
    if (!it && !uk) return
    dayOut.items.push({ kind, it: it || '', uk: uk || '', note: extra })
    lines.push(`[${kind}]`)
    if (it) lines.push(`IT: ${it}`)
    if (uk) lines.push(`UK: ${uk}`)
    if (extra) lines.push(`NOTE: ${extra}`)
    lines.push('')
  }

  if (data.story) add('contesto', '', ukOf(data.story))
  for (const doc of data.documents || data.documentsRequired || []) {
    if (typeof doc === 'string') add('documento', doc, '')
    else add('documento', doc.item, ukOf(doc.ukrainian || doc.translation))
  }
  for (const p of data.phrases || []) {
    add('frase', p.italian, ukOf(p.translation || p.ukrainian))
  }
  if (data.grammar) {
    add('grammatica_titolo', '', ukOf(data.grammar.title))
    for (const rule of data.grammar.rules || []) {
      add('regola', '', ukOf(rule.rule))
      for (const ex of rule.examples || []) {
        if (typeof ex === 'string') add('esempio', ex, '')
        else add('esempio', ex.italian, ukOf(ex.translation || ex.ukrainian))
      }
    }
  }
  for (const k of [
    'restaurantEtiquette',
    'housingNuances',
    'postOfficeTips',
    'patronatoTips',
    'barRules',
    'supermarketEtiquette',
    'transportTips',
    'beautyTips',
  ]) {
    for (const tip of data[k] || []) {
      add('tip', '', typeof tip === 'string' ? tip : ukOf(tip))
    }
  }
  if (ukOf(data.culturaTip)) add('cultura', '', ukOf(data.culturaTip))
  for (const step of data.dialogue || []) {
    add('npc', step.text, ukOf(step.translation), `speaker: ${step.speaker || ''}`)
    for (const opt of step.options || []) {
      const tone = opt.tone || (opt.isCorrect ? 'natural' : '')
      const fb = opt.feedback ? `feedback UK: ${ukOf(opt.feedback)}` : ''
      add(`opzione${tone ? '/' + tone : ''}`, opt.text, ukOf(opt.translation), [fb, tone].filter(Boolean).join(' | '))
    }
  }
  for (const [i, q] of (data.questions || []).entries()) {
    add('quiz_domanda', '', ukOf(q.question), `id ${q.id || i}`)
    for (const [oi, opt] of (q.options || []).entries()) {
      add('quiz_opzione', typeof opt === 'string' ? opt : opt.text || '', '', oi === q.correctAnswer ? 'CORRETTA' : '')
    }
    if (q.explanation) add('quiz_spiegazione', '', ukOf(q.explanation))
  }
  if (ukOf(data.successTitle)) add('successo_titolo', '', ukOf(data.successTitle))
  if (ukOf(data.successMessage)) add('successo_msg', '', ukOf(data.successMessage))
  const badge = ukOf(data.successBadge)
  if (badge) add('badge', '', badge)
  days.push(dayOut)
}

fs.mkdirSync('docs', { recursive: true })
fs.writeFileSync('docs/lessons_for_review.txt', `${lines.join('\n')}\n`)
fs.writeFileSync(
  'docs/lessons_for_review.json',
  `${JSON.stringify({ generated: '2026-10-08', days }, null, 2)}\n`,
)
const itCount = days.reduce((n, d) => n + d.items.filter((i) => i.it).length, 0)
const ukCount = days.reduce((n, d) => n + d.items.filter((i) => i.uk).length, 0)
console.log(JSON.stringify({ days: days.length, withItalian: itCount, withUk: ukCount }))
