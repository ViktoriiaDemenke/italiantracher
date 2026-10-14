import fs from 'fs'

/** Exact replacements for English `en` fields only. */
const MAP = new Map([
  [
    'Tax code. Without it, a residenza application is usually not closed.',
    'Tax identification code. Without it, a residence registration is usually not completed.',
  ],
  [
    'Residence permit in original, not just a photo on the phone.',
    'The original residence permit, not just a photo on your phone.',
  ],
  [
    'A 16-euro stamp for the application. People often buy it at a tabaccheria before the visit.',
    'A €16 revenue stamp for the application. People often buy it at a tobacco shop (tabaccheria) before the visit.',
  ],
  [
    'Good morning, I would like to submit a residence application.',
    'Good morning, I would like to submit the dichiarazione di residenza.',
  ],
  [
    'Where can I get the ticket?',
    'Where can I get a ticket?',
  ],
  [
    'Do I need to select Anagrafe on the totem?',
    'Do I need to select Anagrafe on the ticket machine?',
  ],
  [
    'What is the category for the dichiarazione di residenza?',
    'Which category is for the dichiarazione di residenza?',
  ],
  [
    'Do I also need the marca da bollo of sixteen euros?',
    'Do I also need the €16 marca da bollo?',
  ],
  [
    'My number has come up on the board.',
    'My number has come up on the display.',
  ],
  [
    'Good morning, thank you. Do I need to select Anagrafe for residence?',
    'Good morning, thank you. Do I need to select Anagrafe for the residence registration?',
  ],
  [
    "Hi, give me the number, I'm in a hurry.",
    "Hi, give me a number — I'm in a hurry.",
  ],
  [
    'Would you kindly indicate to me the electronic procedure for issuing the queue ticket?',
    'Would you kindly explain the electronic procedure for issuing a queue ticket?',
  ],
  [
    'Good morning. For the Anagrafe you take the ticket at the totem, over there on the left.',
    'Good morning. For Anagrafe you take a ticket at the machine, over there on the left.',
  ],
  [
    'I intend to avail myself of the option relating to the municipal anagrafe demografica.',
    'I intend to avail myself of the option pertaining to the municipal population register.',
  ],
  [
    "I'll take carta d'identità, it's the same office anyway.",
    "I'll take ID card — it's the same office anyway.",
  ],
  [
    "I'll go to the sportello anyway, there's nobody there.",
    "I'll go to the counter anyway; there's nobody there.",
  ],
  [
    'I shall scrupulously comply with the provisions regarding the call order.',
    'I shall scrupulously comply with the provisions concerning the call order.',
  ],
  [
    "Have you taken a ticket? Please wait for your number. Do not queue at the sportello without a number.",
    "Have you taken a ticket? Please wait for your number. Don't join the line at the counter without a number.",
  ],
  [
    "I'll go to sportello 1, it's closer.",
    "I'll go to counter 1; it's closer.",
  ],
  [
    "It's my number. I'm going to sportello 4 with my documents in order.",
    "That's my number. I'm going to counter 4 with my documents in order.",
  ],
  [
    "It's number 37, sportello 4.",
    "Number 37, counter 4.",
  ],
  [
    'At the Comune di Treviso, as in most comuni, the queue goes through the totem. For dichiarazione di residenza take the Anagrafe category, not Carta d\'identità. Use Lei, greet with Buongiorno. Keep documents ready: codice fiscale, permesso, contratto d\'affitto, marca da bollo 16€.',
    'At Treviso Town Hall, as in most Italian municipalities, you queue via the ticket machine. For the dichiarazione di residenza, choose the Anagrafe category, not Carta d\'identità. Use Lei and greet people with Buongiorno. Keep your documents ready: codice fiscale, permesso, contratto d\'affitto, and a €16 marca da bollo.',
  ],
  [
    "Marco’s number comes up. He goes to sportello 4. Behind the window is an impiegato. This is no longer the totem, but a live conversation: purpose of the visit, documents, a missing form, and calm Lei until arrivederci.",
    "Marco's number comes up. He goes to counter 4. Behind the window is a clerk. This is no longer the ticket machine, but a live conversation: the reason for the visit, the documents, a missing form, and calm Lei until arrivederci.",
  ],
  [
    'Here are the passport, the codice fiscale and the permesso.',
    "Here's my passport, codice fiscale and residence permit.",
  ],
  [
    "I haven't filled in the form. Could you give it to me, please?",
    "I haven't filled in the form. Could you give me one, please?",
  ],
  [
    'I live at via Roma twelve, with my wife and my daughter.',
    'I live at Via Roma 12, with my wife and daughter.',
  ],
  [
    'At the sportello, one answer for one question. If a modulo is missing, say so calmly and ask for the form. Do not excuse yourself at length. Spell your name as in the passport or show the document. Keep Lei until Grazie, arrivederci.',
    'At the counter, give one answer per question. If a form is missing, say so calmly and ask for one. Don’t give a long apology. Spell your name as in the passport, or show the document. Keep using Lei until Grazie, arrivederci.',
  ],
  [
    'I would like to submit to the office the application for iscrizione anagrafica.',
    'I should like to submit to the office an application for registration in the population register.',
  ],
  [
    'Hi, do my residence for me now.',
    'Hi, register my residence now.',
  ],
  [
    'Good morning, how can I help you?',
    'Good morning, how can I help you?',
  ],
  [
    'I have complied with the booking procedure by means of the electronic totem.',
    'I have complied with the booking procedure by means of the electronic ticket machine.',
  ],
  [
    "I don't have a number, but the queue is long and I have to work.",
    "I don't have a number, but the queue is long and I have a job to get to.",
  ],
  [
    'I took the ticket at the totem, category Anagrafe. This is my number.',
    'I took a ticket at the machine, Anagrafe category. This is my number.',
  ],
  [
    'All right. Do you already have an appointment, or did you come with the totem number?',
    'All right. Do you already have an appointment, or did you come with a ticket from the machine?',
  ],
  [
    'Yes, here are the passport, the codice fiscale, the permesso and the rental contract. I\'ll put them here.',
    "Yes — here's my passport, codice fiscale, residence permit and rental contract. I'll put them here.",
  ],
  [
    'Look on the phone, I have photos. The originals are at home.',
    "Look on my phone — I have photos. The originals are at home.",
  ],
  [
    'I hereby hand over the entire identification and contractual documentation in original.',
    'I hereby submit the complete identification and contractual documentation in the original.',
  ],
  [
    'The documents, please: the passport, the codice fiscale, the permesso di soggiorno and the rental contract.',
    'Your documents, please: passport, codice fiscale, residence permit and rental contract.',
  ],
  [
    'Regrettably I have not proceeded with the prior completion of the form downloaded from the institutional portal.',
    'Unfortunately I have not completed in advance the form downloaded from the institutional portal.',
  ],
  [
    "That's not my problem, you have to do it.",
    "That's not my problem — you have to do it.",
  ],
  [
    "The contract is here. But I don't see the already completed dichiarazione form. Did you print it from the Comune website?",
    "The contract is here. But I don't see a completed declaration form. Did you print it from the Comune website?",
  ],
  [
    "You sign it, it's the same anyway.",
    "You sign it — it's all the same anyway.",
  ],
  [
    'I kindly ask you to likewise explain each field of the form to me.',
    'I kindly ask you to explain each field of the form to me in the same way.',
  ],
  [
    'Yes, thank you. Which line is for the address and for family members, sorry?',
    'Yes, thank you. Sorry — which line is for the address, and which is for family members?',
  ],
  [
    "I'll give you the form. First name, last name, date and place of birth, address, household members. Do you have a pen?",
    "I'll give you the form. First name, last name, date and place of birth, address, household members. Do you have a pen?",
  ],
  [
    "Yes, I live alone. The others aren't needed.",
    "Yes, I live alone. The others aren't needed.",
  ],
  [
    'My household consists of a spouse and a daughter living at the same address.',
    'My household consists of my spouse and daughter, living at the same address.',
  ],
  [
    "Do you live alone or with other family members? We need everyone's documents.",
    "Do you live alone or with other family members? We need everyone's documents.",
  ],
  [
    'I have proceeded with the purchase of the required telematic stamp for the imposta di bollo.',
    'I have purchased the required electronic stamp duty as prescribed.',
  ],
  [
    "I'll pay later, when you give me the residence.",
    "I'll pay later, when you give me the residence certificate.",
  ],
  [
    'The 16-euro marca da bollo is still missing. Do you have it?',
    'The €16 marca da bollo is still missing. Do you have it?',
  ],
  [
    "I won't sign unless you give me the card first.",
    "I won't sign unless you give me the card first.",
  ],
  [
    "I'll sign here. If a letter of the surname isn't clear, I'll say it letter by letter, if you wish.",
    "I'll sign here. If a letter of the surname isn't clear, I'll say it letter by letter, if you like.",
  ],
  [
    "Good. The signature is at the bottom. Then bring it back to me. I'll check the details against the passport.",
    "Good. Sign at the bottom, then bring it back to me. I'll check the details against the passport.",
  ],
  [
    "Hurry up, I have a bus. Do me first.",
    "Hurry up, I have a bus to catch. Do me first.",
  ],
  [
    'I shall patiently await the completion of the computer data entry.',
    'I shall wait patiently for the data entry to be completed.',
  ],
  [
    "One moment while I load everything. The system is slow. Please stay here. Then I'll explain the Polizia Locale checks.",
    "One moment while I load everything. The system is slow. Please stay here. Then I'll explain the local police checks.",
  ],
  [
    'I thank you sincerely for the prompt handling of the administrative procedure.',
    'I thank you sincerely for the prompt handling of this administrative procedure.',
  ],
  [
    "No, everything is clear. Thank you, you've been kind. Goodbye.",
    "No, everything is clear. Thank you, you've been very kind. Goodbye.",
  ],
  [
    "Then why don't you give me the carta d'identità right away?",
    "Then why don't you give me an ID card right away?",
  ],
  [
    'Done. Keep the receipt. In the following days the municipal police may come to check that you really live there. Any other questions?',
    'Done. Keep the receipt. Over the next few days the municipal police may come to check that you really live there. Any other questions?',
  ],
  [
    'Residenza successfully obtained!',
    'Residence registration complete!',
  ],
  [
    'Treviso town hall, this morning. From the totem to the receipt. No translations, no explanations.',
    'Treviso Town Hall, this morning. From the ticket machine to the receipt. No translations, no explanations.',
  ],
  [
    "It's my number. I'm going to sportello 4.",
    "That's my number. I'm going to counter 4.",
  ],
  [
    "Oh, I'm so sorry. I'll go to sportello 4, thank you.",
    "Oh, I'm so sorry. I'll go to counter 4, thank you.",
  ],
  [
    'Here they are, all originals: the passport, the codice fiscale, the permesso and the contract.',
    "Here they are, all originals: the passport, codice fiscale, residence permit and contract.",
  ],
  [
    "I live at via Roma twelve, interno three, second floor. I live with my wife and my daughter.",
    'I live at Via Roma 12, interior 3, second floor. I live with my wife and daughter.',
  ],
  [
    "Thank you for the indication regarding the ticket-issuing machine.",
    'Thank you for the information regarding the ticket-issuing machine.',
  ],
  [
    'Good morning. For the Anagrafe the totem is on the left. Then wait for your number.',
    'Good morning. For Anagrafe the ticket machine is on the left. Then wait for your number.',
  ],
  [
    'I opt for the item concerning iscrizione anagrafica.',
    'I opt for the item concerning registration in the population register.',
  ],
  [
    "I'll ask at the sportello if I can go through, there's room anyway.",
    "I'll ask at the counter if I can go through; there's room anyway.",
  ],
  [
    'Please sit down. The number comes up on the board. Do not approach the sportello beforehand.',
    'Please take a seat. The number comes up on the display. Do not approach the counter beforehand.',
  ],
  [
    "I'll go to sportello 2, there are fewer people.",
    "I'll go to counter 2; there are fewer people.",
  ],
  [
    'I proceed to the counter corresponding to the illuminated notice.',
    'I shall proceed to the counter corresponding to the illuminated notice.',
  ],
  [
    'I beg your pardon for the misunderstanding and I head toward the indicated sportello.',
    'I beg your pardon for the misunderstanding and shall proceed to the indicated counter.',
  ],
  [
    "It's the same Comune, you can do it.",
    "It's the same town hall — you can do it.",
  ],
  [
    'This sportello is for carta d\'identità. Residence is at sportello 4.',
    'This counter is for ID cards. Residence registration is at counter 4.',
  ],
  [
    'Good morning. I submit to you the queue ticket and the residence application.',
    'Good morning. I submit to you the queue ticket and the residence application.',
  ],
  [
    'Hi. I want the residence, and fast.',
    'Hi. I want residency, and fast.',
  ],
  [
    'Good morning, how can I help you? Do you have a number?',
    'Good morning, how can I help you? Do you have a number?',
  ],
  [
    'I deposit with you the entire documentation in original as requested.',
    'I hereby submit the complete documentation in the original, as requested.',
  ],
  [
    'I need the documents: the passport, the codice fiscale, the permesso and the rental contract.',
    'I need the documents: passport, codice fiscale, residence permit and rental contract.',
  ],
  [
    'I shall immediately proceed with completion and delivery of the marca da bollo.',
    'I shall immediately complete the form and hand over the revenue stamp.',
  ],
  [
    "You do it. I'll sign later, if it suits me.",
    "You do it. I'll sign later, if it suits me.",
  ],
  [
    "The dichiarazione form isn't here. Fill it in now. And the 16-euro marca da bollo?",
    "The declaration form isn't here. Fill it in now. And the €16 marca da bollo?",
  ],
  [
    "It's a street in the centre. I don't remember the details.",
    "It's a street in the center. I don't remember the details.",
  ],
  [
    'The dwelling is located at via Roma 12, interno 3, second floor, with a cohabiting household.',
    'The dwelling is situated at Via Roma 12, interior 3, second floor, with a cohabiting household.',
  ],
  [
    'What is the household? Please tell me the full address, the interno and the floor.',
    'Who is in the household? Please give me the full address, the interior number and the floor.',
  ],
  [
    "I'll be back in an hour, call me on my mobile.",
    "I'll be back in an hour — call me on my cell phone.",
  ],
  [
    'I affix the signature and wait for the system to load.',
    'I shall affix my signature and await the loading of the system.',
  ],
  [
    "Sign at the bottom. Then stay a moment: I'm loading the data.",
    "Sign at the bottom. Then stay a moment — I'm loading the data.",
  ],
  [
    'I take note of the possible verification by the Polizia Locale at the domicile.',
    'I take note of a possible check by the local police at the domicile.',
  ],
  [
    "The municipal police at home? Then I'm not signing anything.",
    "The municipal police at home? Then I'm not signing anything.",
  ],
  [
    'The system is slow today. Please stay here. Then a check by the municipal police at home may follow in the coming days.',
    'The system is slow today. Please stay here. A home check by the municipal police may follow in the coming days.',
  ],
  [
    'Thank you for issuing the receipt and I wish you a good continuation of your day.',
    'Thank you for issuing the receipt, and I wish you a pleasant rest of your day.',
  ],
  [
    'This paper is the definitive residence, right? Then give me the ID as well.',
    'This paper is the final residence certificate, right? Then give me an ID card as well.',
  ],
  [
    "I'll show you a list of available doctors in your area. This doctor is close to your home and has a place.",
    "I'll show you a list of available doctors in your area. This doctor is close to your home and still has availability.",
  ],
  [
    'For evening and holiday urgencies there is the guardia medica. For serious emergencies there is the pronto soccorso, open 24 hours a day.',
    'For evening and holiday urgent cases there is the after-hours doctor (guardia medica). For serious emergencies there is the emergency room (pronto soccorso), open 24 hours a day.',
  ],
  [
    'Laura has recently moved to Padua. After registering her residenza at the Anagrafe she takes the next important step — she goes to the ASL (Azienda Sanitaria Locale) to enrol in the SSN (Servizio Sanitario Nazionale), get a Tessera Sanitaria and choose a family doctor (Medico di base). She has with her: passaporto, permesso di soggiorno, codice fiscale and dichiarazione di residenza.',
    'Laura has recently moved to Padua. After registering her residence at the Anagrafe she takes the next important step — she goes to the ASL (local health authority) to enroll in the SSN (national health service), get a Tessera Sanitaria and choose a family doctor (medico di base). She has with her: her passport, residence permit, tax code and declaration of residence.',
  ],
  [
    'Where should I go in case of emergency?',
    'Where should I go in an emergency?',
  ],
  [
    'Enrolment in the SSN with a residence permit (Permesso di soggiorno) is completely free. When speaking to ASL staff, always use the polite form \'Lei\' and greet with \'Buongiorno\'.',
    'Enrollment in the SSN with a residence permit (permesso di soggiorno) is completely free. When speaking to ASL staff, always use the polite form Lei and greet them with Buongiorno.',
  ],
  [
    'Visit to the ASL: Card registration and choosing a doctor',
    'Visit to the ASL: registering for a health card and choosing a doctor',
  ],
  [
    'Laura enters the ASL office and goes to the window (sportello). The clerk checks her documents and confirms her right to free enrolment in the SSN.',
    'Laura enters the ASL office and goes to the counter (sportello). The clerk checks her documents and confirms her right to free enrollment in the SSN.',
  ],
  [
    'Yes, it seems convenient. It\'s close to my home, I\'ll choose this one.',
    "Yes, that seems convenient. It's close to my home — I'll choose this one.",
  ],
  [
    'The definitive card arrives today, I\'ll wait here for three hours.',
    "The permanent card arrives today; I'll wait here for three hours.",
  ],
  [
    'Final exam of the module! Laura goes through the whole path in Padua on her own: from checking documents to choosing a doctor and telling Guardia Medica from Pronto Soccorso. Hints and translation are off!',
    'Final exam of the module! Laura goes through the whole process in Padua on her own: from checking documents to choosing a doctor and telling Guardia Medica from Pronto Soccorso. Hints and translations are off!',
  ],
  [
    'Where should you go in case of a serious, round-the-clock threat to health?',
    'Where should you go in a serious, round-the-clock medical emergency?',
  ],
  [
    'What will the clerk reply about the cost of registration with a Permesso di Soggiorno?',
    'What will the clerk say about the cost of registration with a residence permit?',
  ],
  [
    'Enrolment in the SSN with a residence permit is free.',
    'Enrollment in the SSN with a residence permit is free.',
  ],
  [
    'Congratulations! You successfully completed the simulation, received a Tessera Sanitaria and chose a family doctor in Italy!',
    'Congratulations! You have completed the simulation, received a Tessera Sanitaria and chosen a family doctor in Italy!',
  ],
  [
    "Marco and Laura decided to have lunch at a local family trattoria in Treviso. In Italy food culture gets special attention: it is important to know how to book a table, order water, understand what 'coperto' on the bill is, and how to ask for coffee after lunch.",
    "Marco and Laura have decided to have lunch at a local family trattoria in Treviso. In Italy, food culture gets special attention: you need to know how to book a table, order water, understand the coperto charge on the bill, and how to ask for coffee after lunch.",
  ],
  [
    'Coperto is a charge for bread and table setting (usually €1.50–€3.00 per person, listed on the menu).',
    'Coperto is a cover charge for bread and table setting (usually €1.50–€3.00 per person, listed on the menu).',
  ],
  [
    'Cappuccino in Italy is drunk only until 11:00 in the morning. After lunch people order Caffè espresso or Macchiato.',
    'In Italy, cappuccino is usually drunk only until 11:00 in the morning. After lunch people order caffè espresso or a macchiato.',
  ],
  [
    "Water is always served in bottles: you must specify 'naturale' (still) or 'frizzante' (sparkling).",
    "Water is always served in bottles: you must specify naturale (still) or frizzante (sparkling).",
  ],
  [
    'In Italian restaurants lunch (pranzo) usually runs from 12:30 to 14:30, and dinner (cena) does not start before 19:30 or 20:00.',
    'In Italian restaurants, lunch (pranzo) usually runs from 12:30 to 14:30, and dinner (cena) does not start before 19:30 or 20:00.',
  ],
  [
    "Marco and Laura enter the trattoria. The waiter (Cameriere) meets them at the door and takes them to a table.",
    'Marco and Laura enter the trattoria. The waiter (cameriere) greets them at the door and takes them to a table.',
  ],
  [
    "I'd like two large Coca-Colas with ice and lemon, like at a fast food.",
    "I'd like two large Coca-Colas with ice and lemon, like at a fast-food restaurant.",
  ],
  [
    "Yes! For primo we'll take two tagliatelle al ragù, and for secondo a tagliata di manzo to share.",
    "Yes! For the first course we'll have two tagliatelle al ragù, and for the second a tagliata di manzo to share.",
  ],
  [
    "I would like a milky tea and a large beer, after the pasta.",
    "I'd like a milky tea and a large beer, after the pasta.",
  ],
  [
    'No, thank you. When possible, could we have the bill?',
    'No, thank you. When you can, could you bring us the bill, please?',
  ],
  [
    "Yes, I'd like another primo. Bring the bill on your own, without asking.",
    "Yes, I'd like another first course. Bring the bill on your own, without asking.",
  ],
  [
    "We'll pay with two-hundred notes, no tip and no receipt.",
    "We'll pay with two-hundred-euro notes, no tip and no receipt.",
  ],
  [
    'In Italy the bill is not brought automatically as soon as you finish eating — that is seen as rushing the guest. You have to tell the waiter yourself: \'Il conto, per favore\'.',
    'In Italy the bill is not brought automatically as soon as you finish eating — that is seen as rushing the guest. You have to ask the waiter yourself: Il conto, per favore.',
  ],
  [
    'Final exam of the module! You order lunch in a trattoria on your own, talk to the waiter, choose the right drinks and pay. Hints and translation are off!',
    'Final exam of the module! You order lunch in a trattoria on your own, talk to the waiter, choose the right drinks and pay. Hints and translations are off!',
  ],
  [
    "Congratulations! You have fully learned Italian restaurant etiquette, you order dishes easily and you can read the bill!",
    'Congratulations! You have fully learned Italian restaurant etiquette, you can order dishes with ease, and you can read the bill!',
  ],
  [
    "Laura is looking for a new apartment in Padua/Treviso. On a listings portal she found an attractive option, but to rent in Italy you need the terms: tell 'monolocale' from 'trilocale', understand 'spese condominiali' (building charges) and how many months the 'caparra' (deposit) is.",
    'Laura is looking for a new apartment in Padua or Treviso. On a listings portal she found an attractive option, but to rent in Italy you need the vocabulary: tell monolocale from trilocale, understand spese condominiali (building charges) and how many months the caparra (deposit) is.',
  ],
  [
    'I saw your advertisement for the apartment for rent.',
    'I saw your listing for the apartment for rent.',
  ],
  [
    'When can we make an appointment to see it?',
    'When can we arrange an appointment to see it?',
  ],
  [
    'Good morning Signor Mario, this is Laura. I\'m calling about the advertisement for the apartment for rent. Is it still available?',
    "Good morning, Mr. Mario, this is Laura. I'm calling about the listing for the apartment for rent. Is it still available?",
  ],
  [
    'Hello! Who\'s speaking?',
    "Hello? Who's speaking?",
  ],
  [
    'Yes, the utilities should be put in your name. We\'re also asking for three months\' deposit.',
    "Yes, the utilities should be put in your name. We're also asking for a deposit of three months' rent.",
  ],
  [
    "Thank you very much, Mr. Mario, see you tomorrow! Have a good day.",
    'Thank you very much, Mr. Mario — see you tomorrow! Have a good day.',
  ],
  [
    "The term 'Voltura' means transferring existing electricity/gas contracts into your name, and 'Subentro' is a new connection if the meters were sealed.",
    'Voltura means transferring existing electricity or gas contracts into your name; subentro is a new connection if the meters were sealed.',
  ],
  [
    'How do you tell the landlord \'When can we arrange a meeting to see the apartment?\'',
    "How do you tell the landlord, “When can we arrange a viewing of the apartment?”",
  ],
  [
    "'Bilocale' = a two-room dwelling.",
    "'Bilocale' = a two-room apartment.",
  ],
  [
    'Marco and Laura have come to a Poste Italiane office. In Italy the post office is not only parcels, but also a place to pay utility bills, collect official letters and use financial services. At the entrance you must take a ticket from the terminal according to your request.',
    'Marco and Laura have come to a Poste Italiane office. In Italy the post office is not only for parcels: it is also where you pay utility bills, collect official letters and use financial services. At the entrance you must take a ticket from the terminal according to your request.',
  ],
  [
    'I received a pickup notice for a registered letter.',
    'I received a collection notice for a registered letter.',
  ],
  [
    'Which button do I have to press to get a ticket?',
    'Which button do I press to get a ticket?',
  ],
  [
    "I'd like to make an appointment to do the ISEE form.",
    "I'd like to book an appointment to complete the ISEE form.",
  ],
  [
    'I need to do an updated ISEE.',
    'I need to complete an updated ISEE.',
  ],
  [
    "Good morning, ma'am! Please, take a seat. Did you have an appointment under the name Laura?",
    "Good morning, ma'am! Please take a seat. Did you have an appointment in the name of Laura?",
  ],
  [
    "Thank you very much for your help! Have a good day and good luck with your work.",
    'Thank you very much for your help! Have a good day, and all the best with your work.',
  ],
  [
    'Do I get the receipt at the till first?',
    'Do I pay and get the receipt at the till first?',
  ],
  [
    "Both plain, but with cream and Nutella on top, takeaway hot.",
    'Both plain, but with cream and Nutella on top, hot, to take away.',
  ],
  [
    "That's 5 euros 20 in total. Here you go, here's the receipt. You can leave it at the counter.",
    "That's €5.20 in total. Here you go — here's the receipt. You can leave it at the counter.",
  ],
  [
    'Remember to validate the ticket before getting on!',
    "Let's remember to validate the ticket before we get on!",
  ],
  [
    "We're traveling by train.",
    "We're travelling by train.",
  ],
  [
    "I'd just like a trim of the ends and a blow-dry, please.",
    "I'd just like the ends trimmed and a blow-dry, please.",
  ],
  [
    "I'd like a beard trim / a shave.",
    "I'd like a beard trim / a shave.",
  ],
  [
    "I'd just like to trim one centimeter.",
    "I'd just like to trim one centimetre.",
  ],
  [
    "Your daily intensive for confident life in Italy. From the town hall to the restaurant — speak without barriers!",
    'Your daily intensive course for a confident life in Italy. From the town hall to the restaurant — speak without barriers!',
  ],
  [
    'The purchase store is not configured yet',
    'In-app purchases are not set up yet',
  ],
  [
    "Hints and translation are off!",
    'Hints and translations are off!',
  ],
])

