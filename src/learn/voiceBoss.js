import { isItalianPrompt, resolveContentText } from '../content/localize.js'
import { cycleIdForDay } from '../content/loadLesson.js'

const STOP = new Set([
  'che',
  'per',
  'una',
  'uno',
  'con',
  'del',
  'della',
  'delle',
  'dei',
  'degli',
  'sono',
  'hai',
  'ho',
  'il',
  'la',
  'lo',
  'gli',
  'le',
  'di',
  'a',
  'da',
  'in',
  'su',
  'un',
  'mi',
  'ti',
  'ci',
  'vi',
  'si',
  'non',
  'piu',
  'come',
  'quando',
  'dove',
  'anche',
  'molto',
  'questo',
  'questa',
  'vorrei',
  'grazie',
  'prego',
  'buongiorno',
  'buonasera',
  'ciao',
  'essere',
  'avere',
  'fare',
])

export const PERSONA = {
  anagrafe: { speaker: 'Impiegato comunale', opener: 'Buongiorno. Mi dica, prego.' },
  asl: { speaker: 'Impiegato ASL', opener: 'Buongiorno, sportello iscrizioni. Mi dica.' },
  ristorante: { speaker: 'Cameriere', opener: 'Buonasera, mi dica pure.' },
  casa: { speaker: 'Signor Mario', opener: 'Pronto? Sì, mi dica dell’appartamento.' },
  poste: { speaker: 'Impiegato Poste', opener: 'Buongiorno, prossimo numero. Mi dica.' },
  patronato: { speaker: 'Operatore Patronato', opener: 'Buongiorno, come posso aiutarla?' },
  bar: { speaker: 'Barista', opener: 'Prego, mi dica.' },
  supermercato: { speaker: 'Addetto al banco', opener: 'Prego, desidera?' },
  trasporti: { speaker: 'Autista', opener: 'Avanti, il biglietto. Mi dica.' },
  bellezza: { speaker: 'Parrucchiere', opener: 'Buongiorno, che cosa le facciamo oggi?' },
}

