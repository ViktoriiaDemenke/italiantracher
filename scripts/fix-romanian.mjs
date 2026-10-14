import fs from 'fs'

const MAP = new Map([
  [
    'Cod fiscal. Fără el, cererea de residenza de obicei nu se închide.',
    'Cod fiscal. Fără el, cererea de residenza de obicei nu se finalizează.',
  ],
  [
    'Permis de ședere în original, nu doar o poză pe telefon.',
    'Permisul de ședere în original, nu doar o poză pe telefon.',
  ],
  [
    'Marcă de 16 euro pentru cerere. Adesea se cumpără la tabaccheria înainte de vizită.',
    'Timbru fiscal de 16 euro pentru cerere. Adesea se cumpără la tabaccheria înainte de vizită.',
  ],
  [
    'Este nevoie și de marca da bollo de șaisprezece euro?',
    'Este nevoie și de marca da bollo de 16 euro?',
  ],
  [
    'Numărul meu a apărut pe tablou.',
    'Numărul meu a apărut pe ecran.',
  ],
  [
    'Bună dimineața, mulțumesc. Trebuie să selectez Anagrafe pentru residenza?',
    'Bună dimineața, mulțumesc. Trebuie să selectez Anagrafe pentru înregistrarea reședinței?',
  ],
  [
    'Vă rog să binevoiți a-mi indica procedura telematică de eliberare a tichetului de coadă.',
    'Vă rog să binevoiți a-mi indica procedura electronică de eliberare a tichetului de rând.',
  ],
  [
    'Merg oricum la sportello, oricum nu e nimeni.',
    'Merg oricum la ghișeu: oricum nu e nimeni.',
  ],
  [
    'Ați luat tichetul? Așteptați-vă numărul. Nu vă puneți la coadă la sportello fără număr.',
    'Ați luat tichetul? Așteptați-vă numărul. Nu vă puneți la coadă la ghișeu fără număr.',
  ],
  ['Merg la sportello 1, e mai aproape.', 'Merg la ghișeul 1, e mai aproape.'],
  [
    'Este numărul meu. Merg la sportello 4 cu documentele în ordine.',
    'Este numărul meu. Merg la ghișeul 4 cu documentele în ordine.',
  ],
  ['Este numărul 37, sportello 4.', 'Este numărul 37, ghișeul 4.'],
  [
    'Numărul lui Marco a apărut. Se apropie de sportello 4. La ghișeu e un impiegato. Aici nu mai e totemul, ci o conversație vie: scopul vizitei, documente, formularul care lipsește și un Lei calm până la arrivederci.',
    'Numărul lui Marco a apărut. Se apropie de ghișeul 4. La ghișeu e un impiegato. Aici nu mai e totemul, ci o conversație reală: scopul vizitei, documente, formularul care lipsește și un Lei calm până la arrivederci.',
  ],
  [
    'Locuiesc pe via Roma doisprezece, cu soția și fiica mea.',
    'Locuiesc pe via Roma 12, cu soția și fiica mea.',
  ],
  [
    'La sportello, un răspuns la o întrebare. Dacă lipsește un modulo, spuneți calm și cereți formularul. Nu vă scuzați îndelung. Dictați numele ca în pașaport sau arătați documentul. Păstrați Lei până la Grazie, arrivederci.',
    'La ghișeu, un răspuns la o întrebare. Dacă lipsește un modulo, spuneți calm și cereți formularul. Nu vă scuzați îndelung. Dictați numele ca în pașaport sau arătați documentul. Păstrați Lei până la Grazie, arrivederci.',
  ],
  [
    'Vă predau în continuare întreaga documentație de identitate și contractuală în original.',
    'Vă predau în continuare toate originalele documentelor de identitate și ale contractului.',
  ],
  [
    'Vă rog să-mi explicați analog fiecare câmp al formularului.',
    'Vă rog să-mi explicați la fel fiecare câmp al formularului.',
  ],
  [
    'Semnez aici. Dacă o literă a numelui nu e clară, o silabisesc, dacă doriți.',
    'Semnez aici. Dacă o literă a numelui nu e clară, o dictez literă cu literă, dacă doriți.',
  ],
  [
    'Mai iute, am un autobuz. Faceți-mă pe mine primul.',
    'Mai iute, am un autobuz. Treceți-mă pe mine primul.',
  ],
  ['Residenza obținută cu succes!', 'Residenza înregistrată cu succes!'],
  ['Este numărul meu. Merg la sportello 4.', 'Este numărul meu. Merg la ghișeul 4.'],
  [
    'Ah, scuzați-mă foarte mult. Merg la sportello 4, mulțumesc.',
    'Ah, scuzați-mă. Merg la ghișeul 4, mulțumesc.',
  ],
  [
    'Iată, toate în original: pașaportul, codice fiscale, permesso și contractul.',
    'Iată, toate originale: pașaportul, codice fiscale, permesso și contractul.',
  ],
  [
    'Locuiesc pe via Roma doisprezece, interno trei, etajul doi. Locuiesc cu soția și fiica mea.',
    'Locuiesc pe via Roma 12, interno 3, etajul doi. Locuiesc cu soția și fiica mea.',
  ],
  [
    'Unde e sportello? Nu am timp pentru numere.',
    'Unde e ghișeul? Nu am timp pentru numere.',
  ],
  [
    'Întreb la sportello dacă pot trece, oricum e loc.',
    'Întreb la ghișeu dacă pot trece: oricum e loc.',
  ],
  [
    'Așezați-vă. Numărul apare pe tablou. Nu vă apropiați de sportello înainte.',
    'Poftiți, așezați-vă. Numărul apare pe ecran. Nu vă apropiați de ghișeu înainte.',
  ],
  ['Merg la sportello 2, sunt mai puțini oameni.', 'Merg la ghișeul 2, sunt mai puțini oameni.'],
  [
    'Cer iertare pentru confuzie și mă îndrept către sportello indicat.',
    'Cer iertare pentru confuzie și mă îndrept către ghișeul indicat.',
  ],
  [
    "Acest sportello este pentru carta d'identità. Residenza este la sportello 4.",
    'Acest ghișeu este pentru carta d’identità. Residenza este la ghișeul 4.',
  ],
  [
    'Bună dimineața. Vă prezint tichetul de coadă și cererea de residenza.',
    'Bună dimineața. Vă prezint tichetul de rând și cererea de residenza.',
  ],
  [
    'Vă depun întreaga documentație în original, așa cum se cere.',
    'Vă depun toate originalele, așa cum se cere.',
  ],
  [
    'Vă mulțumesc pentru eliberarea chitanței și vă doresc o continuare plăcută.',
    'Vă mulțumesc pentru eliberarea chitanței și vă doresc o zi în continuare plăcută.',
  ],
  [
    'Această hârtie e residenza definitivă, nu-i așa? Atunci dă-mi și identitatea.',
    'Această hârtie e residenza definitivă, nu-i așa? Atunci dă-mi și buletinul.',
  ],
  [
    'Bună dimineața, scuzați-mă. Trebuie să mă înscriu la Servizio Sanitario Nazionale. Acesta este sportello potrivit?',
    'Bună dimineața, scuzați-mă. Trebuie să mă înscriu la Servizio Sanitario Nazionale. Acesta este ghișeul potrivit?',
  ],
  [
    'Perfect. Cu permesso di soggiorno al dumneavoastră aveți dreptul la înscriere gratuită. Aveți deja un medico di base?',
    'Perfect. Cu permesso di soggiorno aveți dreptul la înscriere gratuită. Aveți deja un medico di base?',
  ],
  [
    'Vă arăt o listă a medicilor disponibili în zona dumneavoastră. Acest medic e aproape de casa dumneavoastră și are loc.',
    'Vă arăt o listă a medicilor disponibili în zona dumneavoastră. Acest medic e aproape de casa dumneavoastră și mai are locuri.',
  ],
  [
    'Unde trebuie să te adresezi în caz de pericol grav și continuu pentru sănătate?',
    'Unde trebuie să te adresezi în caz de pericol grav și imediat pentru sănătate?',
  ],
  [
    'Nu, mulțumesc. Când se poate, putem avea nota de plată?',
    'Nu, mulțumesc. Când puteți, ne aduceți nota de plată?',
  ],
  [
    'Plătim cu bancnote de două sute, fără bacșiș și fără bon.',
    'Plătim cu bancnote de 200 de euro, fără bacșiș și fără bon.',
  ],
  [
    'Spese condominiali sunt excluse.',
    'Spese condominiali nu sunt incluse.',
  ],
  [
    'Laura sună proprietarul — Signor Mario — ca să întrebe detaliile anunțului și să convină o vizionare.',
    'Laura sună proprietarul — signor Mario — ca să întrebe detaliile anunțului și să convină o vizionare.',
  ],
  [
    'Bună dimineața Signor Mario, sunt Laura. Sun pentru anunțul apartamentului de închiriat. Mai este disponibil?',
    'Bună dimineața, signor Mario, sunt Laura. Sun pentru anunțul apartamentului de închiriat. Mai este disponibil?',
  ],
  [
    'Nu vreau să plătesc cheltuielile de condominium.',
    'Nu vreau să plătesc cheltuielile de condominiu.',
  ],
  [
    'Chiria este de 650 de euro pe lună. Spese condominiali sunt 80 de euro separat și includ apa și curățenia scărilor.',
    'Chiria este de 650 de euro pe lună. Spese condominiali sunt 80 de euro în plus și includ apa și curățenia scărilor.',
  ],
  [
    'Cum îl întrebi pe Signor Mario dacă apartamentul din anunț e încă liber?',
    'Cum îl întrebi pe signor Mario dacă apartamentul din anunț e încă liber?',
  ],
  [
    'Ticket al totem — la intrare pe terminal alegeți: «Spedizioni e Pacchi» (trimiteri), «Pagamenti» (chitanțe/plăți) sau «Ritiro» (ridicare).',
    'Ticket la totem: la intrare, pe terminal, alegeți «Spedizioni e Pacchi» (trimiteri), «Pagamenti» (plăți) sau «Ritiro» (ridicare).',
  ],
  [
    'Cum se numește numărul pentru verificarea statusului și locației coletului pe internet?',
    'Cum se numește numărul pentru verificarea stării și locației coletului pe internet?',
  ],
  [
    'Patronato e CAF sunt instituții care ajută gratuit sau contra unei sume simbolice cu taxele, indemnizațiile de maternitate, bonusurile pentru copii și alte ajutoare.',
    'Patronato și CAF sunt instituții care ajută gratuit sau contra unei sume simbolice cu taxele, indemnizațiile de maternitate, bonusurile pentru copii și alte ajutoare.',
  ],
  [
    'ISEE este un indicator al situației patrimoniale pentru calculul ajutoarelor sociale.',
    'ISEE este un indicator al situației economice și patrimoniale pentru calculul ajutoarelor sociale.',
  ],
  [
    'Banii sosesc azi cash, nu-i așa? Îi aștept aici.',
    'Banii sosesc azi în numerar, nu-i așa? Îi aștept aici.',
  ],
  [
    'Intensivul tău zilnic pentru o viață sigură în Italia. De la primărie la restaurant — vorbește fără bariere!',
    'Intensivul tău zilnic ca să trăiești Italia cu încredere. De la primărie la restaurant — vorbește fără bariere!',
  ],
  ['Full access', 'Acces complet'],
  ['{{done}} / {{total}} days completed • {{percent}}%', '{{done}} / {{total}} zile finalizate • {{percent}} %'],
  ['🔥 {{count}} Day Streak', '🔥 {{count}} zile consecutive'],
  ['Light', 'Luminos'],
  ['Dark', 'Întunecat'],
  ['Immersion', 'Imersiune'],
  ['Dialogue', 'Dialog'],
  ['Boss Level', 'Nivel Boss'],
  ['Super Quest', 'Super misiune'],
  ['Flashcards Mode', 'Mod fișe'],
  ['End-of-Day Practice Quiz', 'Quiz de final de zi'],
  ['Review Mistakes', 'Reia greșelile'],
  ['✓ Day complete', '✓ Zi finalizată'],
  ['Mark Day as Complete', 'Marchează ziua ca finalizată'],
  ['Real Life Score', 'Scor real'],
  ['Cafea și small talk', 'Cafea și conversație'],
  ['30-Day Challenge', 'Provocarea de 30 de zile'],
  ['Ziua {{day}} finalizată! 🔥 {{streak}} Day Streak', 'Ziua {{day}} finalizată! 🔥 {{streak}} zile consecutive'],
  ['30-Day Roadmap', 'Parcursul de 30 de zile'],
  ['💡 Cultura & Tip', '💡 Cultura și sfat'],
  ['Primele {{free}} zile sunt gratuite. Apoi ai challenge-ul complet, recapitularea SRS și toate modulele.', 'Primele {{free}} zile sunt gratuite. Apoi ai provocarea completă, recapitularea SRS și toate modulele.'],
  ['Achizițiile funcționează în app-ul iOS / Android după cheile RevenueCat.', 'Achizițiile funcționează în aplicația iOS / Android după cheile RevenueCat.'],
])

