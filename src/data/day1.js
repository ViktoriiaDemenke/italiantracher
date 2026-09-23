export const DAY1 = {
  day: 1,
  moduleId: 'anagrafe',
  type: 'immersion',
  title: 'Anagrafe',
  lead: 'Справжній ранок у комуні: знайти кабінет, взяти талон, постояти в черзі й спокійно почати розмову зі sportello.',
  cultura: {
    title: '💡 Cultura & Tip',
    body: 'Anagrafe — це не «вікно з чергою як у банку». Люди заходять, кивають, тихенько беруть numero e aspettano. Вітаються навіть з охоронцем і з сусідом по стільцю. Говоріть на «Lei», усміхайтеся коротко, не пояснюйте одразу всю біографію. Достатньо: хто ви, навіщо прийшли, і що документи вже в руках. Якщо не встигаєте за швидкістю — в Італії нормально сказати «più piano, per favore». Це звучить ввічливо, не як капітуляція.',
  },
  sections: [
    {
      id: 'ingresso',
      title: 'На вході',
      intro: 'Перші 20 секунд: ви загубились між коридорами, табличками і людьми з талонами.',
      phrases: [
        {
          id: 'd1-ing-1',
          it: 'Buongiorno, scusi… sto cercando l’anagrafe.',
          uk: 'Доброго дня, вибачте… я шукаю анаграфе.',
          hint: 'М’який старт, якщо не видно таблички',
        },
        {
          id: 'd1-ing-2',
          it: 'È questo lo sportello per la residenza?',
          uk: 'Це вікно для реєстрації місця проживання?',
          hint: 'Щоб не стати не в ту чергу',
        },
        {
          id: 'd1-ing-3',
          it: 'Devo prendere il numero, vero?',
          uk: 'Треба взяти талончик, так?',
          hint: 'Перевірка, як тут працює черга',
        },
      ],
    },
    {
      id: 'coda',
      title: 'Талон і черга',
      intro: 'Більшість візитів починається біля автомата. Коротко, чітко, без паніки.',
      phrases: [
        {
          id: 'd1-coda-1',
          it: 'Scusi, dove si prende il biglietto?',
          uk: 'Вибачте, де тут беруть талон?',
          hint: 'Коли автомат не одразу видно',
        },
        {
          id: 'd1-coda-2',
          it: 'Per l’iscrizione anagrafica, quale pulsante?',
          uk: 'Для реєстрації в анаграфе — яка кнопка?',
          hint: 'На автоматі часто кілька послуг',
        },
        {
          id: 'd1-coda-3',
          it: 'Aspetto il mio numero. Grazie.',
          uk: 'Чекаю свій номер. Дякую.',
          hint: 'Коли вже взяли талон і сідаєте',
        },
        {
          id: 'd1-coda-4',
          it: 'C’è molta gente oggi, vero?',
          uk: 'Сьогодні багато людей, правда?',
          hint: 'Легкий small talk із сусідом у черзі',
        },
      ],
    },
    {
      id: 'sportello',
      title: 'Біля вікна',
      intro: 'Ваш номер з’явився. Не біжіть: підійдіть, привітайтесь і скажіть одну ясну річ.',
      phrases: [
        {
          id: 'd1-sp-1',
          it: 'Buongiorno, sono appena arrivato in città.',
          uk: 'Доброго дня, я щойно приїхав у місто.',
          hint: 'Контекст без довгої історії',
        },
        {
          id: 'd1-sp-2',
          it: 'Vorrei iscrivermi all’anagrafe, per la residenza.',
          uk: 'Хотів/хотіла б зареєструватися в анаграфе, для residenza.',
          hint: 'Головна мета візиту',
        },
        {
          id: 'd1-sp-3',
          it: 'Ho un appuntamento alle dieci, mi chiamo…',
          uk: 'У мене запис на десяту, мене звати…',
          hint: 'Якщо бронювали онлайн',
        },
        {
          id: 'd1-sp-4',
          it: 'Non parlo ancora molto bene. Posso farle vedere i documenti?',
          uk: 'Я ще не дуже добре розмовляю. Можу показати документи?',
          hint: 'Чесно і практично: мова + дія',
        },
        {
          id: 'd1-sp-5',
          it: 'Ho il passaporto e il codice fiscale, ecco.',
          uk: 'Ось паспорт і codice fiscale.',
          hint: 'Те, що майже завжди просять першим',
        },
        {
          id: 'd1-sp-6',
          it: 'Devo compilare un modulo? Mi può aiutare, per favore?',
          uk: 'Треба заповнити бланк? Можете допомогти, будь ласка?',
          hint: 'Коли дають foglio і купу клітинок',
        },
      ],
    },
    {
      id: 'sopravvivenza',
      title: 'Коли не встигаєте за італійською',
      intro: 'Це не провал. Це робочі фрази, які рятують розмову і зберігають спокій.',
      phrases: [
        {
          id: 'd1-sv-1',
          it: 'Può parlare un po’ più piano, per favore?',
          uk: 'Можете говорити трохи повільніше, будь ласка?',
          hint: 'Найкорисніша фраза дня',
        },
        {
          id: 'd1-sv-2',
          it: 'Non ho capito, può ripetere?',
          uk: 'Я не зрозумів/зрозуміла, можете повторити?',
          hint: 'Без виправдань, прямо',
        },
        {
          id: 'd1-sv-3',
          it: 'Può scriverlo, per favore? Così è più chiaro.',
          uk: 'Можете це написати? Так буде зрозуміліше.',
          hint: 'Адреса, дата, номер sportello',
        },
        {
          id: 'd1-sv-4',
          it: 'Un attimo, sto cercando il documento…',
          uk: 'Секунду, шукаю документ…',
          hint: 'Коли риєтесь у папці біля вікна',
        },
        {
          id: 'd1-sv-5',
          it: 'Manca qualcosa? Lo porto la prossima volta.',
          uk: 'Чогось бракує? Принесу наступного разу.',
          hint: 'Спокійний план B, без суперечки',
        },
      ],
    },
    {
      id: 'uscita',
      title: 'На виході',
      intro: 'Навіть якщо відповідь «torni giovedì», закінчіть тепло. Це запам’ятовується.',
      phrases: [
        {
          id: 'd1-out-1',
          it: 'Grazie, è stato molto gentile.',
          uk: 'Дякую, ви були дуже люб’язні.',
          hint: 'Після допомоги за вікном',
        },
        {
          id: 'd1-out-2',
          it: 'Buona giornata, arrivederci!',
          uk: 'Гарного дня, до побачення!',
          hint: 'На виході — охоронцю й сусідам теж',
        },
      ],
    },
  ],
}

export function getDay1Phrases() {
  return DAY1.sections.flatMap((section) => section.phrases)
}
