import fs from 'fs'

const MAP = new Map([
  [
    'Código fiscal. Sin él, la solicitud de residenza suele no cerrarse.',
    'Código fiscal. Sin él, la solicitud de residenza suele no concluirse.',
  ],
  [
    'Permiso de residencia en original, no solo una foto en el teléfono.',
    'El permiso de residencia original, no solo una foto en el teléfono.',
  ],
  [
    'Sello de 16 euros para la solicitud. A menudo se compra en una tabaccheria antes de la visita.',
    'Timbre fiscal de 16 euros para la solicitud. A menudo se compra en una tabaccheria antes de la visita.',
  ],
  [
    'Buenos días, quisiera presentar la solicitud de residencia.',
    'Buenos días, quisiera presentar la dichiarazione di residenza.',
  ],
  [
    '¿Debo seleccionar Anagrafe en el totem?',
    '¿Debo seleccionar Anagrafe en el tótem?',
  ],
  [
    '¿Hace falta también la marca da bollo de dieciséis euros?',
    '¿Hace falta también la marca da bollo de 16 euros?',
  ],
  [
    'Mi número ha salido en el tablero.',
    'Mi número ha salido en la pantalla.',
  ],
  [
    'Buenos días, gracias. ¿Debo seleccionar Anagrafe para la residencia?',
    'Buenos días, gracias. ¿Debo seleccionar Anagrafe para el registro de residencia?',
  ],
  [
    'Le ruego que tenga a bien indicarme el procedimiento telemático de emisión del título de cola.',
    'Le ruego que tenga a bien indicarme el procedimiento electrónico de emisión del ticket de turno.',
  ],
  [
    'Buenos días. Para el Anagrafe el ticket se coge en el totem, allí a la izquierda.',
    'Buenos días. Para el Anagrafe el ticket se coge en el tótem, allí a la izquierda.',
  ],
  [
    'Voy igual al sportello, total no hay nadie.',
    'Voy igual a la ventanilla: total no hay nadie.',
  ],
  [
    '¿Ha cogido el ticket? Espere su número. No se ponga en fila en el sportello sin número.',
    '¿Ha cogido el ticket? Espere su número. No se ponga en fila en la ventanilla sin número.',
  ],
  [
    'Voy al sportello 1, está más cerca.',
    'Voy a la ventanilla 1, está más cerca.',
  ],
  [
    'Es mi número. Voy al sportello 4 con los documentos en orden.',
    'Es mi número. Voy a la ventanilla 4 con los documentos en orden.',
  ],
  [
    'Constatado el aviso electrónico, me dirijo de inmediato al mostrador indicado.',
    'Constatado el aviso electrónico, me dirijo de inmediato a la ventanilla indicada.',
  ],
  ['Es el número 37, sportello 4.', 'Es el número 37, ventanilla 4.'],
  [
    'Sale el número de Marco. Se acerca al sportello 4. Detrás de la ventanilla hay un impiegato. Ya no es el totem, sino una conversación real: motivo de la visita, documentos, el formulario que falta, y un Lei tranquilo hasta arrivederci.',
    'Sale el número de Marco. Se acerca a la ventanilla 4. Detrás de la ventanilla hay un impiegato. Ya no es el tótem, sino una conversación real: motivo de la visita, documentos, el formulario que falta, y un Lei tranquilo hasta arrivederci.',
  ],
  [
    'Vivo en via Roma doce, con mi mujer y mi hija.',
    'Vivo en via Roma 12, con mi mujer y mi hija.',
  ],
  [
    'En el sportello, una respuesta por pregunta. Si falta un modulo, dilo con calma y pide el formulario. No te justifiques largo. Deletrea el nombre como en el pasaporte o muestra el documento. Mantén Lei hasta Grazie, arrivederci.',
    'En la ventanilla, una respuesta por pregunta. Si falta un modulo, dilo con calma y pide el formulario. No te justifiques largo. Deletrea el nombre como en el pasaporte o muestra el documento. Mantén el Lei hasta Grazie, arrivederci.',
  ],
  [
    'He cumplido el procedimiento de reserva mediante el totem electrónico.',
    'He cumplido el procedimiento de reserva mediante el tótem electrónico.',
  ],
  [
    'He cogido el ticket en el totem, categoría Anagrafe. Este es mi número.',
    'He cogido el ticket en el tótem, categoría Anagrafe. Este es mi número.',
  ],
  [
    'De acuerdo. ¿Tiene ya cita o ha venido con el número del totem?',
    'De acuerdo. ¿Tiene ya cita o ha venido con el número del tótem?',
  ],
  [
    'Le entrego a continuación toda la documentación identificativa y contractual en original.',
    'Le entrego a continuación todos los originales de la documentación identificativa y contractual.',
  ],
  [
    'Le ruego que me ilustre análogamente cada campo del formulario.',
    'Le ruego que me explique igualmente cada campo del formulario.',
  ],
  [
    'Apondré mi firma en el espacio destinado y quedaré a disposición para eventuales rectificaciones.',
    'Estamparé mi firma en el espacio destinado y quedaré a disposición para eventuales rectificaciones.',
  ],
  [
    'Rápido, tengo un autobús. Hágame a mí primero.',
    'Rápido, tengo un autobús. Páseme a mí primero.',
  ],
  ['¡Residenza obtenida con éxito!', '¡Residenza registrada con éxito!'],
  [
    'Comune de Treviso, esta mañana. Del totem al recibo. Sin traducciones ni explicaciones.',
    'Comune de Treviso, esta mañana. Del tótem al recibo. Sin traducciones ni explicaciones.',
  ],
  ['Buenos días, gracias. Voy al totem.', 'Buenos días, gracias. Voy al tótem.'],
  ['Es mi número. Voy al sportello 4.', 'Es mi número. Voy a la ventanilla 4.'],
  [
    'Ay, mil disculpas. Voy al sportello 4, gracias.',
    'Ay, mil disculpas. Voy a la ventanilla 4, gracias.',
  ],
  [
    'Aquí, todos en original: el pasaporte, el codice fiscale, el permesso y el contrato.',
    'Aquí, todos originales: el pasaporte, el codice fiscale, el permesso y el contrato.',
  ],
  [
    'Vivo en via Roma doce, interno tres, segundo piso. Vivo con mi mujer y mi hija.',
    'Vivo en via Roma 12, interno 3, segundo piso. Vivo con mi mujer y mi hija.',
  ],
  [
    '¿Dónde está el sportello? No tengo tiempo para los números.',
    '¿Dónde está la ventanilla? No tengo tiempo para los números.',
  ],
  [
    'Le agradezco la indicación relativa al aparato de emisión de tickets.',
    'Le agradezco la indicación relativa al aparato de emisión de tickets.',
  ],
  [
    'Buenos días. Para el Anagrafe el totem está a la izquierda. Luego espere el número.',
    'Buenos días. Para el Anagrafe el tótem está a la izquierda. Luego espere el número.',
  ],
  [
    'Pregunto en el sportello si puedo pasar, total hay sitio.',
    'Pregunto en la ventanilla si puedo pasar: total hay sitio.',
  ],
  [
    'Siéntese. El número sale en el tablero. No se acerque al sportello antes.',
    'Póngase cómodo. El número sale en la pantalla. No se acerque a la ventanilla antes.',
  ],
  [
    'Voy al sportello 2, hay menos gente.',
    'Voy a la ventanilla 2, hay menos gente.',
  ],
  [
    'Me dirijo al mostrador correspondiente al aviso luminoso.',
    'Me dirijo a la ventanilla correspondiente al aviso luminoso.',
  ],
  [
    'Pido disculpas por el equívoco y me dirijo hacia el sportello indicado.',
    'Pido disculpas por el equívoco y me dirijo a la ventanilla indicada.',
  ],
  [
    'Este sportello es para la carta d\'identità. La residencia es en el sportello 4.',
    'Esta ventanilla es para la carta d’identità. La residencia es en la ventanilla 4.',
  ],
  [
    'Buenos días. Le presento el título de cola y la instancia de residencia.',
    'Buenos días. Le presento el ticket de turno y la solicitud de residencia.',
  ],
  [
    'Le deposito toda la documentación en original como se requiere.',
    'Le entrego toda la documentación original, como se requiere.',
  ],
  [
    'La vivienda está sita en via Roma 12, interno 3, segundo piso, con nucleo familiare conviviente.',
    'La vivienda está en via Roma 12, interno 3, segundo piso, con nucleo familiare conviviente.',
  ],
  [
    'Apongo la firma y espero la carga del sistema.',
    'Estampo la firma y espero la carga del sistema.',
  ],
  [
    'Le agradezco la emisión del recibo y le deseo una buena prosecución.',
    'Le agradezco la emisión del recibo y le deseo que continúe bien el día.',
  ],
  [
    'Esta tarjeta es la residencia definitiva, ¿verdad? Entonces dame también la identidad.',
    'Esta tarjeta es la residencia definitiva, ¿verdad? Entonces dame también el DNI.',
  ],
  [
    'Le muestro una lista de médicos disponibles en su zona. Este médico está cerca de su casa y tiene plaza.',
    'Le muestro una lista de médicos disponibles en su zona. Este médico está cerca de su casa y tiene disponibilidad.',
  ],
  [
    '¿Adónde acudir ante una amenaza grave y continua para la salud?',
    '¿Adónde acudir ante un peligro grave e inminente para la salud?',
  ],
  [
    '¿Qué responderá el empleado sobre el coste de inscripción con Permesso di Soggiorno?',
    '¿Qué responde el empleado sobre el coste de la inscripción con permesso di soggiorno?',
  ],
  [
    '¡Buenos días! ¿Habéis reservado o buscáis una mesa?',
    '¡Buenos días! ¿Han reservado o buscan una mesa?',
  ],
  [
    'Quisiera dos Coca-Cola grandes con hielo y limón, como en el fast food.',
    'Quisiera dos Coca-Cola grandes con hielo y limón, como en el fast-food.',
  ],
  [
    'Perfecto, pasad. Aquí está el menú. ¿De beber qué os traigo para empezar?',
    'Perfecto, pasen. Aquí está el menú. ¿Qué les traigo de beber para empezar?',
  ],
  [
    'Traiga todo junto, no importa el orden de los platos.',
    'Traiga todo a la vez; el orden de los platos no importa.',
  ],
  ['¿Estáis listos para pedir los platos?', '¿Están listos para pedir los platos?'],
  ['¡Excelente elección! ¿Deseáis un postre o un café al final?', '¡Excelente elección! ¿Desean un postre o un café al final?'],
  [
    'No, gracias. Cuando sea posible, ¿podemos tener la cuenta?',
    'No, gracias. Cuando pueda, ¿nos trae la cuenta?',
  ],
  [
    'Pagamos con billetes de doscientos, sin propina y sin ticket.',
    'Pagamos con billetes de 200 euros, sin propina y sin ticket.',
  ],
  [
    '¡Por supuesto! ¿Pagáis juntos o separados? Aceptamos también la tarjeta.',
    '¡Por supuesto! ¿Pagan juntos o por separado? Aceptamos también la tarjeta.',
  ],
  [
    '¡Enhorabuena! Has asimilado el etiquette de los restaurantes italianos, pides con facilidad y te orientas en la cuenta.',
    '¡Enhorabuena! Has asimilado la etiqueta de los restaurantes italianos, pides con facilidad y te orientas en la cuenta.',
  ],
  [
    'Las spese condominiali están excluidas.',
    'Las spese condominiali no están incluidas.',
  ],
  [
    'Laura llama al dueño del piso — Signor Mario — para preguntar detalles del anuncio y concertar una visita.',
    'Laura llama al dueño del piso — signor Mario — para preguntar detalles del anuncio y concertar una visita.',
  ],
  [
    'Buenos días Signor Mario, soy Laura. Llamo por el anuncio del apartamento en alquiler. ¿Sigue disponible?',
    'Buenos días, signor Mario, soy Laura. Llamo por el anuncio del apartamento en alquiler. ¿Sigue disponible?',
  ],
  [
    'El alquiler es de 650 euros al mes. Las spese condominiali son 80 euros aparte e incluyen el agua y la limpieza de las escaleras.',
    'El alquiler es de 650 euros al mes. Las spese condominiali son 80 euros aparte e incluyen el agua y la limpieza de las escaleras.',
  ],
  [
    'Muchas gracias, señor Mario, ¡hasta mañana! Que tenga un buen día.',
    'Muchas gracias, signor Mario, ¡hasta mañana! Que tenga un buen día.',
  ],
  [
    '¿Cómo preguntar a Signor Mario si el piso del anuncio sigue libre?',
    '¿Cómo preguntar al signor Mario si el piso del anuncio sigue libre?',
  ],
  [
    'Ticket al totem — en la entrada eliges en el terminal: \'Spedizioni e Pacchi\' (envíos), \'Pagamenti\' (recibos/pagos) o \'Ritiro\' (recogida).',
    'Ticket en el tótem: en la entrada eliges en el terminal «Spedizioni e Pacchi» (envíos), «Pagamenti» (pagos) o «Ritiro» (recogida).',
  ],
  [
    'En Italia, en correos es obligatorio el sistema de turno electrónico a través del terminal (totem).',
    'En Italia, en correos es obligatorio el sistema de turno electrónico a través del terminal (tótem).',
  ],
  [
    'Patronato e CAF son entidades que ayudan, gratis o por una tarifa simbólica, con impuestos, prestaciones de maternidad, bonificaciones por hijos y ayudas.',
    'El Patronato y el CAF son entidades que ayudan, gratis o por una tarifa simbólica, con impuestos, prestaciones de maternidad, bonificaciones por hijos y ayudas.',
  ],
  [
    'Assegno Unico Universale es una ayuda mensual por cada hijo menor de edad en la familia.',
    'El Assegno Unico Universale es una ayuda mensual por cada hijo menor de edad en la familia.',
  ],
  [
    'El ISEE es un indicador de situación patrimonial para calcular las ayudas sociales.',
    'El ISEE es un indicador de situación económica y patrimonial para calcular las ayudas sociales.',
  ],
  [
    '¿Podemos sentarnos en la mesa o se paga más?',
    '¿Podemos sentarnos en mesa o se paga más?',
  ],
  [
    'Las dos vacías, pero con nata y Nutella encima, para llevar calientes.',
    'Las dos sencillas, pero con nata y Nutella encima, calientes, para llevar.',
  ],
  [
    'Perfecto. ¿Cómo prefiere las brioches? Tenemos vacías, de mermelada o de chocolate.',
    'Perfecto. ¿Cómo prefiere las brioches? Tenemos sencillas, de mermelada o de chocolate.',
  ],
  [
    'Son 5 euros y 20 en total. Aquí tiene el ticket. Puede dejarlo en el mostrador.',
    'Son 5,20 euros en total. Aquí tiene el ticket. Puede dejarlo en el mostrador.',
  ],
  [
    '¿Tiene la tarjeta de fidelidad / carta fidaty?',
    '¿Tiene la tarjeta de fidelidad / carta fedeltà?',
  ],
  [
    'Solo quiero recortar un centímetro.',
    'Solo quiero que me recorten un centímetro.',
  ],
  [
    'Quisiera hacerme el esmalte semipermanente y quitar el viejo.',
    'Quisiera un esmalte semipermanente y que me quiten el viejo.',
  ],
  [
    '¡Recuerda validar el billete antes de subir!',
    '¡Recordemos validar el billete antes de subir!',
  ],
  [
    'En los salones italianos se valora el feedback durante el servicio. Si el agua está demasiado caliente o se corta demasiado, dígase con calma: \'Scusi, l\'acqua è troppo calda\' o \'Un po\' più lungo, per favore\'.',
    'En los salones italianos se valora el comentario durante el servicio. Si el agua está demasiado caliente o se corta demasiado, dígalo con calma: «Scusi, l’acqua è troppo calda» o «Un po’ più lungo, per favore».',
  ],
  [
    'Tu intensivo diario para una vida segura en Italia. Del ayuntamiento al restaurante: ¡habla sin barreras!',
    'Tu intensivo diario para vivir Italia con confianza. Del ayuntamiento al restaurante: ¡habla sin barreras!',
  ],
  ['Full access', 'Acceso completo'],
  ['{{done}} / {{total}} days completed • {{percent}}%', '{{done}} / {{total}} días completados • {{percent}} %'],
  ['🔥 {{count}} Day Streak', '🔥 {{count}} días seguidos'],
  ['Light', 'Claro'],
  ['Dark', 'Oscuro'],
  ['Immersion', 'Inmersión'],
  ['Dialogue', 'Diálogo'],
  ['Boss Level', 'Nivel Boss'],
  ['Super Quest', 'Súper misión'],
  ['Flashcards Mode', 'Modo cartas'],
  ['End-of-Day Practice Quiz', 'Quiz de fin de día'],
  ['Review Mistakes', 'Repasar errores'],
  ['✓ Day complete', '✓ Día completado'],
  ['Mark Day as Complete', 'Marcar el día como completado'],
  ['Real Life Score', 'Puntuación real'],
  ['Café y small talk', 'Café y conversación'],
  ['30-Day Challenge', 'Reto de 30 días'],
  ['¡Día {{day}} completado! 🔥 {{streak}} Day Streak', '¡Día {{day}} completado! 🔥 {{streak}} días seguidos'],
  ['30-Day Roadmap', 'Itinerario de 30 días'],
  ['💡 Cultura & Tip', '💡 Cultura y consejo'],
])