function applyEn(node) {
  if (node == null) return { n: 0 }
  let n = 0
  if (Array.isArray(node)) {
    for (const item of node) n += applyEn(item).n
    return { n }
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'en' && typeof v === 'string' && MAP.has(v)) {
        node[k] = MAP.get(v)
        n += 1
      } else {
        n += applyEn(v).n
      }
    }
  }
  return { n }
}

let total = 0
for (let d = 1; d <= 30; d++) {
  const p = `src/content/day${d}.json`
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  const { n } = applyEn(data)
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  total += n
  console.log('day' + d, n)
}

const locPath = 'src/locales/en.json'
const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
function applyUi(obj) {
  let n = 0
  if (typeof obj === 'string') return { n: 0, v: MAP.has(obj) ? MAP.get(obj) : obj, changed: MAP.has(obj) }
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
      if (typeof v === 'string' && MAP.has(v)) {
        out[k] = MAP.get(v)
        n += 1
      } else if (v && typeof v === 'object') {
        const r = applyUi(v)
        out[k] = r.v ?? v
        n += r.n
      } else out[k] = v
    }
    return { n, v: out }
  }
  return { n, v: obj }
}
const r = applyUi(loc)
fs.writeFileSync(locPath, JSON.stringify(r.v, null, 2) + '\n')
console.log('locale', r.n, 'total', total + r.n)