const SCENE = {
  '6:p1': {
    speaker: 'Impiegata',
    prompt: 'Buongiorno. Mi dica, come posso aiutarla?',
    expected: 'Devo iscrivermi al Servizio Sanitario Nazionale.',
  },
  '6:p2': {
    speaker: 'Impiegata',
    prompt: 'Perfetto. Ha già un medico di base?',
    expected: 'Devo scegliere un medico di base.',
  },
  '6:p3': {
    speaker: 'Impiegata',
    prompt: 'Questo medico è vicino a casa sua e ha ancora disponibilità.',
    expected: 'È vicino a casa mia.',
  },
  '6:p4': {
    speaker: 'Impiegata',
    prompt: 'Per le emergenze gravi, dove va?',
    expected: 'Al Pronto Soccorso.',
  },
  '6:p5': {
    speaker: 'Impiegata',
    prompt: 'Con il permesso di soggiorno deve pagare l’iscrizione?',
    expected: 'Ho diritto all’iscrizione gratuita.',
  },
  '6:p6': {
    speaker: 'Impiegata',
    prompt: 'Per le urgenze serali e nei festivi, dove va?',
    expected: 'Alla Guardia Medica.',
  },
  '9:p1': {
    speaker: 'Cameriere',
    prompt: 'Buonasera, ristorante Da Mario. Prenotazione?',
    expected: 'Vorrei prenotare un tavolo per due per stasera.',
  },
  '9:p2': {
    speaker: 'Cameriere',
    prompt: 'Sul conto c’è la voce Coperto. Sa che cos’è?',
    expected: 'È la spesa per pane e servizio al tavolo.',
  },
  '9:p3': {
    speaker: 'Cameriere',
    prompt: 'Dopo il pranzo, un caffè?',
    expected: 'Vorrei un caffè espresso.',
  },
  '9:p4': {
    speaker: 'Cameriere',
    prompt: 'È tutto a posto? Desidera altro?',
    expected: 'Possiamo avere il conto, per favore?',
  },
  '9:p5': {
    speaker: 'Cameriere',
    prompt: 'Acqua liscia o gassata?',
    expected: 'Vorrei dell’acqua naturale.',
  },
  '12:p1': {
    speaker: 'Signor Mario',
    prompt: 'Pronto? Sì, è l’annuncio dell’appartamento. Mi dica.',
    expected: 'Buongiorno. L’appartamento è ancora disponibile?',
  },
  '12:p2': {
    speaker: 'Signor Mario',
    prompt: 'Oltre all’affitto ci sono le spese condominiali. Le spiego?',
    expected: 'Sì, grazie. Sono le spese per le parti comuni del palazzo?',
  },
  '12:p3': {
    speaker: 'Signor Mario',
    prompt: 'Chiedo anche una caparra. Sa cos’è?',
    expected: 'Sì, è il deposito cauzionale, si restituisce all’uscita.',
  },
  '12:p4': {
    speaker: 'Signor Mario',
    prompt: 'Se le interessa, quando viene a vederlo?',
    expected: 'Quando possiamo fissare un appuntamento per visitare l’appartamento?',
  },
  '12:p5': {
    speaker: 'Signor Mario',
    prompt: 'È un bilocale. Le è chiaro?',
    expected: 'Sì, due stanze: camera e soggiorno.',
  },
  '15:p1': {
    speaker: 'Ingresso Poste',
    prompt: 'Buongiorno. Per lo sportello prenda il numero, prego.',
    expected: 'Prendo il ticket al totem.',
  },
  '15:p2': {
    speaker: 'Impiegato Poste',
    prompt: 'Numero 24, prego. Cosa deve fare?',
    expected: 'Devo spedire un pacco.',
  },
  '15:p3': {
    speaker: 'Impiegato Poste',
    prompt: 'Lettera semplice o raccomandata?',
    expected: 'Vorrei spedire una raccomandata.',
  },
  '15:p4': {
    speaker: 'Impiegato Poste',
    prompt: 'Sul modulo, chi è il mittente?',
    expected: 'Il mittente è chi spedisce.',
  },
  '15:p5': {
    speaker: 'Impiegato Poste',
    prompt: 'Per seguire il pacco online usi questo numero. Come si chiama?',
    expected: 'Il codice di tracciamento.',
  },
  '18:p1': {
    speaker: 'Operatore Patronato',
    prompt: 'Per i sussidi serve l’ISEE. Sa cos’è?',
    expected: 'È il calcolo del reddito familiare per i sussidi.',
  },
  '18:p2': {
    speaker: 'Operatore Patronato',
    prompt: 'Per i figli c’è l’assegno mensile dello Stato. Come si chiama?',
    expected: 'L’Assegno Unico Universale.',
  },
  '18:p3': {
    speaker: 'Operatore Patronato',
    prompt: 'Vuole presentare una domanda oggi?',
    expected: 'Vorrei fare la domanda per l’Assegno Unico.',
  },
  '18:p4': {
    speaker: 'Operatore Patronato',
    prompt: 'Per l’accredito INPS serve un dato del conto. Quale?',
    expected: 'Serve il codice IBAN del conto.',
  },
  '18:p5': {
    speaker: 'Operatore Patronato',
    prompt: 'Ha già i documenti? Mi dica se le manca qualcosa.',
    expected: 'Quali documenti servono per la richiesta?',
  },
  '21:p1': {
    speaker: 'Barista',
    prompt: 'Al banco o al tavolo? Al tavolo costa di più, sa perché?',
    expected: 'Al tavolo si paga il servizio in più.',
  },
  '21:p2': {
    speaker: 'Barista',
    prompt: 'Un caffè macchiato, va bene? Cos’è?',
    expected: 'Un espresso con un po’ di latte.',
  },
  '21:p3': {
    speaker: 'Barista',
    prompt: 'E da mangiare? Un cornetto?',
    expected: 'Un cornetto / una brioche al cioccolato.',
  },
  '21:p4': {
    speaker: 'Barista',
    prompt: 'Ha lo scontrino della cassa. Lo lasci qui, prego.',
    expected: 'Lascio lo scontrino al banco.',
  },
  '21:p5': {
    speaker: 'Barista',
    prompt: 'Caffè pronto. Desidera altro?',
    expected: 'Un bicchiere d’acqua, per favore.',
  },
  '24:p1': {
    speaker: 'Addetto al banco',
    prompt: 'Quanto prosciutto le metto? Due etti le basta?',
    expected: 'Sì, due etti: duecento grammi.',
  },
  '24:p2': {
    speaker: 'Addetto al banco',
    prompt: 'Per la frutta sfusa, prima i guanti. D’accordo?',
    expected: 'Metto i guanti prima della frutta.',
  },
  '24:p3': {
    speaker: 'Cassiera',
    prompt: 'Serve un sacchetto?',
    expected: 'Posso avere un sacchetto per la spesa?',
  },
  '24:p4': {
    speaker: 'Cassiera',
    prompt: 'Ecco lo scontrino. Lo tenga. Cos’è?',
    expected: 'È lo scontrino fiscale della spesa.',
  },
  '24:p5': {
    speaker: 'Addetto al banco',
    prompt: 'Il prosciutto, come lo taglio?',
    expected: 'Lo tagli sottile, per favore.',
  },
  '27:p1': {
    speaker: 'Autista',
    prompt: 'Il biglietto, prego. Dove l’ha preso?',
    expected: 'L’ho comprato in tabaccheria / in edicola.',
  },
  '27:p2': {
    speaker: 'Autista',
    prompt: 'L’ha convalidato? Cosa significa convalidare?',
    expected: 'Timbrare il biglietto nella macchinetta.',
  },
  '27:p3': {
    speaker: 'Addetto stazione',
    prompt: 'Il regionale per Venezia. Deve chiedere il binario.',
    expected: 'Da quale binario parte il treno?',
  },
  '27:p4': {
    speaker: 'Controllore',
    prompt: 'Biglietto non timbrato. Cosa succede?',
    expected: 'C’è la multa del controllore.',
  },
  '27:p5': {
    speaker: 'Addetto stazione',
    prompt: 'Scusi, stazione: che cosa significa?',
    expected: 'Stazione, la stazione ferroviaria.',
  },
  '30:p1': {
    speaker: 'Reception',
    prompt: 'Buongiorno, salone. Vuole un appuntamento?',
    expected: 'Vorrei prendere un appuntamento.',
  },
  '30:p2': {
    speaker: 'Parrucchiere',
    prompt: 'Per i capelli e la barba, che le facciamo?',
    expected: 'Vorrei accorciare i capelli ai lati e regolare la barba.',
  },
  '30:p3': {
    speaker: 'Parrucchiere',
    prompt: 'Solo spuntare, va bene? Cosa vuole dire?',
    expected: 'Tagliare solo le punte.',
  },
  '30:p4': {
    speaker: 'Estetista',
    prompt: 'Manicure: lo smalto vecchio c’è ancora. Mi dica.',
    expected: 'Devo togliere lo smalto semipermanente vecchio.',
  },
  '30:p5': {
    speaker: 'Parrucchiere',
    prompt: 'Dopo il lavaggio, una piega?',
    expected: 'Sì, lo styling con il phon.',
  },
}

