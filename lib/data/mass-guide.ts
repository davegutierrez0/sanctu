/**
 * Standard Roman Rite Mass guide - English and Spanish
 * v1: Ordinary Form participant guide with action/response formatting markers.
 */

import type { Language } from '@/components/ThemeProvider';

export type MassGuideLineType = 'action' | 'response' | 'text' | 'note';

export interface MassGuideLine {
  type: MassGuideLineType;
  en: string;
  es: string;
}

export interface MassGuideSection {
  id: string;
  enTitle: string;
  esTitle: string;
  lines: MassGuideLine[];
}

export interface MassGuideSectionContent {
  id: string;
  title: string;
  lines: MassGuideLine[];
}

export interface MassGuideReference {
  en: string;
  es: string;
  url?: string;
}

export interface MassGuideContent {
  title: string;
  subtitle: string;
  version: string;
  sections: MassGuideSectionContent[];
  sources: MassGuideReference[];
}

const MASS_GUIDE_SECTIONS: MassGuideSection[] = [
  {
    id: 'introductory-rites',
    enTitle: 'Introductory Rites',
    esTitle: 'Ritos iniciales',
    lines: [
      {
        type: 'text',
        en: 'The Mass begins with the entrance chant or song and the procession of ministers.',
        es: 'La Misa comienza con el canto de entrada y la procesión de los ministros.',
      },
      {
        type: 'action',
        en: 'Stand as the entrance chant and processional prayer begin.',
        es: 'Ponte de pie cuando inicie el canto de entrada y la procesión inicial.',
      },
      {
        type: 'action',
        en: 'Make the Sign of the Cross in the usual gesture. Keep eyes on the altar as it is reverenced.',
        es: 'Haz la se\u00f1al de la cruz con el gesto habitual y mant\u00e9n la mirada en el altar al hacerle reverencia.',
      },
      {
        type: 'text',
        en: 'The priest and ministers bow or kneel before the altar as required by local custom.',
        es: 'El sacerdote y los ministros se inclinan o se arrodillan frente al altar seg\u00fan la costumbre local.',
      },
      {
        type: 'text',
        en: 'Priest: The Lord be with you.',
        es: 'Sacerdote: El Se\u00f1or est\u00e9 con vosotros.',
      },
      {
        type: 'response',
        en: 'And with your spirit.',
        es: 'Y con tu Esp\u00edritu.',
      },
      {
        type: 'text',
        en: 'Priest: Let us pray.',
        es: 'Sacerdote: Oremos.',
      },
      {
        type: 'note',
        en: 'The Penitential Act follows. In many parishes, it is a short silent prayer followed by one of the Kyrie forms.',
        es: 'Luego viene el Acto Penitencial. En muchas parroquias, se hace una breve oraci\u00f3n de silencio y luego una forma del Kyrie.',
      },
      {
        type: 'action',
        en: 'Stand, then kneel briefly for the initial act of humility, if this is your parish custom.',
        es: 'Mant\u00e9nte de pie y, si es costumbre de la parroquia, arrod\u00edllate brevemente para el acto penitencial.',
      },
      {
        type: 'response',
        en: 'Lord, have mercy.',
        es: 'Se\u00f1or, ten piedad.',
      },
      {
        type: 'response',
        en: 'Christ, have mercy.',
        es: 'Cristo, ten piedad.',
      },
      {
        type: 'response',
        en: 'Lord, have mercy.',
        es: 'Se\u00f1or, ten piedad.',
      },
      {
        type: 'action',
        en: 'On Sundays and solemnities (as prescribed), stand and pray or sing the Gloria.',
        es: 'En domingos y solemnidades, seg\u00fan lo indicado, di o canta la Gloria de pie.',
      },
      {
        type: 'text',
        en: 'Glory to God in the highest, and peace to His people on earth.',
        es: 'Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Se\u00f1or.',
      },
      {
        type: 'action',
        en: 'After the opening prayers, remain standing for the Collect, unless your custom is to kneel.',
        es: 'Tras las oraciones iniciales, permanece de pie para el Colecta, salvo que en tu parroquia se arrodille.',
      },
      {
        type: 'text',
        en: 'Priest: Let us pray together. The Collect follows for the day.',
        es: 'Sacerdote: Oremos. La Colecta corresponde al d\u00eda.',
      },
      {
        type: 'note',
        en: 'The Collect text changes by liturgical day, feast, and season.',
        es: 'La Oraci\u00f3n de apertura (Colecta) cambia de acuerdo con el d\u00eda lit\u00fargico, la fiesta y la\u00a0temporada.',
      },
    ],
  },
  {
    id: 'liturgy-of-the-word',
    enTitle: 'Liturgy of the Word',
    esTitle: 'Liturgia de la Palabra',
    lines: [
      {
        type: 'text',
        en: 'After the Collect, the assembly listens to the reading of Scripture.',
        es: 'Despu\u00e9s de la Colecta, la asamblea escucha la lectura de la Escritura.',
      },
      {
        type: 'action',
        en: 'Stand for the readings as your parish custom dictates, then sit briefly for brief prayers or silence.',
        es: 'Ponte de pie para las lecturas, y luego si\u00e9ntate para los momentos de oraci\u00f3n o silencio.',
      },
      {
        type: 'text',
        en: 'First reading: proclaimed by a lector or deacon.',
        es: 'Primera lectura: la proclama un lector o di\u00e1cono.',
      },
      {
        type: 'note',
        en: 'When a responsorial psalm is used, sing or pray the refrain and meditate on the verses.',
        es: 'Cuando se use salmo responsorial, canta o reza el estribillo y medita los vers\u00edculos.',
      },
      {
        type: 'action',
        en: 'Stand for the Gospel. Keep attention and silence until the final acclamation.',
        es: 'Ponte de pie para el Evangelio. Guarda silencio y atenci\u00f3n hasta la aclamaci\u00f3n final.',
      },
      {
        type: 'text',
        en: 'Priest/Deacon: The Gospel of the Lord.',
        es: 'Sacerdote/Di\u00e1cono: El Santo Evangelio de Nuestro Se\u00f1or Jesucristo.',
      },
      {
        type: 'response',
        en: 'Glory to you, O Lord.',
        es: 'Alabado seas, Se\u00f1or.',
      },
      {
        type: 'text',
        en: 'The Evangelio is proclaimed in its own place by the deacon or priest.',
        es: 'El Evangelio es proclamado en su lugar propio por el di\u00e1cono o sacerdote.',
      },
      {
        type: 'action',
        en: 'Sit or kneel for the homily, depending on parish custom, and pray inwardly.',
        es: 'Si\u00e9ntate o arrod\u00edllate para la homil\u00eda, seg\u00fan la costumbre local, y ora interiormente.',
      },
      {
        type: 'action',
        en: 'On Sundays, solemnities, and feasts, stand for the Profession of Faith (Credo).',
        es: 'En domingos, solemnidades y fiestas, ponte de pie para la Profes\u00edn de Fe (Credo).',
      },
      {
        type: 'response',
        en: 'I believe in one God, the Father almighty, maker of heaven and earth.',
        es: 'Creo en un solo Dios, Padre todopoderoso, creador del cielo y de la tierra.',
      },
      {
        type: 'response',
        en: 'And in one Lord Jesus Christ, the Son of God, begotten of the Father before all ages.',
        es: 'Y en un Se\u00f1or Jesucristo, Hijo de Dios, nacido del Padre antes de todos los siglos.',
      },
      {
        type: 'response',
        en: 'By him all things were made... For us men and for our salvation He came down from heaven.',
        es: 'Por \u00e9l fueron hechas todas las cosas... Por nosotros los hombres y por nuestra salvaci\u00f3n baj\u00f3 del cielo.',
      },
      {
        type: 'response',
        en: 'For us and for our salvation He came down from heaven, was incarnate by the Holy Spirit and born of the Virgin Mary.',
        es: 'Por nosotros, y por nuestra salvaci\u00f3n, baj\u00f3 del cielo; se encarn\u00f3 por obra del Esp\u00edritu Santo y naci\u00f3 de la Virgen Mar\u00eda.',
      },
      {
        type: 'response',
        en: 'He suffered under Pontius Pilate, was crucified, died and was buried; He rose again on the third day.',
        es: 'Padeci\u00f3 bajo Poncio Pilato, fue crucificado, muri\u00f3 y fue sepultado; resucit\u00f3 al tercer d\u00eda.',
      },
      {
        type: 'response',
        en: 'He ascended into heaven and is seated at the right hand of the Father.',
        es: 'Subi\u00f3 a los cielos y se sent\u00f3 a la derecha de Dios Padre.',
      },
      {
        type: 'response',
        en: 'From thence He shall come again with glory to judge the living and the dead.',
        es: 'Desde all\u00ed volver\u00e1 con gloria para juzgar a vivos y muertos.',
      },
      {
        type: 'response',
        en: 'I believe in the Holy Spirit, the holy catholic Church, the communion of saints, forgiveness of sins, resurrection of the body and life everlasting. Amen.',
        es: 'Creo en el Esp\u00edritu Santo, la santa Iglesia cat\u00f3lica, la comunicaci\u00f3n de los santos, el perd\u00f3n de los pecados, la resurrecci\u00f3n del cuerpo y la vida eterna. Am\u00e9n.',
      },
      {
        type: 'note',
        en: 'The Universal Prayer (Prayer of the Faithful) normally comes next, with petitions for the Church and the world.',
        es: 'Luego viene la Oraci\u00f3n de los fieles, con intenciones por la Iglesia y por el mundo.',
      },
      {
        type: 'response',
        en: 'Lord, hear our prayer.',
        es: 'Se\u00f1or, escucha nuestra oraci\u00f3n.',
      },
    ],
  },
  {
    id: 'liturgy-of-the-eucharist',
    enTitle: 'Liturgy of the Eucharist',
    esTitle: 'Liturgia de la Eucar\u00edstia',
    lines: [
      {
        type: 'text',
        en: 'After the Liturgy of the Word, we move to the preparation of the gifts and the altar.',
        es: 'Despu\u00e9s de la Liturgia de la Palabra, avanzamos a la preparaci\u00f3n de los dones y el altar.',
      },
      {
        type: 'action',
        en: 'Remain standing. Keep your hands gently folded while the gifts are presented.',
        es: 'Permanece de pie y mant\u00e9n las manos recogidas mientras se presentan los dones.',
      },
      {
        type: 'text',
        en: 'The priest says one of the prayers over the gifts, for example: Blessed are you, Lord God of all creation...',
        es: 'El sacerdote reza una de las oraciones sobre los dones, por ejemplo: Bendito seas, Se\u00f1or Dios de toda criatura...',
      },
      {
        type: 'text',
        en: 'Bendido seas, se\u00f1or, Dios de toda creaci\u00f3n, porque por el santo sacrificio\nque ahora ofrecemos tu Hijo Jesucristo...',
        es: 'Te damos gracias, Se\u00f1or, porque por la ofrenda de este pan y vino nos unes a tu sacrificio...',
      },
      {
        type: 'action',
        en: 'Stand for the Eucharistic Prayer. In many churches the whole assembly kneels at the start of it.',
        es: 'Ponte de pie para la Oraci\u00f3n Eucar\u00edstica. En muchas iglesias toda la asamblea se arrodilla al iniciarla.',
      },
      {
        type: 'text',
        en: 'Priest: The Lord be with you.',
        es: 'Sacerdote: El Se\u00f1or est\u00e9 con vosotros.',
      },
      {
        type: 'response',
        en: 'And with your spirit.',
        es: 'Y con tu Esp\u00edritu.',
      },
      {
        type: 'text',
        en: 'Priest: Lift up your hearts.',
        es: 'Sacerdote: Levantemos el coraz\u00f3n.',
      },
      {
        type: 'response',
        en: 'We lift them up to the Lord.',
        es: 'Las tenemos levantadas al Se\u00f1or.',
      },
      {
        type: 'text',
        en: 'Priest: Let us give thanks to the Lord, our God.',
        es: 'Sacerdote: Demos gracias al Se\u00f1or, nuestro Dios.',
      },
      {
        type: 'response',
        en: 'It is right and just.',
        es: 'Es justo y necesario.',
      },
      {
        type: 'action',
        en: 'Join the Sanctus with the whole assembly.',
        es: 'Une tu voz a la plegaria con la asamblea.',
      },
      {
        type: 'response',
        en: 'Holy, holy, holy Lord God of hosts. Heaven and earth are full of your glory. O Lord God, heavenly King, Holy God, God of power and might.',
        es: 'Santo, santo, santo es el Se\u00f1or, Dios de los ej\u00e9rcitos. Lleno est\u00e1n el cielo y la tierra de tu gloria. Se\u00f1or Dios, trono del cielo, Dios todopoderoso y eterno.',
      },
      {
        type: 'action',
        en: 'Kneel or bow at the consecratory words if this is normal in your parish.',
        es: 'Arrod\u00edllate o inclina profundamente durante las palabras de la consagraci\u00f3n, seg\u00fan costumbre.',
      },
      {
        type: 'note',
        en: 'One eucharistic prayer is used by the priest. The following text follows the Roman Rite structure, while the exact wording varies by prayer and day.',
        es: 'El sacerdote usa una de las Oraciones eucar\u00edsticas del Misal. La estructura es estable, pero el texto exacto cambia.',
      },
      {
        type: 'action',
        en: 'At the words "This is my body" and "This is the chalice of my blood", kneel and pray with reverence.',
        es: 'Al o\u00edr "Esto es mi cuerpo" y "este es el cáliz de mi sangre", arrod\u00edllate y reza con reverencia.',
      },
      {
        type: 'text',
        en: 'Take this, all of you, and eat of it, for this is my Body, which will be given up for you.',
        es: 'Tomad y comed de esto todos, porque esto es mi Cuerpo, que se entregar\u00e1 por ustedes.',
      },
      {
        type: 'text',
        en: 'Take this, all of you, and drink of it, for this is the chalice of my Blood, the blood of the new and eternal covenant.',
        es: 'Tomad y be\u00adbed de esto todos, porque este es el C\u00e1liz de mi Sangre, sangre de la nueva y eterna alianza.',
      },
      {
        type: 'action',
        en: 'After the Great Amen, stand for the Memorial Acclamation.',
        es: 'Despu\u00e9s del gran Am\u00e9n, ponte de pie para la Aclamaci\u00f3n mnemorizada.',
      },
      {
        type: 'text',
        en: 'The priest introduces the acclamation with: The mystery of faith.',
        es: 'El sacerdote introduce la aclamaci\u00f3n diciendo: El misterio de la fe.',
      },
      {
        type: 'response',
        en: 'Christ has died. Christ is risen. Christ will come again.',
        es: 'Cristo muri\u00f3, Cristo resucit\u00f3, Cristo vendr\u00e1 de nuevo.',
      },
      {
        type: 'action',
        en: 'Keep hands together and pray the Lord\u2019s Prayer together.',
        es: 'Con manos unidas, rezad juntos la Oraci\u00f3n del Se\u00f1or.',
      },
      {
        type: 'response',
        en: 'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven.',
        es: 'Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo.',
      },
      {
        type: 'response',
        en: 'Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us.',
        es: 'Danos hoy nuestro pan de cada día y perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden.',
      },
      {
        type: 'response',
        en: 'And lead us not into temptation, but deliver us from evil.',
        es: 'Y no nos dejes caer en la tentación, y líbranos del mal.',
      },
      {
        type: 'response',
        en: 'Amen.',
        es: 'Am\u00e9n.',
      },
      {
        type: 'action',
        en: 'Exchange peace briefly: "The peace of the Lord be with you always."',
        es: 'Intercambien la paz con brevedad: "La paz del Se\u00f1or sea siempre con vosotros."',
      },
      {
        type: 'response',
        en: 'And with your spirit.',
        es: 'Y con tu espíritu.',
      },
      {
        type: 'action',
        en: 'Stand for the Lamb of God (Agnus Dei) and pray it to God with the whole assembly.',
        es: 'Ponte de pie para el "Cordero de Dios" y recítalo con toda la asamblea.',
      },
      {
        type: 'response',
        en: 'Lamb of God, you take away the sins of the world, have mercy on us.',
        es: 'Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.',
      },
      {
        type: 'response',
        en: 'Lamb of God, you take away the sins of the world, grant us peace.',
        es: 'Cordero de Dios, que quitas el pecado del mundo, danos la paz.',
      },
      {
        type: 'response',
        en: 'Lord, I am not worthy that you should enter under my roof, but only say the word and I shall be healed.',
        es: 'Se\u00f1or, no soy digno de que entres en mi casa, pero di una sola palabra y ser\u00e9 sanado.',
      },
      {
        type: 'action',
        en: 'Extend your hands in humility while receiving communion if your parish uses that posture.',
        es: 'Extiende las manos con humildad mientras recibes la comunión si en tu parroquia se usa ese gesto.',
      },
      {
        type: 'response',
        en: 'Amen.',
        es: 'Am\u00e9n.',
      },
      {
        type: 'action',
        en: 'After Communion, remain still and pray with gratitude as the priest says a prayer after communion.',
        es: 'Despu\u00e9s de la Comunio\u00f3n, queda en silencio y ora en gratitud mientras el sacerdote dice la oraci\u00f3n.',
      },
    ],
  },
  {
    id: 'concluding-rites',
    enTitle: 'Concluding Rites',
    esTitle: 'Ritos de conclusi\u00f3n',
    lines: [
      {
        type: 'text',
        en: 'After communion, the final part of the Mass sends the Church back into daily life.',
        es: 'Despu\u00e9s de la comunión, la parte final de la Misa env\u00eda a la Iglesia a la vida diaria.',
      },
      {
        type: 'action',
        en: 'Stand for the final blessing and keep a reverent silence until the priest gives the dismissal.',
        es: 'Mantente de pie para la bendici\u00f3n final y guarda silencio reverente hasta la despedida.',
      },
      {
        type: 'text',
        en: 'Priest: The Lord be with you.',
        es: 'Sacerdote: El Se\u00f1or est\u00e9 con vosotros.',
      },
      {
        type: 'response',
        en: 'And with your spirit.',
        es: 'Y con tu Esp\u00edritu.',
      },
      {
        type: 'note',
        en: 'Announcements, if any, are made here. The priest may also include the final blessing for special occasions.',
        es: 'En este punto se hacen anuncios si los hay. El sacerdote puede a\u00f1adir una bendici\u00f3n final para ocasiones especiales.',
      },
      {
        type: 'text',
        en: 'Priest: May almighty God bless you, the Father, and the Son, and the Holy Spirit.',
        es: 'Sacerdote: La bendici\u00f3n de Dios todopoderoso, Padre, Hijo y Esp\u00edritu Santo, descienda sobre vosotros.',
      },
      {
        type: 'action',
        en: 'Respond with a clear Amen.',
        es: 'Responde con un claro Am\u00e9n.',
      },
      {
        type: 'response',
        en: 'Amen.',
        es: 'Am\u00e9n.',
      },
      {
        type: 'text',
        en: 'Priest: Ite, missa est.',
        es: 'Sacerdote: La misa ha terminado. Vayan en paz.',
      },
      {
        type: 'response',
        en: 'Thanks be to God.',
        es: 'Demos gracias a Dios.',
      },
      {
        type: 'action',
        en: 'Depart in peace and try to carry the Eucharistic mystery into daily life.',
        es: 'Vayan en paz e intenten llevar el misterio eucar\u00edstico a la vida diaria.',
      },
      {
        type: 'note',
        en: 'Hands and posture instructions may vary by local custom: follow your parish, especially where kneeling is not used for some groups.',
        es: 'Las posturas de manos y de pie/arrodillado pueden variar seg\u00fan la costumbre local: sigue siempre el uso de tu parroquia.',
      },
    ],
  },
];