function polish(s) {
  if (MAP.has(s)) return MAP.get(s)
  let t = s
  t = t.replaceAll('Indiciile și traducerea sunt dezactivate!', 'Indiciile și traducerea sunt dezactivate!')
  t = t.replaceAll('Simulare nivel boss', 'Simulare a nivelului Boss')
  return t
}

function applyRo(node) {
  let n = 0
  if (node == null) return { n }
  if (Array.isArray(node)) {
    for (const x of node) n += applyRo(x).n
    return { n }
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'ro' && typeof v === 'string') {
        const next = polish(v)
        if (next !== v) {
          node[k] = next
          n += 1
        }
      } else n += applyRo(v).n
    }
  }
  return { n }
}

let total = 0
for (let d = 1; d <= 30; d++) {
  const p = `src/content/day${d}.json`
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  const { n } = applyRo(data)
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  total += n
  console.log('day' + d, n)
}

const loc = JSON.parse(fs.readFileSync('src/locales/ro.json', 'utf8'))
function applyUi(obj) {
  let n = 0
  if (typeof obj === 'string') {
    const next = polish(obj)
    return { n: next !== obj ? 1 : 0, v: next }
  }
  if (Array.isArray(obj)) {
    const next = obj.map((item) => {
      const r = applyUi(item)
      n += r.n
      return r.v ?? item
    })
    return { n, v: next }
  }
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      const r = applyUi(v)
      out[k] = r.v
      n += r.n
    }
    return { n, v: out }
  }
  return { n, v: obj }
}
const r = applyUi(loc)
fs.writeFileSync('src/locales/ro.json', JSON.stringify(r.v, null, 2) + '\n')
console.log('locale', r.n, 'total', total + r.n)