export function normalizeItalian(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function keywordsFromPhrase(phrase) {
  const words = normalizeItalian(phrase).split(' ').filter(Boolean)
  const keys = words.filter((word) => word.length >= 4 && !STOP.has(word))
  if (keys.length > 0) return [...new Set(keys)].slice(0, 6)
  return [...new Set(words.filter((word) => word.length >= 3))].slice(0, 4)
}

export function matchKeywords(transcript, keywords) {
  const hay = normalizeItalian(transcript)
  const tokens = hay.split(' ').filter(Boolean)
  const list = (keywords ?? []).map((key) => normalizeItalian(key)).filter(Boolean)
  const hits = list.filter((key) => {
    if (!key) return false
    if (hay.includes(key)) return true
    const stem = key.slice(0, Math.min(5, key.length))
    return tokens.some((token) => token === key || token.startsWith(stem) || (token.length >= 4 && key.startsWith(token)))
  })
  return { ok: hits.length >= 1 && hay.length >= 2, hits }
}

function optionText(option) {
  if (typeof option === 'string') return option
  if (option && typeof option.text === 'string') return option.text
  return ''
}

function naturalReply(step) {
  const options = Array.isArray(step?.options) ? step.options : []
  return (
    options.find((item) => item.tone === 'natural' || item.isCorrect) || options[0] || null
  )
}

function expectedFromQuestion(question, day) {
  const scene = SCENE[`${day}:${question.id}`]
  if (scene?.expected) return scene.expected
  const options = question.options ?? []
  const correct = options[question.correctAnswer] ?? options[0]
  const italian = optionText(correct)
  if (isItalianPrompt(italian)) return italian
  return italian || ''
}

export function buildVoiceTurns(lesson, locale) {
  const cycle = cycleIdForDay(lesson.day)
  const persona = PERSONA[cycle] || PERSONA.anagrafe
  const dialogue = Array.isArray(lesson.dialogue) ? lesson.dialogue : []
  const questions = Array.isArray(lesson.questions) ? lesson.questions : []

  if (dialogue.length > 0) {
    return dialogue.map((step, index) => {
      const reply = naturalReply(step)
      const expected = String(reply?.text || '')
      return {
        id: `voice-${lesson.day}-${index}`,
        speaker: step.speaker || persona.speaker,
        promptIt: step.text || persona.opener,
        task: resolveContentText(reply?.translations || reply?.translation, locale) || expected,
        expected,
        keywords: keywordsFromPhrase(expected),
      }
    })
  }

  return questions
    .map((question, index) => {
      const scene = SCENE[`${lesson.day}:${question.id}`]
      const expected = expectedFromQuestion(question, lesson.day)
      return {
        id: `voice-${lesson.day}-${question.id || index}`,
        speaker: scene?.speaker || persona.speaker,
        promptIt: scene?.prompt || persona.opener,
        task: resolveContentText(question.question, locale),
        expected,
        keywords: keywordsFromPhrase(expected),
      }
    })
    .filter((turn) => turn.expected && turn.keywords.length > 0)
}
