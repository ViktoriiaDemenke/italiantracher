import fs from 'fs'

const MAP = new Map([
  [
    'Code fiscal. Sans lui, la demande de residenza n’est en général pas clôturée.',
    'Code fiscal. Sans lui, la demande de residenza n’aboutit généralement pas.',
  ],
  [
    'Permis de séjour en original, pas seulement une photo sur le téléphone.',
    'Le permis de séjour original, pas seulement une photo sur le téléphone.',
  ],
  [
    'Marque de 16 euros pour la demande. On l’achète souvent en tabaccheria avant la visite.',
    'Timbre fiscal de 16 euros pour la demande. On l’achète souvent en tabaccheria avant la visite.',
  ],
  [
    'Bonjour, je voudrais déposer la demande de résidence.',
    'Bonjour, je voudrais déposer la dichiarazione di residenza.',
  ],
  [
    'Où puis-je prendre le ticket ?',
    'Où puis-je prendre un ticket ?',
  ],
  [
    'Dois-je sélectionner Anagrafe sur le totem ?',
    'Dois-je sélectionner Anagrafe sur la borne ?',
  ],
  [
    'Faut-il aussi la marca da bollo de seize euros ?',
    'Faut-il aussi la marca da bollo de 16 euros ?',
  ],
  [
    'Mon numéro est apparu sur le tableau.',
    'Mon numéro est apparu sur l’écran.',
  ],
  [
    'Bonjour, merci. Dois-je sélectionner Anagrafe pour la résidence ?',
    'Bonjour, merci. Dois-je sélectionner Anagrafe pour l’inscription de résidence ?',
  ],
  [
    "Salut, donne-moi le numéro, je suis pressé.",
    'Salut, donne-moi un numéro, je suis pressé.',
  ],
  [
    "Je vous prie de bien vouloir m'indiquer la procédure télématique d'émission du titre de file.",
    'Je vous prie de bien vouloir m’indiquer la procédure électronique d’émission du ticket de file d’attente.',
  ],
  [
    "Bonjour. Pour l'Anagrafe, on prend le ticket au totem, là à gauche.",
    'Bonjour. Pour l’Anagrafe, on prend le ticket à la borne, là à gauche.',
  ],
  [
    "J'entends me prévaloir de l'option relative à l'anagrafe demografica communale.",
    'J’entends me prévaloir de l’option relative à l’anagrafe demografica communale.',
  ],
  [
    "Je prends carta d'identità, c'est le même bureau de toute façon.",
    'Je prends carta d’identità : c’est le même bureau de toute façon.',
  ],
  [
    "J'y vais quand même au sportello, il n'y a personne.",
    'J’y vais quand même au guichet : il n’y a personne.',
  ],
  [
    "Avez-vous pris le ticket ? Attendez votre numéro. Ne vous mettez pas en file au sportello sans numéro.",
    'Avez-vous pris un ticket ? Attendez votre numéro. Ne vous mettez pas en file au guichet sans numéro.',
  ],
  [
    'Je vais au sportello 1, c’est plus près.',
    'Je vais au guichet 1, c’est plus près.',
  ],
  [
    "C'est mon numéro. Je vais au sportello 4 avec les documents en ordre.",
    'C’est mon numéro. Je vais au guichet 4 avec les documents en ordre.',
  ],
  [
    "Ayant constaté l'avis électronique, je me rends immédiatement au comptoir indiqué.",
    'Ayant constaté l’affichage électronique, je me rends immédiatement au guichet indiqué.',
  ],
  [
    'C’est le numéro 37, sportello 4.',
    'C’est le numéro 37, guichet 4.',
  ],
  [
    'Le numéro de Marco s’affiche. Il s’approche du sportello 4. Derrière le guichet, un impiegato. Ce n’est plus le totem, mais une conversation réelle : but de la visite, documents, le formulaire manquant, et un Lei calme jusqu’à arrivederci.',
    'Le numéro de Marco s’affiche. Il s’approche du guichet 4. Derrière le guichet, un impiegato. Ce n’est plus la borne, mais une vraie conversation : motif de la visite, documents, le formulaire manquant, et un Lei calme jusqu’à arrivederci.',
  ],
  [
    "J'habite via Roma douze, avec ma femme et ma fille.",
    'J’habite via Roma 12, avec ma femme et ma fille.',
  ],
  [
    "Je souhaiterais soumettre à l'attention du bureau l'instance d'iscrizione anagrafica.",
    'Je souhaiterais soumettre à l’attention du bureau la demande d’iscrizione anagrafica.',
  ],
  [
    "J'ai satisfait à la procédure de réservation au moyen du totem électronique.",
    'J’ai accompli la procédure de réservation au moyen de la borne électronique.',
  ],
  [
    "Je vous remets ci-après l'ensemble de la documentation identificative et contractuelle en original.",
    'Je vous remets ci-après l’ensemble des originaux des documents d’identité et du contrat.',
  ],
  [
    "Malheureusement, je n'ai pas procédé à la compilation préalable du formulaire téléchargé depuis le portail institutionnel.",
    'Malheureusement, je n’ai pas procédé au remplissage préalable du formulaire téléchargé sur le portail institutionnel.',
  ],
  [
    "Je vous prie de m'illustrer de même chaque champ du formulaire.",
    'Je vous prie de m’expliquer de même chaque champ du formulaire.',
  ],
  [
    "Mon nucleo familiare est composé du conjoint et de la fille cohabitant à la même adresse.",
    'Mon nucleo familiare est composé du conjoint et de la fille, cohabitant à la même adresse.',
  ],
  [
    "J'ai procédé à l'achat du contrassegno telematico de l'imposta di bollo prévue.",
    'J’ai procédé à l’achat du contrassegno telematico de l’imposta di bollo prévue.',
  ],
  [
    "Je ne signe pas si vous ne me donnez pas d'abord la carte.",
    'Je ne signe pas si vous ne me donnez pas d’abord la carte.',
  ],
  [
    "Je signe ici. Si une lettre du nom n'est pas claire, je l'épelle, si vous voulez.",
    'Je signe ici. Si une lettre du nom n’est pas claire, je l’épelle lettre par lettre, si vous voulez.',
  ],
  [
    "Dépêchez-vous, j'ai un bus. Faites-moi en premier.",
    'Dépêchez-vous, j’ai un bus. Passez-moi en premier.',
  ],
  [
    "J'attendrai patiemment l'achèvement de la saisie informatique des données.",
    'J’attendrai patiemment la fin de la saisie informatique des données.',
  ],
  [
    'Residenza obtenue avec succès !',
    'Residenza enregistrée avec succès !',
  ],
  [
    'Comune de Trévise, ce matin. Du totem au reçu. Pas de traductions, pas d’explications.',
    'Comune de Trévise, ce matin. De la borne au reçu. Pas de traductions, pas d’explications.',
  ],
  ['Bonjour, merci. Je vais au totem.', 'Bonjour, merci. Je vais à la borne.'],
  [
    "C'est mon numéro. Je vais au sportello 4.",
    'C’est mon numéro. Je vais au guichet 4.',
  ],
  [
    'Ah, excusez-moi beaucoup. Je vais au sportello 4, merci.',
    'Ah, excusez-moi. Je vais au guichet 4, merci.',
  ],
  [
    'Voici, tous en original : le passeport, le codice fiscale, le permesso et le contrat.',
    'Voici, ce sont tous des originaux : le passeport, le codice fiscale, le permesso et le contrat.',
  ],
  [
    "J'habite via Roma douze, interno trois, deuxième étage. Je vis avec ma femme et ma fille.",
    'J’habite via Roma 12, interno 3, au deuxième étage. Je vis avec ma femme et ma fille.',
  ],
  [
    "Où est le sportello ? Je n'ai pas le temps pour les numéros.",
    'Où est le guichet ? Je n’ai pas le temps pour les numéros.',
  ],
  [
    "Je vous remercie pour l'indication relative à l'appareil d'émission des tickets.",
    'Je vous remercie pour l’indication relative à la borne d’émission des tickets.',
  ],
  [
    "Bonjour. Pour l'Anagrafe, le totem est à gauche. Ensuite attendez le numéro.",
    'Bonjour. Pour l’Anagrafe, la borne est à gauche. Ensuite, attendez le numéro.',
  ],
  [
    "J'opte pour la rubrique concernant l'iscrizione anagrafica.",
    'J’opte pour la rubrique concernant l’iscrizione anagrafica.',
  ],
  [
    "Je demande au sportello si je peux passer, il y a de la place.",
    'Je demande au guichet si je peux passer : il y a de la place.',
  ],
  [
    "Asseyez-vous. Le numéro apparaît sur le tableau. Ne vous approchez pas du sportello avant.",
    'Installez-vous. Le numéro apparaît sur l’écran. Ne vous approchez pas du ­guichet avant.',
  ],
  [
    "Je vais au sportello 2, il y a moins de monde.",
    'Je vais au ­guichet 2 : il y a moins de monde.',
  ],
  [
    "Je me rends au comptoir correspondant à l'avis lumineux.",
    'Je me rends au guichet correspondant à l’affichage lumineux.',
  ],
  [
    'Je demande pardon pour l’équivoque et je me dirige vers le sportello indiqué.',
    'Je vous prie de m’excuser pour cette méprise et je me dirige vers le guichet indiqué.',
  ],
  [
    "C'est le même Comune, vous pouvez le faire.",
    'C’est le même Comune, vous pouvez le faire ici.',
  ],
  [
    "Ce sportello est pour la carta d'identità. La résidence est au sportello 4.",
    'Ce guichet est pour la carta d’identità. La résidence est au guichet 4.',
  ],
  [
    'Bonjour. Je vous soumets le titre de file et l’instance de résidence.',
    'Bonjour. Je vous présente le ticket de file et la demande de résidence.',
  ],
  [
    'Je dépose auprès de vous l’ensemble de la documentation en original comme demandé.',
    'Je dépose auprès de vous l’ensemble des originaux, comme demandé.',
  ],
  [
    'Je procède immédiatement à la compilation et à la remise du contrassegno di bollo.',
    'Je procède immédiatement au remplissage du formulaire et à la remise du contrassegno di bollo.',
  ],
  [
    'Le logement est situé via Roma 12, interno 3, deuxième étage, avec nucleo familiare cohabitant.',
    'Le logement est situé via Roma 12, interno 3, au deuxième étage, avec nucleo familiare cohabitant.',
  ],
  [
    "Quel est le nucleo familiare ? Indiquez-moi l'adresse complète, l'interno et l'étage.",
    'Quel est le nucleo familiare ? Indiquez-moi l’adresse complète, l’interno et l’étage.',
  ],
  [
    'Je prends acte de la possible vérification de la Polizia Locale au domicile.',
    'Je prends note de la possible vérification de la Polizia Locale au domicile.',
  ],
  [
    'Je vous remercie pour la délivrance du reçu et vous souhaite une bonne continuation.',
    'Je vous remercie pour la délivrance du reçu et vous souhaite une bonne continuation.',
  ],
  [
    'Laura a récemment emménagé à Padoue. Après avoir fait sa residenza à l’Anagrafe, elle passe à l’étape suivante : elle va à l’ASL (Azienda Sanitaria Locale) pour s’inscrire au SSN (Servizio Sanitario Nazionale), obtenir la Tessera Sanitaria et choisir un médecin de famille (Medico di base). Elle a : passaporto, permesso di soggiorno, codice fiscale et dichiarazione di residenza.',
    'Laura a récemment emménagé à Padoue. Après avoir déclaré sa residenza à l’Anagrafe, elle passe à l’étape suivante : elle se rend à l’ASL (Azienda Sanitaria Locale) pour s’inscrire au SSN (Servizio Sanitario Nazionale), obtenir la Tessera Sanitaria et choisir un médecin de famille (medico di base). Elle a avec elle : passeport, permesso di soggiorno, codice fiscale et dichiarazione di residenza.',
  ],
  [
    'Utilisation de l’expression « Avere diritto a... » (Ha diritto all\'iscrizione).',
    'Utilisation de l’expression « Avere diritto a… » (Ha diritto all’iscrizione).',
  ],
  [
    'Ce médecin est près de chez vous et a de la place.',
    'Ce médecin est près de chez vous et a encore des disponibilités.',
  ],
  [
    'Je vous montre une liste des médecins disponibles dans votre zone. Ce médecin est près de chez vous et a de la place.',
    'Je vous montre une liste des médecins disponibles dans votre secteur. Ce médecin est près de chez vous et a encore des disponibilités.',
  ],
  [
    'Où s’adresser en cas de menace grave et permanente pour la santé ?',
    'Où s’adresser en cas de danger grave et immédiat pour la santé ?',
  ],
  [
    'Que répondra l’employé sur le coût de l’inscription avec Permesso di Soggiorno ?',
    'Que répond l’employé sur le coût de l’inscription avec un permesso di soggiorno ?',
  ],
  [
    '« Guardia Medica » — service de garde de nuit et les jours fériés.',
    '« Guardia medica » : service de garde la nuit et les jours fériés.',
  ],
  [
    'Coperto est un frais pour le pain et le couvert (souvent 1,50 €–3,00 € par personne, indiqué au menu).',
    'Le coperto est un forfait pour le pain et le couvert (souvent 1,50 € à 3 € par personne, indiqué au menu).',
  ],
  [
    'Le Cappuccino en Italie se boit seulement jusqu’à 11 h. Après le repas on commande un Caffè espresso ou un Macchiato.',
    'En Italie, le cappuccino se boit seulement jusqu’à 11 h. Après le repas, on commande un caffè espresso ou un macchiato.',
  ],
  [
    'Demandes polies avec « Vorrei » et « Possiamo »',
    'Demandes polies avec « Vorrei » et « Possiamo »',
  ],
  [
    'Je voudrais deux grands Coca-Cola avec glaçons et citron, comme au fast-food.',
    'Je voudrais deux grands Coca-Cola avec des glaçons et du citron, comme au fast-food.',
  ],
  [
    "Oui ! En primo, on prend deux tagliatelle al ragù, et en secondo une tagliata di manzo à partager.",
    'Oui ! En primo, on prend deux tagliatelle al ragù, et en secondo une tagliata di manzo à partager.',
  ],
  [
    "Apportez tout ensemble, l'ordre des plats n'importe pas.",
    'Apportez tout en même temps, l’ordre des plats n’a pas d’importance.',
  ],
  [
    'Non, merci. Quand ce sera possible, pouvons-nous avoir l’addition ?',
    'Non, merci. Quand vous pourrez, pourriez-vous nous apporter l’addition ?',
  ],
  [
    "On paie en billets de deux cents, sans pourboire et sans ticket.",
    'On paie en billets de 200 euros, sans pourboire et sans ticket.',
  ],
  [
    'En Italie l’addition n’arrive pas dès que vous avez fini — cela presserait le client. Vous devez dire au serveur : « Il conto, per favore ».',
    'En Italie, l’addition n’arrive pas dès que vous avez fini — ce serait presser le client. Vous devez dire au serveur : « Il conto, per favore ».',
  ],
  [
    'Après le repas, les Italiens boivent un espresso pour aider la digestion.',
    'Après le repas, les Italiens boivent un espresso, pour aider la digestion.',
  ],
  [
    'Laura cherche un appartement à Padoue/Trévise. Sur un portail elle a trouvé une offre, mais pour louer en Italie il faut les termes : distinguer « monolocale » et « trilocale », comprendre « spese condominiali » (charges de copropriété) et de combien de mois est la « caparra » (caution).',
    'Laura cherche un appartement à Padoue / Trévise. Sur un portail, elle a trouvé une offre, mais pour louer en Italie il faut connaître les termes : distinguer « monolocale » et « trilocale », comprendre les « spese condominiali » (charges de copropriété) et de combien de mois est la « caparra » (caution).',
  ],
  [
    'Spese condominiali — charges pour le ménage de l’escalier, l’ascenseur, l’éclairage et l’entretien de la cour. Elles sont plus souvent facturées à part du loyer.',
    'Spese condominiali : charges pour le ménage de l’escalier, l’ascenseur, l’éclairage et l’entretien de la cour. Elles sont le plus souvent facturées en plus du loyer.',
  ],
  [
    'Les spese condominiali sont exclues.',
    'Les spese condominiali ne sont pas incluses.',
  ],
  [
    'Laura appelle le propriétaire — Signor Mario — pour les détails de l’annonce et convenir d’une visite.',
    'Laura appelle le propriétaire — signor Mario — pour les détails de l’annonce et convenir d’une visite.',
  ],
  [
    "Bonjour Signor Mario, je suis Laura. J'appelle pour l'annonce de l'appartement en location. Est-il encore disponible ?",
    'Bonjour signor Mario, je suis Laura. J’appelle pour l’annonce de l’appartement en location. Est-il encore disponible ?',
  ],
  [
    "J'ai compris. Et pour ce qui est des utenze d'électricité et de gaz, faut-il les volturare à mon nom ?",
    'J’ai compris. Et pour les utenze d’électricité et de gaz, faut-il les volturare à mon nom ?',
  ],
  [
    'Le loyer est de 650 euros par mois. Les spese condominiali sont 80 euros en plus et comprennent l’eau et le nettoyage des escaliers.',
    'Le loyer est de 650 euros par mois. Les spese condominiali sont de 80 euros en plus et comprennent l’eau et le nettoyage des escaliers.',
  ],
  [
    'Merci beaucoup Monsieur Mario, à demain ! Bonne journée.',
    'Merci beaucoup, signor Mario, à demain ! Bonne journée.',
  ],
  [
    'Comment demander à Signor Mario si l’appartement de l’annonce est encore libre ?',
    'Comment demander au signor Mario si l’appartement de l’annonce est encore libre ?',
  ],
  [
    '« È ancora disponibile? » = « C’est encore disponible / libre ? »',
    '« È ancora disponibile? » = « Est-ce encore disponible / libre ? »',
  ],
  [
    'Comment dire au propriétaire « Quand pouvons-nous convenir d’une visite pour voir l’appartement ? »',
    'Comment dire au propriétaire : « Quand pouvons-nous convenir d’une visite pour voir l’appartement ? »',
  ],
  [
    'Ticket al totem — à l’entrée on choisit : « Spedizioni e Pacchi » (envois), « Pagamenti » (quittances/paiements) ou « Ritiro » (retrait).',
    'Ticket à la borne : à l’entrée, on choisit « Spedizioni e Pacchi » (envois), « Pagamenti » (paiements) ou « Ritiro » (retrait).',
  ],
  [
    'Bollettino — quittance papier ou code-barres pour payer charges, amendes et taxes.',
    'Bollettino : avis de paiement papier ou code-barres pour régler charges, amendes et taxes.',
  ],
  [
    'Vous voulez envoyer en poste prioritaire ?',
    'Vous voulez envoyer en Prioritaire ?',
  ],
  [
    'Je dois envoyer ce colis en Ukraine et payer un bollettino.',
    'Je dois envoyer ce colis en Ukraine et payer un bollettino.',
  ],
  [
    "Examen final du module ! Vous choisissez le service au terminal, parlez à l’employé, envoyez une lettre et payez une quittance. Indices et traduction désactivés !",
    'Examen final du module ! Vous choisissez le service au terminal, parlez à l’employé, envoyez une lettre et payez un avis de paiement. Les indices et la traduction sont désactivés !',
  ],
  [
    'En Italie, à la poste, la file électronique via le terminal (totem) est obligatoire.',
    'En Italie, à la poste, la file électronique via le terminal (borne) est obligatoire.',
  ],
  [
    "Comment s’appelle le numéro pour suivre le statut et la localisation d’un colis en ligne ?",
    'Comment s’appelle le numéro pour suivre l’état et la localisation d’un colis en ligne ?',
  ],
  [
    'Expert des Poste ✉️',
    'Expert des Poste Italiane ✉️',
  ],
  [
    "Patronato e CAF sont des structures qui aident, gratuitement ou pour un tarif symbolique, pour les impôts, les allocations maternité, les bonus enfants et les aides.",
    'Le Patronato et le CAF sont des structures qui aident, gratuitement ou pour un tarif symbolique, pour les impôts, les allocations maternité, les bonus enfants et les aides.',
  ],
  [
    "Assegno Unico Universale est une allocation mensuelle pour chaque enfant mineur du foyer.",
    'L’Assegno Unico Universale est une allocation mensuelle pour chaque enfant mineur du foyer.',
  ],
  [
    "Différence 'Serve' (singulier) / 'Servono' (pluriel) : « il faut / il faut (plusieurs) ».",
    'Différence « Serve » (singulier) / « Servono » (pluriel) : « il faut » / « il faut » (plusieurs).',
  ],
  [
    "Bien. En quoi puis-je vous aider aujourd'hui ?",
    'Bien. En quoi puis-je vous aider aujourd’hui ?',
  ],
  [
    "L’ISEE est un indicateur de situation patrimoniale pour calculer les aides sociales.",
    'L’ISEE est un indicateur de situation économique et patrimoniale pour calculer les aides sociales.',
  ],
  [
    "Comment s’appelle l’allocation étatique mensuelle pour enfant en Italie ?",
    'Comment s’appelle l’allocation mensuelle de l’État pour un enfant en Italie ?',
  ],
  [
    "On peut s'asseoir à table ou ça coûte plus cher ?",
    'Peut-on s’asseoir à table, ou est-ce plus cher ?',
  ],
  [
    "Je prends d'abord le ticket à la caisse ?",
    'Je prends d’abord le ticket à la caisse ?',
  ],
  [
    'Al banco vs Al tavolo : le café au comptoir (al banco) est moins cher qu’à table (al tavolo), où s’ajoute un service.',
    'Al banco vs al tavolo : le café au comptoir (al banco) est moins cher qu’à table (al tavolo), où s’ajoute un service.',
  ],
  [
    'Les deux nature, mais avec crème et Nutella dessus, à emporter chaudes.',
    'Les deux nature, mais avec de la crème et du Nutella dessus, chaudes, à emporter.',
  ],
  [
    'Parfait. Comment les préférez-vous, les brioches ? On a nature, à la confiture ou au chocolat.',
    'Parfait. Comment préférez-vous les brioches ? On a nature, à la confiture ou au chocolat.',
  ],
  [
    "Ça fait 5 euros 20 au total. Voici le ticket. Vous pouvez le laisser au comptoir.",
    'Ça fait 5,20 € au total. Voici le ticket. Vous pouvez le laisser au comptoir.',
  ],
  [
    'Le service à table inclut un supplément \'servizio al tavolo\'.',
    'Le service à table inclut un supplément « servizio al tavolo ».',
  ],
  [
    'Marco et Laura vont au supermarché de Treviso pour les courses de la semaine. En Italie, l’étiquette compte : il faut peser fruits et légumes soi-même, avec des gants jetables (guanti monouso), et au rayon traiteur (banco gastronomia) on prend souvent un ticket de file (biglietto).',
    'Marco et Laura vont au supermarché de Trévise pour les courses de la semaine. En Italie, l’étiquette compte : il faut peser fruits et légumes soi-même, avec des gants jetables (guanti monouso), et au rayon traiteur (banco gastronomia) on prend souvent un ticket de file (biglietto).',
  ],
  [
    'Vous avez la carte de fidélité / carta fidaty ?',
    'Vous avez la carte de fidélité / carta fedeltà ?',
  ],
  [
    'Pour choisir fruits et légumes frais, mettez obligatoirement des gants en plastique (guanti) pour l’hygiène.',
    'Pour choisir fruits et légumes frais, mettez obligatoirement des gants en plastique (guanti) pour des raisons d’hygiène.',
  ],
  [
    "Je voudrais un kilo de lait et deux bouteilles de pain, coupées fines.",
    'Je voudrais un kilo de lait et deux bouteilles de pain, coupées très fin.',
  ],
  [
    "Coupez-le en gros cubes et le fromage je le goûte tout d'abord.",
    'Coupez-le en gros cubes, et le fromage, je le goûte d’abord.',
  ],
  [
    "Il faut garder 'Lo scontrino' (le ticket) jusqu’à la sortie du supermarché ou du magasin : la police fiscale peut le demander.",
    'Il faut garder lo scontrino (le ticket) jusqu’à la sortie du supermarché ou du magasin : la police fiscale peut le demander.',
  ],
  [
    'Les règles d’hygiène en Italie imposent des gants pour choisir légumes/fruits.',
    'Les règles d’hygiène en Italie imposent de mettre des gants pour choisir fruits et légumes.',
  ],
  [
    "N'oublie pas de composter le billet avant de monter !",
    'N’oublions pas de composter le ticket avant de monter !',
  ],
  [
    'Tabacchi e Edicola sont les endroits les plus simples pour acheter un ticket de bus. Dans le bus, le ticket peut coûter plus cher ou ne pas être vendu.',
    'Les Tabacchi et l’edicola sont les endroits les plus simples pour acheter un ticket de bus. Dans le bus, le ticket peut coûter plus cher, ou ne pas être vendu du tout.',
  ],
  [
    'Prépositions de direction : \'A\' (vers une ville/gare) et \'Da\' (depuis une voie).',
    'Prépositions de direction : « A » (vers une ville / une gare) et « Da » (depuis une voie).',
  ],
  [
    "Bonjour ! Dites donc.",
    'Bonjour ! Dites-moi.',
  ],
  [
    "Oui, exactement ! Dès que vous montez dans le bus, vous devez tamponner le ticket dans la machine. Au revoir !",
    'Oui, exactement ! Dès que vous montez dans le bus, vous devez composter le ticket dans la machine. Au revoir !',
  ],
  [
    'Je tamponne le ticket à la maison, avant de sortir, c’est plus pratique.',
    'Je composté le ticket à la maison, avant de sortir, c’est plus pratique.',
  ],
  [
    'Bonjour ! Bien sûr, voici mon ticket tamponné il y a un instant.',
    'Bonjour ! Bien sûr, voici mon ticket composté il y a un instant.',
  ],
  [
    'Où est-il le plus simple et le moins cher d’acheter un ticket de bus urbain en Italie ?',
    'Où est-il le plus simple et le moins cher d’acheter un ticket de bus urbain en Italie ?',
  ],
  [
    'Sans validation, le contrôleur dresse une amende.',
    'Sans validation, le contrôleur dresse une amende.',
  ],
  [
    'Il faut clairement expliquer ses souhaits : longueur des cheveux, forme des ongles, type de vernis ou coupe de barbe.',
    'Il faut clairement expliquer ses souhaits : longueur des cheveux, forme des ongles, type de vernis ou taille de barbe.',
  ],
  [
    'Je voudrais faire le vernis semipermanente et enlever l’ancien.',
    'Je voudrais un vernis semi-permanent et faire retirer l’ancien.',
  ],
  [
    'Je voudrais raccourcir les cheveux sur les côtés et régler la barbe.',
    'Je voudrais raccourcir les cheveux sur les côtés et égaliser la barbe.',
  ],
  [
    'Je voudrais seulement couper d’un centimètre.',
    'Je voudrais seulement enlever un centimètre.',
  ],
  [
    'Je voudrais prendre rendez-vous pour vendredi : une coupe homme avec barbe et une manucure avec semipermanente.',
    'Je voudrais prendre rendez-vous pour vendredi : une coupe homme avec barbe et une manucure avec vernis semi-permanent.',
  ],
  [
    'Oui, je dois enlever le gel ancien et faire la manucure complète.',
    'Oui, je dois faire retirer l’ancien gel et faire la manucure complète.',
  ],
  [
    'Bonjour ! Je voudrais raccourcir les cheveux sur les côtés et régler la barbe, mais sans la couper trop courte.',
    'Bonjour ! Je voudrais raccourcir les cheveux sur les côtés et égaliser la barbe, mais sans la couper trop courte.',
  ],
  [
    "Bonjour Marco ! Comment on fait aujourd'hui pour les cheveux et la barbe ?",
    'Bonjour Marco ! Comment on fait aujourd’hui pour les cheveux et la barbe ?',
  ],
  [
    'Bonjour ! Je voudrais la forme amande et une couleur nude naturelle avec le semipermanente.',
    'Bonjour ! Je voudrais la forme amande et une couleur nude naturelle avec le vernis semi-permanent.',
  ],
  [
    'Voilà ! Au total pour la coupe homme, la barbe, la manucure et le semipermanente, 65 euros. Vous payez ensemble ou séparément ?',
    'Voilà ! Au total, pour la coupe homme, la barbe, la manucure et le vernis semi-permanent : 65 euros. Vous payez ensemble ou séparément ?',
  ],
  [
    'Comment un homme demande-t-il de raccourcir les côtés et d’égaliser la barbe ?',
    'Comment un homme demande-t-il de raccourcir les côtés et d’égaliser la barbe ?',
  ],
  [
    "'Piega' est le brushing / mise en forme des cheveux.",
    '« Piega » est le brushing / la mise en forme des cheveux.',
  ],
  [
    'Ton intensif quotidien pour vivre l’Italie en confiance. De la mairie au restaurant — parle sans barrières !',
    'Ton intensif quotidien pour vivre l’Italie en confiance. De la mairie au restaurant — parle sans barrière !',
  ],
  ['Full access', 'Accès complet'],
  ['{{done}} / {{total}} days completed • {{percent}}%', '{{done}} / {{total}} jours terminés • {{percent}} %'],
  ['🔥 {{count}} Day Streak', '🔥 {{count}} jours d’affilée'],
  ['Light', 'Clair'],
  ['Dark', 'Sombre'],
  ['Flashcards Mode', 'Mode cartes'],
  ['End-of-Day Practice Quiz', 'Quiz de fin de journée'],
  ['Review Mistakes', 'Revoir les erreurs'],
  ['✓ Day complete', '✓ Jour terminé'],
  ['Mark Day as Complete', 'Marquer le jour comme terminé'],
  ['Real Life Score', 'Score réel'],
  ['Café et small talk', 'Café et conversation'],
])

function polish(s) {
  if (MAP.has(s)) return MAP.get(s)
  let t = s
  t = t.replaceAll('Indices et traduction désactivés !', 'Les indices et la traduction sont désactivés !')
  t = t.replaceAll('Excusez-moi beaucoup', 'Excusez-moi')
  t = t.replaceAll('Je composté le ticket', 'Je composte le ticket')
  t = t.replaceAll('\u00ad', '')
  return t
}

function applyFr(node) {
  let n = 0
  if (node == null) return { n }
  if (Array.isArray(node)) {
    for (const x of node) n += applyFr(x).n
    return { n }
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'fr' && typeof v === 'string') {
        const next = polish(v)
        if (next !== v) {
          node[k] = next
          n += 1
        }
      } else n += applyFr(v).n
    }
  }
  return { n }
}

let total = 0
for (let d = 1; d <= 30; d++) {
  const p = `src/content/day${d}.json`
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  const { n } = applyFr(data)
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  total += n
  console.log('day' + d, n)
}

const locPath = 'src/locales/fr.json'
const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
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
fs.writeFileSync(locPath, JSON.stringify(r.v, null, 2) + '\n')
console.log('locale', r.n, 'total', total + r.n)
