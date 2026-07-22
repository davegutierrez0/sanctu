/**
 * Standard Roman Rite Mass guide - English and Spanish
 * v1: Ordinary Form participant guide with action/response formatting markers.
 */

import type { Language } from '@/components/ThemeProvider';

export type MassGuideLineType = 'action' | 'response' | 'text' | 'note';
export type MassGuideReadingSlot = 'first' | 'psalm' | 'second' | 'alleluia' | 'gospel';

export interface MassGuideLine {
  type: MassGuideLineType;
  en: string;
  es: string;
  readingSlot?: MassGuideReadingSlot;
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
        en: 'The priest invites the assembly to acknowledge its sins and prepare to celebrate the sacred mysteries.',
        es: 'El sacerdote invita a la asamblea a reconocer sus pecados y prepararse para celebrar los sagrados misterios.',
      },
      {
        type: 'note',
        en: 'The Penitential Act follows. In many parishes, it is a short silent prayer followed by one of the Kyrie forms.',
        es: 'Luego viene el Acto Penitencial. En muchas parroquias, se hace una breve oraci\u00f3n de silencio y luego una forma del Kyrie.',
      },
      {
        type: 'action',
        en: 'Remain standing for the Penitential Act and Kyrie.',
        es: 'Permanece de pie durante el Acto Penitencial y el Kyrie.',
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
        en: 'Glory to God in the highest, and on earth peace to people of good will.',
        es: 'Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Se\u00f1or.',
      },
      {
        type: 'action',
        en: 'Remain standing as the priest invites the assembly to pray the Collect.',
        es: 'Permanece de pie cuando el sacerdote invita a la asamblea a rezar la oración Colecta.',
      },
      {
        type: 'text',
        en: 'Priest: Let us pray. The Collect appointed for the day follows.',
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
        en: 'Sit for the first reading, responsorial psalm, and second reading when one is appointed.',
        es: 'Siéntate para la primera lectura, el salmo responsorial y la segunda lectura cuando corresponda.',
      },
      {
        type: 'text',
        en: 'First reading: proclaimed by a lector or deacon.',
        es: 'Primera lectura: la proclama un lector o di\u00e1cono.',
        readingSlot: 'first',
      },
      {
        type: 'note',
        en: 'When a responsorial psalm is used, sing or pray the refrain and meditate on the verses.',
        es: 'Cuando se use salmo responsorial, canta o reza el estribillo y medita los vers\u00edculos.',
        readingSlot: 'psalm',
      },
      {
        type: 'text',
        en: 'Second reading: proclaimed on Sundays and solemnities when appointed.',
        es: 'Segunda lectura: se proclama los domingos y solemnidades cuando corresponde.',
        readingSlot: 'second',
      },
      {
        type: 'text',
        en: 'Gospel acclamation: the Alleluia or seasonal acclamation prepares the assembly for the Gospel.',
        es: 'Aclamaci\u00f3n del Evangelio: el Aleluya o la aclamaci\u00f3n propia prepara a la asamblea para el Evangelio.',
        readingSlot: 'alleluia',
      },
      {
        type: 'action',
        en: 'Stand for the Gospel. Keep attention and silence until the final acclamation.',
        es: 'Ponte de pie para el Evangelio. Guarda silencio y atenci\u00f3n hasta la aclamaci\u00f3n final.',
      },
      {
        type: 'text',
        en: 'Priest/Deacon: A reading from the holy Gospel according to...',
        es: 'Sacerdote/Di\u00e1cono: Lectura del santo Evangelio seg\u00fan...',
      },
      {
        type: 'response',
        en: 'Glory to you, O Lord.',
        es: 'Gloria a ti, Se\u00f1or.',
      },
      {
        type: 'text',
        en: 'The Gospel is proclaimed in its own place by the deacon or priest.',
        es: 'El Evangelio es proclamado en su lugar propio por el di\u00e1cono o sacerdote.',
        readingSlot: 'gospel',
      },
      {
        type: 'text',
        en: 'Priest/Deacon: The Gospel of the Lord.',
        es: 'Sacerdote/Di\u00e1cono: Palabra del Se\u00f1or.',
      },
      {
        type: 'response',
        en: 'Praise to you, Lord Jesus Christ.',
        es: 'Gloria a ti, Se\u00f1or Jes\u00fas.',
      },
      {
        type: 'action',
        en: 'Sit for the homily and listen prayerfully.',
        es: 'Siéntate para la homilía y escucha con espíritu de oración.',
      },
      {
        type: 'action',
        en: 'On Sundays and solemnities, stand for the Profession of Faith (Creed).',
        es: 'Los domingos y solemnidades, ponte de pie para la Profesión de Fe (Credo).',
      },
      {
        type: 'note',
        en: 'Use the parish worship aid for the complete Nicene Creed or Apostles’ Creed appointed for the celebration.',
        es: 'Sigue el subsidio de la parroquia para el texto completo del Credo niceno-constantinopolitano o del Credo de los Apóstoles indicado para la celebración.',
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
        en: 'Sit while the altar is prepared and the gifts are presented, following local custom.',
        es: 'Siéntate mientras se prepara el altar y se presentan los dones, según la costumbre local.',
      },
      {
        type: 'text',
        en: 'The priest says one of the prayers over the gifts, for example: Blessed are you, Lord God of all creation...',
        es: 'El sacerdote reza una de las oraciones sobre los dones, por ejemplo: Bendito seas, Se\u00f1or Dios de toda criatura...',
      },
      {
        type: 'note',
        en: 'The wording of the prayers over the gifts and the Prayer over the Offerings changes with the celebration.',
        es: 'El texto de las oraciones sobre los dones y la Oración sobre las Ofrendas cambia según la celebración.',
      },
      {
        type: 'action',
        en: 'Stand for the invitation to prayer, Prayer over the Offerings, and the Preface dialogue.',
        es: 'Ponte de pie para la invitación a orar, la Oración sobre las Ofrendas y el diálogo del Prefacio.',
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
        en: 'Holy, Holy, Holy Lord God of hosts. Heaven and earth are full of your glory. Hosanna in the highest. Blessed is he who comes in the name of the Lord. Hosanna in the highest.',
        es: 'Santo, Santo, Santo es el Señor, Dios del universo. Llenos están el cielo y la tierra de tu gloria. Hosanna en el cielo. Bendito el que viene en nombre del Señor. Hosanna en el cielo.',
      },
      {
        type: 'action',
        en: 'Kneel after the Holy, Holy, Holy where that is the local norm; otherwise make a profound bow during the consecration.',
        es: 'Arrodíllate después del Santo donde ésa sea la norma local; de lo contrario, haz una inclinación profunda durante la consagración.',
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
        en: 'After the consecration, join the Memorial Acclamation when the priest invites it.',
        es: 'Después de la consagración, únete a la Aclamación memorial cuando el sacerdote la invite.',
      },
      {
        type: 'text',
        en: 'The priest introduces the acclamation with: The mystery of faith.',
        es: 'El sacerdote introduce la aclamaci\u00f3n diciendo: El misterio de la fe.',
      },
      {
        type: 'response',
        en: 'We proclaim your Death, O Lord, and profess your Resurrection until you come again.',
        es: 'Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!',
      },
      {
        type: 'action',
        en: 'The Eucharistic Prayer ends with the doxology and Great Amen. Then stand and pray the Lord’s Prayer with the assembly, following local posture.',
        es: 'La Plegaria Eucarística termina con la doxología y el gran Amén. Después, ponte de pie y reza el Padre Nuestro con la asamblea, siguiendo la postura local.',
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
        en: 'For the kingdom, the power and the glory are yours now and for ever.',
        es: 'Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor.',
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
        en: 'Join the Lamb of God during the Fraction Rite; posture afterward follows the local norm.',
        es: 'Únete al Cordero de Dios durante la fracción del pan; la postura posterior sigue la norma local.',
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
        es: 'Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.',
      },
      {
        type: 'action',
        en: 'Approach reverently and receive Holy Communion according to the norm of your diocese and parish.',
        es: 'Acércate con reverencia y recibe la Sagrada Comunión según la norma de tu diócesis y parroquia.',
      },
      {
        type: 'response',
        en: 'Amen.',
        es: 'Am\u00e9n.',
      },
      {
        type: 'action',
        en: 'After Communion, keep silence and pray with gratitude. Stand for the Prayer after Communion.',
        es: 'Después de la Comunión, guarda silencio y ora con gratitud. Ponte de pie para la Oración después de la Comunión.',
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
    en: 'Ordinary Form · practical companion for Sundays and weekdays',
    es: 'Forma Ordinaria · guía práctica para domingos y días feriales',
  },
  sources: [
    {
      en: 'USCCB: Order of Mass',
      es: 'USCCB: Orden de la Misa',
      url: 'https://www.usccb.org/prayer-and-worship/the-mass/order-of-mass',
    },
    {
      en: 'Roman Missal structure and common prayers',
      es: 'USCCB: Textos del Ordinario de la Misa',
      url: 'https://www.usccb.org/es/committees/divine-worship/policies/textos-del-ordinario-de-la-misa',
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