function polish(s) {
  if (MAP.has(s)) return MAP.get(s)
  let t = s
  t = t.replaceAll('¡Pistas y traducción desactivadas!', '¡Las pistas y la traducción están desactivadas!')
  t = t.replaceAll('Simulación de nivel jefe', 'Simulación del nivel Boss')
  t = t.replaceAll('en el totem', 'en el tótem')
  t = t.replaceAll('al totem', 'al tótem')
  t = t.replaceAll('el totem', 'el tótem')
  t = t.replaceAll('del totem', 'del tótem')
  return t
}

function applyEs(node) {
  let n = 0
  if (node == null) return { n }
  if (Array.isArray(node)) {
    for (const x of node) n += applyEs(x).n
    return { n }
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'es' && typeof v === 'string') {
        const next = polish(v)
        if (next !== v) {
          node[k] = next
          n += 1
        }
      } else n += applyEs(v).n
    }
  }
  return { n }
}

let total = 0
for (let d = 1; d <= 30; d++) {
  const p = `src/content/day${d}.json`
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  const { n } = applyEs(data)
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  total += n
  console.log('day' + d, n)
}

const loc = JSON.parse(fs.readFileSync('src/locales/es.json', 'utf8'))
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
fs.writeFileSync('src/locales/es.json', JSON.stringify(r.v, null, 2) + '\n')
console.log('locale', r.n, 'total', total + r.n)