const MASS_GUIDE_META = {
  title: {
    en: 'Mass Guide',
    es: 'Gu\u00eda de la Misa',
  },
  subtitle: {
    en: 'Standard Roman Rite participation guide (Ordinary Form)',
    es: 'Gu\u00eda de participaci\u00f3n del Rito Romano (Forma Ordinaria)',
  },
  version: {
    en: 'Ordinary Form, Sunday/solemnity responses included',
    es: 'Forma Ordinaria, con respuestas de domingos y solemnidades',
  },
  sources: [
    {
      en: 'USCCB: Order of Mass',
      es: 'USCCB: Orden de la Misa',
      url: 'https://www.usccb.org/prayer-and-worship/the-mass/order-of-mass',
    },
    {
      en: 'Roman Missal structure and common prayers',
      es: 'Estructura y oraciones comunes del Misal Romano',
    },
  ],
};

export function getMassGuide(lang: Language): MassGuideContent {
  return {
    title: MASS_GUIDE_META.title[lang],
    subtitle: MASS_GUIDE_META.subtitle[lang],
    version: MASS_GUIDE_META.version[lang],
    sections: MASS_GUIDE_SECTIONS.map((section) => ({
      id: section.id,
      title: lang === 'en' ? section.enTitle : section.esTitle,
      lines: section.lines,
    })),
    sources: MASS_GUIDE_META.sources,
  };
}
