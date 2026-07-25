/**
 * Rosary Mysteries - Bilingual (English/Spanish)
 */

import type { Language } from '@/components/ThemeProvider';

export type MysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface Mystery {
  number: number;
  title: { en: string; es: string };
  scripture: {
    reference: { en: string; es: string };
    text: { en: string; es: string };
  };
  meditation: { en: string; es: string };
}

export interface MysterySet {
  type: MysteryType;
  name: { en: string; es: string };
  days: { en: string[]; es: string[] };
  color: string;
  mysteries: Mystery[];
}

export const ROSARY_MYSTERIES: Record<MysteryType, MysterySet> = {
  joyful: {
    type: 'joyful',
    name: { en: 'Joyful Mysteries', es: 'Misterios Gozosos' },
    days: { en: ['Monday', 'Saturday'], es: ['Lunes', 'Sábado'] },
    color: 'text-yellow-600',
    mysteries: [
      {
        number: 1,
        title: { en: 'The Annunciation', es: 'La Anunciación' },
        scripture: {
          reference: { en: 'Luke 1:26–38', es: 'Lucas 1:26–38' },
          text: {
            en: 'Mary said, “Behold, I am the handmaid of the Lord. Let it be done to me according to your word.”',
            es: 'María dijo: «He aquí la sierva del Señor; hágase en mí según tu palabra».',
          },
        },
        meditation: {
          en: 'The angel Gabriel announces to Mary that she will be the Mother of God.',
          es: 'El ángel Gabriel anuncia a María que será la Madre de Dios.',
        },
      },
      {
        number: 2,
        title: { en: 'The Visitation', es: 'La Visitación' },
        scripture: {
          reference: { en: 'Luke 1:39–56', es: 'Lucas 1:39–56' },
          text: {
            en: '“Blessed are you among women, and blessed is the fruit of your womb. How does this happen to me, that the mother of my Lord should come to me?”',
            es: '«Bendita tú entre las mujeres y bendito el fruto de tu vientre. ¿Quién soy yo para que la madre de mi Señor venga a visitarme?»',
          },
        },
        meditation: {
          en: 'Mary visits her cousin Elizabeth, who proclaims her blessed.',
          es: 'María visita a su prima Isabel, quien la proclama bendita.',
        },
      },
      {
        number: 3,
        title: { en: 'The Nativity', es: 'El Nacimiento de Jesús' },
        scripture: {
          reference: { en: 'Luke 2:1–20', es: 'Lucas 2:1–20' },
          text: {
            en: 'She gave birth to her firstborn son, wrapped him in swaddling clothes, and laid him in a manger, because there was no room for them.',
            es: 'Dio a luz a su hijo primogénito, lo envolvió en pañales y lo acostó en un pesebre, porque no había lugar para ellos.',
          },
        },
        meditation: {
          en: 'Jesus is born in Bethlehem.',
          es: 'Jesús nace en Belén.',
        },
      },
      {
        number: 4,
        title: { en: 'The Presentation', es: 'La Presentación en el Templo' },
        scripture: {
          reference: { en: 'Luke 2:22–38', es: 'Lucas 2:22–38' },
          text: {
            en: '“My eyes have seen your salvation, which you prepared in sight of all the peoples: a light for revelation to the nations, and glory for your people Israel.”',
            es: '«Mis ojos han visto tu salvación, la que preparaste ante todos los pueblos: luz para alumbrar a las naciones y gloria de tu pueblo Israel».',
          },
        },
        meditation: {
          en: 'Mary and Joseph present Jesus in the Temple.',
          es: 'María y José presentan a Jesús en el Templo.',
        },
      },
      {
        number: 5,
        title: { en: 'Finding in the Temple', es: 'El Niño Jesús Perdido y Hallado en el Templo' },
        scripture: {
          reference: { en: 'Luke 2:41–52', es: 'Lucas 2:41–52' },
          text: {
            en: '“Why were you looking for me? Did you not know that I must be in my Father’s house?”',
            es: '«¿Por qué me buscaban? ¿No sabían que debo estar en la casa de mi Padre?»',
          },
        },
        meditation: {
          en: 'Mary and Joseph find the young Jesus teaching in the Temple.',
          es: 'María y José encuentran al niño Jesús enseñando en el Templo.',
        },
      },
    ],
  },
  luminous: {
    type: 'luminous',
    name: { en: 'Luminous Mysteries', es: 'Misterios Luminosos' },
    days: { en: ['Thursday'], es: ['Jueves'] },
    color: 'text-blue-400',
    mysteries: [
      {
        number: 1,
        title: { en: 'The Baptism in the Jordan', es: 'El Bautismo de Jesús en el Jordán' },
        scripture: {
          reference: { en: 'Matthew 3:13–17', es: 'Mateo 3:13–17' },
          text: {
            en: 'A voice came from the heavens, saying, “This is my beloved Son, with whom I am well pleased.”',
            es: 'Una voz vino del cielo y dijo: «Este es mi Hijo amado, en quien me complazco».',
          },
        },
        meditation: {
          en: 'Jesus is baptized by John and the Father proclaims Him His beloved Son.',
          es: 'Jesús es bautizado por Juan y el Padre lo proclama su Hijo amado.',
        },
      },
      {
        number: 2,
        title: { en: 'The Wedding at Cana', es: 'Las Bodas de Caná' },
        scripture: {
          reference: { en: 'John 2:1–11', es: 'Juan 2:1–11' },
          text: {
            en: 'His mother said to the servers, “Do whatever he tells you.”',
            es: 'Su madre dijo a los que servían: «Hagan lo que él les diga».',
          },
        },
        meditation: {
          en: "At Mary's request, Jesus performs His first miracle.",
          es: 'A petición de María, Jesús realiza su primer milagro.',
        },
      },
      {
        number: 3,
        title: { en: 'Proclamation of the Kingdom', es: 'El Anuncio del Reino de Dios' },
        scripture: {
          reference: { en: 'Mark 1:14–15', es: 'Marcos 1:14–15' },
          text: {
            en: '“The time is fulfilled, and the kingdom of God is at hand. Repent, and believe in the Gospel.”',
            es: '«El tiempo se ha cumplido y el Reino de Dios está cerca. Conviértanse y crean en el Evangelio».',
          },
        },
        meditation: {
          en: 'Jesus proclaims the Gospel and calls us to conversion.',
          es: 'Jesús proclama el Evangelio y nos llama a la conversión.',
        },
      },
      {
        number: 4,
        title: { en: 'The Transfiguration', es: 'La Transfiguración' },
        scripture: {
          reference: { en: 'Matthew 17:1–8', es: 'Mateo 17:1–8' },
          text: {
            en: '“This is my beloved Son, with whom I am well pleased; listen to him.”',
            es: '«Este es mi Hijo amado, en quien me complazco; escúchenlo».',
          },
        },
        meditation: {
          en: 'Jesus is transfigured in glory before Peter, James, and John.',
          es: 'Jesús se transfigura en gloria ante Pedro, Santiago y Juan.',
        },
      },
      {
        number: 5,
        title: { en: 'Institution of the Eucharist', es: 'La Institución de la Eucaristía' },
        scripture: {
          reference: { en: 'Matthew 26:26–28', es: 'Mateo 26:26–28' },
          text: {
            en: '“Take and eat; this is my body.” Then he took a cup and said, “Drink from it, all of you, for this is my blood of the covenant.”',
            es: '«Tomen y coman; esto es mi cuerpo». Luego tomó una copa y dijo: «Beban todos de ella, porque esta es mi sangre de la alianza».',
          },
        },
        meditation: {
          en: 'Jesus gives us His Body and Blood at the Last Supper.',
          es: 'Jesús nos da su Cuerpo y Sangre en la Última Cena.',
        },
      },
    ],
  },
  sorrowful: {
    type: 'sorrowful',
    name: { en: 'Sorrowful Mysteries', es: 'Misterios Dolorosos' },
    days: { en: ['Tuesday', 'Friday'], es: ['Martes', 'Viernes'] },
    color: 'text-red-600',
    mysteries: [
      {
        number: 1,
        title: { en: 'The Agony in the Garden', es: 'La Oración en el Huerto' },
        scripture: {
          reference: { en: 'Matthew 26:36–46', es: 'Mateo 26:36–46' },
          text: {
            en: '“My Father, if it is possible, let this cup pass from me; yet, not as I will, but as you will.”',
            es: '«Padre mío, si es posible, que pase de mí este cáliz; pero no se haga como yo quiero, sino como quieres tú».',
          },
        },
        meditation: {
          en: 'Jesus prays in anguish in the Garden of Gethsemane.',
          es: 'Jesús ora con angustia en el Huerto de Getsemaní.',
        },
      },
      {
        number: 2,
        title: { en: 'The Scourging at the Pillar', es: 'La Flagelación' },
        scripture: {
          reference: { en: 'Matthew 27:26', es: 'Mateo 27:26' },
          text: {
            en: 'Then he released Barabbas to them, but after he had Jesus scourged, he handed him over to be crucified.',
            es: 'Entonces les soltó a Barrabás; y a Jesús, después de azotarlo, lo entregó para que fuera crucificado.',
          },
        },
        meditation: {
          en: 'Jesus is brutally scourged by the Roman soldiers.',
          es: 'Jesús es cruelmente azotado por los soldados romanos.',
        },
      },
      {
        number: 3,
        title: { en: 'The Crowning with Thorns', es: 'La Coronación de Espinas' },
        scripture: {
          reference: { en: 'Matthew 27:27–31', es: 'Mateo 27:27–31' },
          text: {
            en: 'Weaving a crown out of thorns, they placed it on his head. Kneeling before him, they mocked him: “Hail, King of the Jews!”',
            es: 'Trenzaron una corona de espinas y se la pusieron en la cabeza. Doblando la rodilla ante él, se burlaban: «¡Salve, rey de los judíos!»',
          },
        },
        meditation: {
          en: 'Jesus is mocked and crowned with thorns.',
          es: 'Jesús es burlado y coronado con espinas.',
        },
      },
      {
        number: 4,
        title: { en: 'The Carrying of the Cross', es: 'Jesús Carga con la Cruz' },
        scripture: {
          reference: { en: 'John 19:16–17', es: 'Juan 19:16–17' },
          text: {
            en: 'Carrying the cross himself, Jesus went out to what is called the Place of the Skull, in Hebrew, Golgotha.',
            es: 'Jesús, cargando con su cruz, salió hacia el lugar llamado de la Calavera, que en hebreo se dice Gólgota.',
          },
        },
        meditation: {
          en: 'Jesus carries His cross to Calvary.',
          es: 'Jesús carga su cruz hacia el Calvario.',
        },
      },
      {
        number: 5,
        title: { en: 'The Crucifixion', es: 'La Crucifixión' },
        scripture: {
          reference: { en: 'Luke 23:33–46', es: 'Lucas 23:33–46' },
          text: {
            en: 'Jesus cried out in a loud voice, “Father, into your hands I commend my spirit”; and when he had said this, he breathed his last.',
            es: 'Jesús clamó con voz fuerte: «Padre, en tus manos encomiendo mi espíritu». Y, dicho esto, expiró.',
          },
        },
        meditation: {
          en: 'Jesus dies on the cross for our salvation.',
          es: 'Jesús muere en la cruz por nuestra salvación.',
        },
      },
    ],
  },
  glorious: {
    type: 'glorious',
    name: { en: 'Glorious Mysteries', es: 'Misterios Gloriosos' },
    days: { en: ['Wednesday', 'Sunday'], es: ['Miércoles', 'Domingo'] },
    color: 'text-purple-600',
    mysteries: [
      {
        number: 1,
        title: { en: 'The Resurrection', es: 'La Resurrección' },
        scripture: {
          reference: { en: 'Matthew 28:1–10', es: 'Mateo 28:1–10' },
          text: {
            en: '“Do not be afraid! I know that you are seeking Jesus the crucified. He is not here, for he has been raised just as he said.”',
            es: '«No teman. Sé que buscan a Jesús, el crucificado. No está aquí: ha resucitado, como había dicho».',
          },
        },
        meditation: {
          en: 'Jesus rises from the dead in glory.',
          es: 'Jesús resucita de entre los muertos con gloria.',
        },
      },
      {
        number: 2,
        title: { en: 'The Ascension', es: 'La Ascensión' },
        scripture: {
          reference: { en: 'Acts 1:6–11', es: 'Hechos 1:6–11' },
          text: {
            en: 'When he had said this, as they were looking on, he was lifted up, and a cloud took him from their sight.',
            es: 'Dicho esto, mientras ellos lo miraban, fue elevado, y una nube lo ocultó de sus ojos.',
          },
        },
        meditation: {
          en: 'Jesus ascends into Heaven.',
          es: 'Jesús asciende al Cielo.',
        },
      },
      {
        number: 3,
        title: { en: 'The Descent of the Holy Spirit', es: 'La Venida del Espíritu Santo' },
        scripture: {
          reference: { en: 'Acts 2:1–4', es: 'Hechos 2:1–4' },
          text: {
            en: 'They were all filled with the Holy Spirit and began to speak in different tongues, as the Spirit enabled them to proclaim.',
            es: 'Todos quedaron llenos del Espíritu Santo y comenzaron a hablar en otras lenguas, según el Espíritu les concedía expresarse.',
          },
        },
        meditation: {
          en: 'The Holy Spirit descends upon the Apostles at Pentecost.',
          es: 'El Espíritu Santo desciende sobre los Apóstoles en Pentecostés.',
        },
      },
      {
        number: 4,
        title: { en: 'The Assumption', es: 'La Asunción de María' },
        scripture: {
          reference: { en: 'Revelation 12:1', es: 'Apocalipsis 12:1' },
          text: {
            en: 'A great sign appeared in the sky: a woman clothed with the sun, with the moon under her feet.',
            es: 'Apareció en el cielo una gran señal: una mujer vestida del sol, con la luna bajo sus pies.',
          },
        },
        meditation: {
          en: 'Mary is assumed body and soul into Heaven.',
          es: 'María es asunta al Cielo en cuerpo y alma.',
        },
      },
      {
        number: 5,
        title: { en: 'The Coronation of Mary', es: 'La Coronación de María' },
        scripture: {
          reference: { en: 'Revelation 12:1', es: 'Apocalipsis 12:1' },
          text: {
            en: 'A great sign appeared in the sky: a woman clothed with the sun, and on her head a crown of twelve stars.',
            es: 'Apareció en el cielo una gran señal: una mujer vestida del sol, y sobre su cabeza una corona de doce estrellas.',
          },
        },
        meditation: {
          en: 'Mary is crowned Queen of Heaven and Earth.',
          es: 'María es coronada Reina del Cielo y de la Tierra.',
        },
      },
    ],
  },
};

