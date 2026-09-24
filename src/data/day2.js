function collectPhrases(nodes) {
  const list = []
  const seen = new Set()
  function add(phrase) {
    if (!phrase?.id || seen.has(phrase.id)) return
    seen.add(phrase.id)
    list.push(phrase)
  }
  Object.values(nodes).forEach((node) => {
    add(node.npc)
    node.choices?.forEach((choice) => add(choice.phrase))
  })
  return list
}

export const DAY2 = {
  day: 2,
  moduleId: 'anagrafe',
  type: 'dialogue',
  title: 'Anagrafe',
  badge: 'День 2 · Dialogue',
  lead: 'Повний діалог біля sportello: від «Mi dica» до бланка, очікування і ввічливого «arrivederci».',
  cultura: {
    title: '💡 Cultura & Tip',
    body: 'За вікном розмова йде шматками: хто ви, навіщо, як вас звати, яка адреса, які документи, потім modulo. Не розповідайте біографію. Одна відповідь — одне питання. Якщо прізвище складне, спокійно скажіть «lo spello» або «lo scrivo». «Lei» не відпускайте до «arrivederci».',
  },
  startId: 'start',
  nodes: {
    start: {
      npc: {
        id: 'd2-n-start',
        it: 'Buongiorno, mi dica.',
        uk: 'Доброго дня, кажіть.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'residenza',
          phrase: {
            id: 'd2-c-res',
            it: 'Buongiorno, vorrei iscrivermi all’anagrafe per la residenza.',
            uk: 'Доброго дня, хотів/хотіла б зареєструватися в анаграфе для residenza.',
            hint: 'Пряма мета візиту',
          },
        },
        {
          next: 'appuntamento',
          phrase: {
            id: 'd2-c-app',
            it: 'Buongiorno, ho un appuntamento. Il nome è sul foglio.',
            uk: 'Доброго дня, у мене є запис. Ім’я на папірці.',
            hint: 'Є бронювання',
          },
        },
        {
          next: 'primo',
          phrase: {
            id: 'd2-c-primo',
            it: 'Scusi, è la prima volta. Non so da dove cominciare.',
            uk: 'Вибачте, я вперше. Не знаю, з чого почати.',
            hint: 'Якщо розгубились',
          },
        },
      ],
    },
    primo: {
      npc: {
        id: 'd2-n-primo',
        it: 'Tranquillo. Allora: cerca la residenza o ha già un appuntamento?',
        uk: 'Спокійно. Отже: вам residenza чи вже є запис?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'residenza',
          phrase: {
            id: 'd2-c-cerco-res',
            it: 'Cerco la residenza, per favore. Sono nuovo in città.',
            uk: 'Мені потрібна residenza, будь ласка. Я новий у місті.',
            hint: 'Обрати послугу',
          },
        },
        {
          next: 'appuntamento',
          phrase: {
            id: 'd2-c-gia',
            it: 'Ho già un appuntamento, ma non capisco i passaggi.',
            uk: 'Запис уже є, але я не розумію наступні кроки.',
            hint: 'Є запис, немає впевненості',
          },
        },
      ],
    },
    appuntamento: {
      npc: {
        id: 'd2-n-ora',
        it: 'Va bene. A che ora è l’appuntamento? E come si chiama?',
        uk: 'Добре. На котру годину запис? І як вас звати?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-dieci',
            it: 'Alle dieci. Il mio nome è un po’ difficile, lo scrivo se vuole.',
            uk: 'На десяту. Ім’я трохи складне, можу написати, якщо треба.',
            hint: 'Година + ім’я',
          },
        },
        {
          next: 'cerca',
          phrase: {
            id: 'd2-c-cerca',
            it: 'Non ricordo l’ora esatta. Può controllare lei, per favore?',
            uk: 'Не пам’ятаю точну годину. Можете перевірити, будь ласка?',
            hint: 'Прохання глянути в системі',
          },
        },
        {
          next: 'lento',
          phrase: {
            id: 'd2-c-due-cose',
            it: 'Scusi, due cose insieme. Può fare una domanda alla volta?',
            uk: 'Вибачте, одразу два питання. Можна по одному?',
            hint: 'Занадто швидко',
          },
        },
      ],
    },
    cerca: {
      npc: {
        id: 'd2-n-trovato',
        it: 'Sì, la vedo in elenco. Allora andiamo avanti. Come si scrive il cognome?',
        uk: 'Так, бачу вас у списку. Далі. Як пишеться прізвище?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-spello',
            it: 'Lo spello: è un cognome straniero.',
            uk: 'Продиктую по літерах: прізвище іноземне.',
            hint: 'Спеллінг',
          },
        },
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-foglio-nome',
            it: 'Guardi qui, l’ho già scritto sul foglio.',
            uk: 'Подивіться сюди, я вже написав/написала на папірці.',
            hint: 'Показати написане',
          },
        },
      ],
    },
    lento: {
      npc: {
        id: 'd2-n-lento',
        it: 'Certo, scusi. Prima: l’orario. Poi il nome. Ha l’appuntamento stamattina?',
        uk: 'Звісно, вибачте. Спочатку година. Потім ім’я. Запис на сьогодні вранці?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-stamattina',
            it: 'Sì, stamattina. Ecco, il nome è questo.',
            uk: 'Так, сьогодні вранці. Ось, ім’я таке.',
            hint: 'Підтвердити запис',
          },
        },
        {
          next: 'residenza',
          phrase: {
            id: 'd2-c-anche-res',
            it: 'Sì. E vorrei anche la residenza, se è possibile oggi.',
            uk: 'Так. І ще residenza, якщо сьогодні можна.',
            hint: 'Запис + мета',
          },
        },
      ],
    },
    residenza: {
      npc: {
        id: 'd2-n-da-quando',
        it: 'Capito. Da quanto tempo abita in città? E ha già un indirizzo?',
        uk: 'Зрозуміло. Як давно живете в місті? І адреса вже є?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'indirizzo',
          phrase: {
            id: 'd2-c-da-poco',
            it: 'Da poco. Abito in via Roma, numero dodici.',
            uk: 'Недавно. Живу на via Roma, дванадцять.',
            hint: 'Коротко: час + адреса',
          },
        },
        {
          next: 'indirizzo',
          phrase: {
            id: 'd2-c-contratto',
            it: 'Sì, ho l’indirizzo sul contratto. Posso farle vedere.',
            uk: 'Так, адреса є в договорі. Можу показати.',
            hint: 'Оренда / контракт',
          },
        },
        {
          next: 'ripeti-quando',
          phrase: {
            id: 'd2-c-ripeti-quando',
            it: 'Non ho capito. Da quanto tempo… cosa, scusi?',
            uk: 'Не зрозумів/зрозуміла. «Як давно» — що саме, вибачте?',
            hint: 'Уточнити питання',
          },
        },
      ],
    },
    'ripeti-quando': {
      npc: {
        id: 'd2-n-ripeti-quando',
        it: 'Le chiedo solo se è arrivato da poco e se ha un indirizzo da dichiarare.',
        uk: 'Питаю лише: ви недавно приїхали і чи є адреса, яку заявити.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'indirizzo',
          phrase: {
            id: 'd2-c-chiaro-ind',
            it: 'Ah, sì. Sono arrivato da poco. L’indirizzo ce l’ho.',
            uk: 'А, так. Приїхав/приїхала недавно. Адреса є.',
            hint: 'Тепер ясно',
          },
        },
      ],
    },
    indirizzo: {
      npc: {
        id: 'd2-n-civico',
        it: 'Perfetto. Interno? Piano? A volte serve anche quello.',
        uk: 'Добре. Квартира? Поверх? Інколи це теж треба.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-interno',
            it: 'Interno tre, secondo piano. Lo scrivo qui.',
            uk: 'Квартира три, другий поверх. Напишу тут.',
            hint: 'Деталі адреси',
          },
        },
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-non-so-piano',
            it: 'Il civico sì. Il piano non lo so dire in italiano… è il secondo.',
            uk: 'Номер будинку так. Поверх італійською не скажу… це другий.',
            hint: 'Підказати числом',
          },
        },
        {
          next: 'scrivi-ind',
          phrase: {
            id: 'd2-c-scriva-lei',
            it: 'Può scriverlo lei, per favore? Ho paura di sbagliare.',
            uk: 'Можете написати ви, будь ласка? Боюсь помилитись.',
            hint: 'Адреса під диктовку',
          },
        },
      ],
    },
    'scrivi-ind': {
      npc: {
        id: 'd2-n-detti',
        it: 'Dica pure, piano. Via, numero, interno.',
        uk: 'Кажіть повільно. Вулиця, номер, квартира.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nome',
          phrase: {
            id: 'd2-c-detto',
            it: 'Via Roma dodici, interno tre. Grazie.',
            uk: 'Via Roma дванадцять, квартира три. Дякую.',
            hint: 'Диктувати по шматках',
          },
        },
      ],
    },
    nome: {
      npc: {
        id: 'd2-n-nome',
        it: 'Ora il nome completo, come sul passaporto. Anche il cognome, chiaro.',
        uk: 'Тепер повне ім’я, як у паспорті. І прізвище, чітко.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'docs',
          phrase: {
            id: 'd2-c-passaporto-nome',
            it: 'Guardi il passaporto, così non sbagliamo le lettere.',
            uk: 'Подивіться паспорт, щоб не помилитись у літерах.',
            hint: 'Ім’я з документа',
          },
        },
        {
          next: 'docs',
          phrase: {
            id: 'd2-c-dico-lento',
            it: 'Lo dico piano: nome, poi cognome.',
            uk: 'Скажу повільно: ім’я, потім прізвище.',
            hint: 'Продиктувати',
          },
        },
        {
          next: 'docs',
          phrase: {
            id: 'd2-c-due-cognomi',
            it: 'Attenzione: ho due cognomi. Tutti e due, per favore.',
            uk: 'Увага: у мене два прізвища. Обидва, будь ласка.',
            hint: 'Подвійне прізвище',
          },
        },
      ],
    },
    docs: {
      npc: {
        id: 'd2-n-docs',
        it: 'Bene. Adesso i documenti: passaporto e codice fiscale, prego.',
        uk: 'Добре. Тепер документи: паспорт і codice fiscale, будь ласка.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'controllo',
          phrase: {
            id: 'd2-c-ecco',
            it: 'Sì, ecco. Passaporto e codice fiscale.',
            uk: 'Так, ось. Паспорт і codice fiscale.',
            hint: 'Усе з собою',
          },
        },
        {
          next: 'manca',
          phrase: {
            id: 'd2-c-manca',
            it: 'Ho il passaporto. Il codice fiscale è a casa, scusi.',
            uk: 'Паспорт є. Codice fiscale лишився вдома, вибачте.',
            hint: 'Бракує одного',
          },
        },
        {
          next: 'docs-lento',
          phrase: {
            id: 'd2-c-piano-docs',
            it: 'Può ripetere un po’ più piano quali documenti, per favore?',
            uk: 'Можете повільніше повторити, які саме документи, будь ласка?',
            hint: 'Не встигли список',
          },
        },
      ],
    },
    'docs-lento': {
      npc: {
        id: 'd2-n-docs-lento',
        it: 'Certo. Uno: passaporto. Due: codice fiscale. Li ha tutti e due?',
        uk: 'Звісно. Один: паспорт. Два: codice fiscale. Обидва є?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'controllo',
          phrase: {
            id: 'd2-c-tutti-due',
            it: 'Sì, tutti e due. Li metto sul banco.',
            uk: 'Так, обидва. Кладу на стійку.',
            hint: 'Показати одразу',
          },
        },
        {
          next: 'manca',
          phrase: {
            id: 'd2-c-solo-uno',
            it: 'Solo il passaporto. Il secondo è a casa.',
            uk: 'Лише паспорт. Другий удома.',
            hint: 'Чесно',
          },
        },
      ],
    },
    controllo: {
      npc: {
        id: 'd2-n-controllo',
        it: 'Grazie. Un attimo che controllo. La foto è chiara, la data di scadenza?',
        uk: 'Дякую. Секунду, перевіряю. Фото чітке, а дата закінчення?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'modulo',
          phrase: {
            id: 'd2-c-valido',
            it: 'Sì, è ancora valido. Guardi qui, in basso.',
            uk: 'Так, ще дійсний. Подивіться тут, знизу.',
            hint: 'Термін паспорта',
          },
        },
        {
          next: 'modulo',
          phrase: {
            id: 'd2-c-non-vedo',
            it: 'Non vedo bene io. Me lo indica, per favore?',
            uk: 'Сам/сама погано бачу. Покажете, будь ласка?',
            hint: 'Разом глянути',
          },
        },
      ],
    },
    manca: {
      npc: {
        id: 'd2-n-manca',
        it: 'Va bene, non si preoccupi. Oggi possiamo preparare il modulo, ma il codice fiscale serve per chiudere. Lo porta dopo?',
        uk: 'Гаразд, не хвилюйтесь. Сьогодні можемо підготувати бланк, але codice fiscale потрібен, щоб закрити справу. Принесете потім?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'nota',
          phrase: {
            id: 'd2-c-porto',
            it: 'Sì, lo porto io. Può scrivermi su un foglio cosa manca?',
            uk: 'Так, принесу. Напишете на папірці, чого бракує?',
            hint: 'Список на потім',
          },
        },
        {
          next: 'nota',
          phrase: {
            id: 'd2-c-quando',
            it: 'Certo. Meglio se torno domani mattina, stesso sportello?',
            uk: 'Звісно. Краще завтра вранці, те саме вікно?',
            hint: 'Коли повернутись',
          },
        },
      ],
    },
    nota: {
      npc: {
        id: 'd2-n-nota',
        it: 'Sì. Le segno: codice fiscale. Intanto compili il modulo con nome e indirizzo.',
        uk: 'Так. Записую: codice fiscale. Тим часом заповніть бланк — ім’я та адреса.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'modulo',
          phrase: {
            id: 'd2-c-compilo-ora',
            it: 'Va bene, lo compilo adesso. Mi dà una penna?',
            uk: 'Добре, заповню зараз. Дасте ручку?',
            hint: 'Почати бланк',
          },
        },
      ],
    },
    modulo: {
      npc: {
        id: 'd2-n-modulo',
        it: 'Questo è il modulo. Nome, cognome, luogo e data di nascita, poi l’indirizzo. Vuole una penna?',
        uk: 'Це бланк. Ім’я, прізвище, місце і дата народження, потім адреса. Потрібна ручка?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'campi',
          phrase: {
            id: 'd2-c-penna',
            it: 'Sì, grazie. Quale riga per l’indirizzo, scusi?',
            uk: 'Так, дякую. Який рядок для адреси, вибачте?',
            hint: 'Ручка + орієнтир',
          },
        },
        {
          next: 'aiuto',
          phrase: {
            id: 'd2-c-aiuto',
            it: 'Sì. Mi può aiutare con i campi, per favore? Non voglio sbagliare.',
            uk: 'Так. Допоможете з полями, будь ласка? Не хочу помилитись.',
            hint: 'Разом заповнити',
          },
        },
        {
          next: 'nascita',
          phrase: {
            id: 'd2-c-luogo',
            it: 'Luogo di nascita: lo scrivo in italiano o come sul passaporto?',
            uk: 'Місце народження: італійською чи як у паспорті?',
            hint: 'Типове замішання',
          },
        },
      ],
    },
    nascita: {
      npc: {
        id: 'd2-n-nascita',
        it: 'Come sul passaporto va bene. Poi, se serve, lo sistemiamo noi.',
        uk: 'Як у паспорті — добре. Якщо треба, потім підправимо.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'campi',
          phrase: {
            id: 'd2-c-copio',
            it: 'Perfetto, allora copio dal passaporto. Grazie.',
            uk: 'Чудово, тоді копіюю з паспорта. Дякую.',
            hint: 'Просте рішення',
          },
        },
      ],
    },
    aiuto: {
      npc: {
        id: 'd2-n-aiuto',
        it: 'Certo. Qui il nome, sotto il cognome, poi l’indirizzo. Piano piano, nessuna fretta.',
        uk: 'Звісно. Тут ім’я, нижче прізвище, потім адреса. Повільно, без поспіху.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'campi',
          phrase: {
            id: 'd2-c-seguo',
            it: 'Ok, la seguo. Se sbaglio una lettera, mi dica.',
            uk: 'Ок, повторюю за вами. Якщо помилюсь у літері — скажіть.',
            hint: 'Писати підказкою',
          },
        },
      ],
    },
    campi: {
      npc: {
        id: 'd2-n-firma',
        it: 'Bene. In fondo c’è la firma. Poi mi riporti il foglio.',
        uk: 'Добре. Внизу підпис. Потім поверніть бланк.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'attesa',
          phrase: {
            id: 'd2-c-firmo',
            it: 'Firmo qui? Poi glielo riporto subito.',
            uk: 'Підписувати тут? Потім одразу поверну.',
            hint: 'Уточнити місце підпису',
          },
        },
        {
          next: 'attesa',
          phrase: {
            id: 'd2-c-rileggo',
            it: 'Un attimo, rileggo. Non voglio lasciare una riga vuota.',
            uk: 'Секунду, перечитаю. Не хочу лишити порожній рядок.',
            hint: 'Перевірити бланк',
          },
        },
      ],
    },
    attesa: {
      npc: {
        id: 'd2-n-attesa',
        it: 'Grazie. Ora lo carico. Il sistema è un po’ lento… resta qui, per favore.',
        uk: 'Дякую. Зараз внесу. Система трохи повільна… зачекайте тут, будь ласка.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'coda-dietro',
          phrase: {
            id: 'd2-c-aspetto',
            it: 'Certo, aspetto. Non c’è fretta.',
            uk: 'Звісно, зачекаю. Я не поспішаю.',
            hint: 'Спокійно постояти',
          },
        },
        {
          next: 'coda-dietro',
          phrase: {
            id: 'd2-c-posso-sedere',
            it: 'Posso sedermi un attimo lì, o resto in piedi?',
            uk: 'Можна сісти он там на хвилину, чи стояти тут?',
            hint: 'Не блокувати чергу',
          },
        },
      ],
    },
    'coda-dietro': {
      npc: {
        id: 'd2-n-coda',
        it: 'Resti qui. Se qualcuno protesta, è normale. Un minuto e ho finito.',
        uk: 'Залишайтесь тут. Якщо хтось бурчатиме — це нормально. Хвилина, і я закінчу.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'esito',
          phrase: {
            id: 'd2-c-ok-coda',
            it: 'Va bene. Grazie per la pazienza.',
            uk: 'Гаразд. Дякую за терпіння.',
            hint: 'Не виправдовуватись перед чергою',
          },
        },
      ],
    },
    esito: {
      npc: {
        id: 'd2-n-esito',
        it: 'Fatto per oggi. Se manca il codice fiscale, lo porta la prossima volta. Altrimenti è a posto.',
        uk: 'На сьогодні зроблено. Якщо бракує codice fiscale — принесете наступного разу. Інакше все гаразд.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'copia',
          phrase: {
            id: 'd2-c-copia',
            it: 'Posso avere una copia del modulo, per favore?',
            uk: 'Можна копію бланка, будь ласка?',
            hint: 'Забрати слід для себе',
          },
        },
        {
          next: 'quando-torno',
          phrase: {
            id: 'd2-c-manca-ancora',
            it: 'Mi manca ancora il codice fiscale. Quando posso tornare?',
            uk: 'Мені ще бракує codice fiscale. Коли можна повернутись?',
            hint: 'Закрити дірку в документах',
          },
        },
        {
          next: 'chiusura',
          phrase: {
            id: 'd2-c-tutto-ok',
            it: 'Perfetto, allora oggi è tutto. Grazie.',
            uk: 'Чудово, тоді на сьогодні все. Дякую.',
            hint: 'Якщо документів вистачило',
          },
        },
      ],
    },
    copia: {
      npc: {
        id: 'd2-n-copia',
        it: 'Certo. Tiene questo foglio. Non lo perda, le può servire.',
        uk: 'Звісно. Тримайте цей аркуш. Не загубіть, може знадобитись.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'chiusura',
          phrase: {
            id: 'd2-c-tengo',
            it: 'Lo metto subito in cartella. Grazie.',
            uk: 'Одразу кладу в папку. Дякую.',
            hint: 'Не зім’яти на виході',
          },
        },
      ],
    },
    'quando-torno': {
      npc: {
        id: 'd2-n-quando',
        it: 'Quando vuole, al mattino è meglio. Stesso ufficio, stesso tipo di numero.',
        uk: 'Коли зручно; вранці краще. Той самий офіс, той самий тип талона.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'chiusura',
          phrase: {
            id: 'd2-c-mattina',
            it: 'Va bene, torno in settimana, al mattino. Grazie.',
            uk: 'Добре, повернусь цього тижня вранці. Дякую.',
            hint: 'Зафіксувати план',
          },
        },
      ],
    },
    chiusura: {
      npc: {
        id: 'd2-n-chiusura',
        it: 'Se ha altre domande, mi chiami prima di andare. Altrimenti buona giornata.',
        uk: 'Якщо ще є питання — покличте, перш ніж іти. Інакше гарного дня.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'fine',
          phrase: {
            id: 'd2-c-niente',
            it: 'No, per ora è tutto chiaro. Grazie, è stato gentile. Arrivederci!',
            uk: 'Ні, поки все зрозуміло. Дякую, ви були люб’язні. До побачення!',
            hint: 'Теплий вихід',
          },
        },
        {
          next: 'ultima',
          phrase: {
            id: 'd2-c-ultima',
            it: 'Una cosa sola: il biglietto lo tengo o lo lascio?',
            uk: 'Ще одне: талон лишити собі чи віддати?',
            hint: 'Дрібниця, яку всі забувають',
          },
        },
      ],
    },
    ultima: {
      npc: {
        id: 'd2-n-biglietto',
        it: 'Può tenerlo, non serve più. Arrivederci.',
        uk: 'Можете лишити собі, він уже не потрібен. До побачення.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'fine',
          phrase: {
            id: 'd2-c-ciao',
            it: 'Perfetto. Buona giornata, arrivederci!',
            uk: 'Чудово. Гарного дня, до побачення!',
            hint: 'Фінальна репліка',
          },
        },
      ],
    },
    fine: {
      npc: {
        id: 'd2-n-fine',
        it: 'Arrivederci, buona giornata.',
        uk: 'До побачення, гарного дня.',
        hint: 'Sportello',
      },
      choices: [],
    },
  },
}

export function getDay2Phrases() {
  return collectPhrases(DAY2.nodes)
}
