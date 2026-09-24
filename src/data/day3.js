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

export const DAY3 = {
  day: 3,
  moduleId: 'anagrafe',
  type: 'boss',
  title: 'Anagrafe',
  badge: 'День 3 · Boss Level',
  lead: 'Симуляція всього візиту: черга, не те вікно, швидка мова за стойкою і спокійний вихід, навіть якщо щось пішло не так.',
  cultura: {
    title: '💡 Cultura & Tip',
    body: 'У «живому» anagrafe рідко все йде ідеально: талон, не те sportello, швидка італійська, прохання зачекати. Не сперечайтесь і не виправдовуйтесь довго. Коротка ввічливість, одне уточнення, потім дія: показати документи, попросити ripetere або scriverlo. На виході все одно «grazie, buona giornata».',
  },
  startId: 'coda',
  nodes: {
    coda: {
      npc: {
        id: 'd3-n-coda',
        it: 'Il numero, prego. Aspetti il suo turno sul tabellone.',
        uk: 'Талон, будь ласка. Чекайте свою чергу на табло.',
        hint: 'Вхід',
      },
      choices: [
        {
          next: 'attesa',
          phrase: {
            id: 'd3-c-numero',
            it: 'Grazie. Quale sportello per la residenza?',
            uk: 'Дякую. Яке вікно для residenza?',
            hint: 'Уточнити чергу',
          },
        },
        {
          next: 'biglietto',
          phrase: {
            id: 'd3-c-biglietto',
            it: 'Scusi, dove si prende il biglietto?',
            uk: 'Вибачте, де брати талон?',
            hint: 'Автомат не видно',
          },
        },
      ],
    },
    biglietto: {
      npc: {
        id: 'd3-n-auto',
        it: 'Lì, alla macchinetta. Poi si siede e aspetta.',
        uk: 'Он там, біля автомата. Потім сідайте й чекайте.',
        hint: 'Вхід',
      },
      choices: [
        {
          next: 'attesa',
          phrase: {
            id: 'd3-c-ok',
            it: 'Perfetto, grazie. Aspetto il mio numero.',
            uk: 'Добре, дякую. Чекаю свій номер.',
            hint: 'Сісти в чергу',
          },
        },
      ],
    },
    attesa: {
      npc: {
        id: 'd3-n-tab',
        it: 'Numero quarantasette, sportello tre.',
        uk: 'Номер сорок сім, вікно три.',
        hint: 'Табло',
      },
      choices: [
        {
          next: 'sbagliato',
          phrase: {
            id: 'd3-c-arrivo',
            it: 'Buongiorno, sono il quarantasette.',
            uk: 'Доброго дня, я сорок сім.',
            hint: 'Підійти, коли випало',
          },
        },
      ],
    },
    sbagliato: {
      npc: {
        id: 'd3-n-no',
        it: 'Questo sportello è per la carta d’identità. La residenza è all’altro sportello.',
        uk: 'Це вікно для carta d’identità. Residenza — за іншим вікном.',
        hint: 'Не те вікно',
      },
      choices: [
        {
          next: 'veloce',
          phrase: {
            id: 'd3-c-scusi',
            it: 'Ah, scusi tanto. Quale sportello, per favore?',
            uk: 'Ой, дуже вибачте. Яке саме вікно, будь ласка?',
            hint: 'Не сперечатись',
          },
        },
        {
          next: 'veloce',
          phrase: {
            id: 'd3-c-ripetere',
            it: 'Non ho capito. Può ripetere lo sportello?',
            uk: 'Не зрозумів/зрозуміла. Можете повторити номер вікна?',
            hint: 'Якщо пролетіло повз вуха',
          },
        },
      ],
    },
    veloce: {
      npc: {
        id: 'd3-n-fast',
        it: 'Sportello due. Avanti, prego, sono in ritardo con la coda.',
        uk: 'Вікно два. Давайте, будь ласка, черга вже затримується.',
        hint: 'Швидкий темп',
      },
      choices: [
        {
          next: 'pratica',
          phrase: {
            id: 'd3-c-res',
            it: 'Buongiorno, vorrei la residenza. Non parlo molto bene.',
            uk: 'Доброго дня, мені потрібна residenza. Я ще не дуже добре розмовляю.',
            hint: 'Одразу мета + темп',
          },
        },
        {
          next: 'pratica',
          phrase: {
            id: 'd3-c-piano',
            it: 'Un attimo, per favore. Può parlare più piano?',
            uk: 'Секунду, будь ласка. Можете говорити повільніше?',
            hint: 'Збити швидкість',
          },
        },
      ],
    },
    pratica: {
      npc: {
        id: 'd3-n-docs',
        it: 'Sì, sì. Passaporto, codice fiscale, e compilare il modulo. Subito.',
        uk: 'Так, так. Паспорт, codice fiscale і заповнити бланк. Одразу.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'attesa-sistema',
          phrase: {
            id: 'd3-c-ecco',
            it: 'Ecco il passaporto e il codice fiscale. Il modulo lo compilo qui?',
            uk: 'Ось паспорт і codice fiscale. Бланк заповнювати тут?',
            hint: 'Усе з собою',
          },
        },
        {
          next: 'buco',
          phrase: {
            id: 'd3-c-buco',
            it: 'Ho solo il passaporto. Il codice fiscale è a casa.',
            uk: 'Є лише паспорт. Codice fiscale вдома.',
            hint: 'Дірка в документах',
          },
        },
        {
          next: 'scrivi',
          phrase: {
            id: 'd3-c-scrivi',
            it: 'Può scriverlo, per favore? Così non sbaglio.',
            uk: 'Можете це написати, будь ласка? Щоб я не помилився/помилилась.',
            hint: 'Список на папірці',
          },
        },
      ],
    },
    scrivi: {
      npc: {
        id: 'd3-n-lista',
        it: 'Ecco: passaporto, codice fiscale, modulo. Poi mi richiama.',
        uk: 'Ось: паспорт, codice fiscale, бланк. Потім знову покличте.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'attesa-sistema',
          phrase: {
            id: 'd3-c-chiaro',
            it: 'Chiaro, grazie. Compilo e torno subito.',
            uk: 'Зрозуміло, дякую. Заповню і одразу повернусь.',
            hint: 'Після записки',
          },
        },
        {
          next: 'buco',
          phrase: {
            id: 'd3-c-ancora',
            it: 'Il codice fiscale però oggi non ce l’ho.',
            uk: 'Але codice fiscale сьогодні з собою немає.',
            hint: 'Усе одно бракує',
          },
        },
      ],
    },
    buco: {
      npc: {
        id: 'd3-n-buco',
        it: 'Allora oggi registriamo quello che c’è. Il codice fiscale lo porta la prossima volta, d’accordo?',
        uk: 'Тоді сьогодні фіксуємо те, що є. Codice fiscale принесете наступного разу, добре?',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'chiusura',
          phrase: {
            id: 'd3-c-accordo',
            it: 'D’accordo. Quando posso tornare, secondo lei?',
            uk: 'Добре. Коли, на вашу думку, можна повернутись?',
            hint: 'Не торгуватись — уточнити',
          },
        },
        {
          next: 'chiusura',
          phrase: {
            id: 'd3-c-nota',
            it: 'Va bene. Mi lascia un foglio con quello che manca?',
            uk: 'Гаразд. Залишите папірець, чого бракує?',
            hint: 'Щоб не забути вдома',
          },
        },
      ],
    },
    'attesa-sistema': {
      npc: {
        id: 'd3-n-lento',
        it: 'Il sistema è lento oggi… un attimo. Rimanga qui, per favore.',
        uk: 'Система сьогодні повільна… секунду. Залишайтесь тут, будь ласка.',
        hint: 'Очікування біля вікна',
      },
      choices: [
        {
          next: 'ok',
          phrase: {
            id: 'd3-c-aspetto',
            it: 'Certo, aspetto. Nessun problema.',
            uk: 'Звісно, зачекаю. Без проблем.',
            hint: 'Спокійно постояти',
          },
        },
        {
          next: 'ok',
          phrase: {
            id: 'd3-c-grazie-attesa',
            it: 'Grazie, non c’è fretta.',
            uk: 'Дякую, я не поспішаю.',
            hint: 'Зняти напругу',
          },
        },
      ],
    },
    ok: {
      npc: {
        id: 'd3-n-ok',
        it: 'Fatto. Per oggi va bene. Se serve un altro foglio, lo trova in bacheca.',
        uk: 'Готово. На сьогодні все. Якщо потрібен ще бланк — він на стенді.',
        hint: 'Sportello',
      },
      choices: [
        {
          next: 'chiusura',
          phrase: {
            id: 'd3-c-bacheca',
            it: 'Perfetto. La bacheca è qui vicino, vero?',
            uk: 'Чудово. Стенд он тут поруч, так?',
            hint: 'Остання практична деталь',
          },
        },
      ],
    },
    chiusura: {
      npc: {
        id: 'd3-n-end',
        it: 'Sì. Arrivederci, buona giornata.',
        uk: 'Так. До побачення, гарного дня.',
        hint: 'Вихід',
      },
      choices: [
        {
          next: 'fine',
          phrase: {
            id: 'd3-c-ciao',
            it: 'Grazie, è stato gentile. Buona giornata, arrivederci!',
            uk: 'Дякую, ви були люб’язні. Гарного дня, до побачення!',
            hint: 'Теплий фінал',
          },
        },
      ],
    },
    fine: {
      npc: {
        id: 'd3-n-fine',
        it: 'Arrivederci.',
        uk: 'До побачення.',
        hint: 'Вихід',
      },
      choices: [],
    },
  },
}

export function getDay3Phrases() {
  return collectPhrases(DAY3.nodes)
}