/**
 * Get today's mystery based on day of week
 */
export function getTodaysMystery(): MysterySet {
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Map day numbers to mystery types
  const dayToMystery: Record<number, MysteryType> = {
    0: 'glorious', // Sunday
    1: 'joyful', // Monday
    2: 'sorrowful', // Tuesday
    3: 'glorious', // Wednesday
    4: 'luminous', // Thursday
    5: 'sorrowful', // Friday
    6: 'joyful', // Saturday
  };

  return ROSARY_MYSTERIES[dayToMystery[dayOfWeek]];
}

/**
 * Get mystery by type
 */
export function getMysteryByType(type: MysteryType): MysterySet {
  return ROSARY_MYSTERIES[type];
}

/**
 * Get localized mystery set
 */
export function getLocalizedMystery(mysterySet: MysterySet, lang: Language) {
  return {
    ...mysterySet,
    name: mysterySet.name[lang],
    days: mysterySet.days[lang],
    mysteries: mysterySet.mysteries.map((m) => ({
      ...m,
      title: m.title[lang],
      scripture: {
        reference: m.scripture.reference[lang],
        text: m.scripture.text[lang],
      },
      meditation: m.meditation[lang],
    })),
  };
}

// Rosary Prayers - Bilingual
export const ROSARY_PRAYERS = {
  signOfTheCross: {
    en: {
      title: 'Sign of the Cross',
      text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
    },
    es: {
      title: 'La Señal de la Cruz',
      text: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
    },
  },
  apostlesCreed: {
    en: {
      title: "Apostles' Creed",
      text: 'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
    },
    es: {
      title: 'El Credo',
      text: 'Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',
    },
  },
  ourFather: {
    en: {
      title: 'Our Father',
      text: 'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    },
    es: {
      title: 'Padre Nuestro',
      text: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
    },
  },
  hailMary: {
    en: {
      title: 'Hail Mary',
      text: 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
    },
    es: {
      title: 'Ave María',
      text: 'Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
    },
  },
  gloryBe: {
    en: {
      title: 'Glory Be',
      text: 'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.',
    },
    es: {
      title: 'Gloria',
      text: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
    },
  },
  fatimaPrayer: {
    en: {
      title: 'Fatima Prayer',
      text: 'O my Jesus, forgive us our sins, save us from the fires of hell; lead all souls to Heaven, especially those who have most need of your mercy.',
    },
    es: {
      title: 'Oración de Fátima',
      text: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno; lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.',
    },
  },
  hailHolyQueen: {
    en: {
      title: 'Hail, Holy Queen',
      text: 'Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.',
    },
    es: {
      title: 'Salve Regina',
      text: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra. Dios te salve. A ti clamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos, y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María!',
    },
  },
  closingDialogue: {
    en: {
      versicle: 'V. Pray for us, O holy Mother of God.',
      response: 'R. That we may be made worthy of the promises of Christ.',
    },
    es: {
      versicle: 'V. Ruega por nosotros, Santa Madre de Dios.',
      response: 'R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.',
    },
  },
  closingPrayer: {
    en: {
      title: 'Closing Prayer',
      intro: 'Let us pray:',
      text: 'O God, whose Only Begotten Son, by his life, Death, and Resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that while meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.',
    },
    es: {
      title: 'Oración Final',
      intro: 'Oremos:',
      text: 'Oh Dios, cuyo Unigénito, por su vida, Muerte y Resurrección, nos ha comprado el premio de la salvación eterna, concédenos, te suplicamos, que meditando estos misterios del Santísimo Rosario de la Bienaventurada Virgen María, imitemos lo que contienen y alcancemos lo que prometen. Por el mismo Jesucristo Nuestro Señor. Amén.',
    },
  },
};

// UI Labels for rosary page
export const ROSARY_UI = {
  en: {
    title: 'The Holy Rosary',
    subtitle: 'A meditation on the life of Christ',
    selectMystery: 'Select Mystery',
    decade: 'Decade',
    bead: 'Bead',
    progress: 'Progress',
    currentMystery: 'Current Mystery',
    meditation: 'Meditation',
    scripture: 'Scripture',
    previous: 'Previous',
    next: 'Next',
    complete: 'Complete',
    todaysMystery: "Today's Mystery",
    instructions: 'Tap the bead counter to advance through each decade',
    openingPrayers: 'Opening Prayers',
    closingPrayers: 'Closing Prayers',
    decadeComplete: 'Decade Complete',
    rosaryComplete: 'Rosary Complete!',
    prayAnother: 'Pray Another Rosary',
    includeFatima: 'Include Fatima Prayer',
    beginRosary: 'Begin Rosary',
    nextPrayer: 'Next Prayer',
    nextDecade: 'Next Decade',
    nextBead: 'Next Bead',
    finishRosary: 'Finish Rosary',
    allMysteries: 'All Mysteries',
    optional: '(optional)',
    pray: 'Pray:',
    readScripture: 'Read Scripture',
    scriptureReflection: 'A passage for meditation',
    resumeTitle: 'Continue your Rosary?',
    resumeAt: 'Saved at',
    resume: 'Resume',
    startOver: 'Start over',
  },
  es: {
    title: 'El Santo Rosario',
    subtitle: 'Una meditación sobre la vida de Cristo',
    selectMystery: 'Seleccionar Misterio',
    decade: 'Decena',
    bead: 'Cuenta',
    progress: 'Progreso',
    currentMystery: 'Misterio Actual',
    meditation: 'Meditación',
    scripture: 'Escritura',
    previous: 'Anterior',
    next: 'Siguiente',
    complete: 'Completar',
    todaysMystery: 'Misterio de Hoy',
    instructions: 'Toca el contador para avanzar en cada decena',
    openingPrayers: 'Oraciones Iniciales',
    closingPrayers: 'Oraciones Finales',
    decadeComplete: 'Decena Completa',
    rosaryComplete: '¡Rosario Completo!',
    prayAnother: 'Rezar Otro Rosario',
    includeFatima: 'Incluir Oración de Fátima',
    beginRosary: 'Comenzar el Rosario',
    nextPrayer: 'Siguiente Oración',
    nextDecade: 'Siguiente Decena',
    nextBead: 'Siguiente Cuenta',
    finishRosary: 'Terminar el Rosario',
    allMysteries: 'Todos los Misterios',
    optional: '(opcional)',
    pray: 'Reza:',
    readScripture: 'Leer la Escritura',
    scriptureReflection: 'Un pasaje para meditar',
    resumeTitle: '¿Continuar tu Rosario?',
    resumeAt: 'Guardado en',
    resume: 'Continuar',
    startOver: 'Empezar de nuevo',
  },
};
