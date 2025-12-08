/**
 * Rosary Mysteries - Bilingual (English/Spanish)
 */

import type { Language } from '@/components/ThemeProvider';

export type MysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface Mystery {
  number: number;
  title: { en: string; es: string };
  scripture?: string;
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
        scripture: 'Luke 1:26-38',
        meditation: {
          en: 'The angel Gabriel announces to Mary that she will be the Mother of God.',
          es: 'El ángel Gabriel anuncia a María que será la Madre de Dios.',
        },
      },
      {
        number: 2,
        title: { en: 'The Visitation', es: 'La Visitación' },
        scripture: 'Luke 1:39-56',
        meditation: {
          en: 'Mary visits her cousin Elizabeth, who proclaims her blessed.',
          es: 'María visita a su prima Isabel, quien la proclama bendita.',
        },
      },
      {
        number: 3,
        title: { en: 'The Nativity', es: 'El Nacimiento de Jesús' },
        scripture: 'Luke 2:1-20',
        meditation: {
          en: 'Jesus is born in Bethlehem.',
          es: 'Jesús nace en Belén.',
        },
      },
      {
        number: 4,
        title: { en: 'The Presentation', es: 'La Presentación en el Templo' },
        scripture: 'Luke 2:22-38',
        meditation: {
          en: 'Mary and Joseph present Jesus in the Temple.',
          es: 'María y José presentan a Jesús en el Templo.',
        },
      },
      {
        number: 5,
        title: { en: 'Finding in the Temple', es: 'El Niño Jesús Perdido y Hallado en el Templo' },
        scripture: 'Luke 2:41-52',
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
        scripture: 'Matthew 3:13-17',
        meditation: {
          en: 'Jesus is baptized by John and the Father proclaims Him His beloved Son.',
          es: 'Jesús es bautizado por Juan y el Padre lo proclama su Hijo amado.',
        },
      },
      {
        number: 2,
        title: { en: 'The Wedding at Cana', es: 'Las Bodas de Caná' },
        scripture: 'John 2:1-11',
        meditation: {
          en: "At Mary's request, Jesus performs His first miracle.",
          es: 'A petición de María, Jesús realiza su primer milagro.',
        },
      },
      {
        number: 3,
        title: { en: 'Proclamation of the Kingdom', es: 'El Anuncio del Reino de Dios' },
        scripture: 'Mark 1:14-15',
        meditation: {
          en: 'Jesus proclaims the Gospel and calls us to conversion.',
          es: 'Jesús proclama el Evangelio y nos llama a la conversión.',
        },
      },
      {
        number: 4,
        title: { en: 'The Transfiguration', es: 'La Transfiguración' },
        scripture: 'Matthew 17:1-8',
        meditation: {
          en: 'Jesus is transfigured in glory before Peter, James, and John.',
          es: 'Jesús se transfigura en gloria ante Pedro, Santiago y Juan.',
        },
      },
      {
        number: 5,
        title: { en: 'Institution of the Eucharist', es: 'La Institución de la Eucaristía' },
        scripture: 'Matthew 26:26-28',
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
        scripture: 'Matthew 26:36-46',
        meditation: {
          en: 'Jesus prays in anguish in the Garden of Gethsemane.',
          es: 'Jesús ora con angustia en el Huerto de Getsemaní.',
        },
      },
      {
        number: 2,
        title: { en: 'The Scourging at the Pillar', es: 'La Flagelación' },
        scripture: 'Matthew 27:26',
        meditation: {
          en: 'Jesus is brutally scourged by the Roman soldiers.',
          es: 'Jesús es cruelmente azotado por los soldados romanos.',
        },
      },
      {
        number: 3,
        title: { en: 'The Crowning with Thorns', es: 'La Coronación de Espinas' },
        scripture: 'Matthew 27:27-31',
        meditation: {
          en: 'Jesus is mocked and crowned with thorns.',
          es: 'Jesús es burlado y coronado con espinas.',
        },
      },
      {
        number: 4,
        title: { en: 'The Carrying of the Cross', es: 'Jesús Carga con la Cruz' },
        scripture: 'Matthew 27:32',
        meditation: {
          en: 'Jesus carries His cross to Calvary.',
          es: 'Jesús carga su cruz hacia el Calvario.',
        },
      },
      {
        number: 5,
        title: { en: 'The Crucifixion', es: 'La Crucifixión' },
        scripture: 'Matthew 27:33-56',
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
        scripture: 'Matthew 28:1-10',
        meditation: {
          en: 'Jesus rises from the dead in glory.',
          es: 'Jesús resucita de entre los muertos con gloria.',
        },
      },
      {
        number: 2,
        title: { en: 'The Ascension', es: 'La Ascensión' },
        scripture: 'Acts 1:6-11',
        meditation: {
          en: 'Jesus ascends into Heaven.',
          es: 'Jesús asciende al Cielo.',
        },
      },
      {
        number: 3,
        title: { en: 'The Descent of the Holy Spirit', es: 'La Venida del Espíritu Santo' },
        scripture: 'Acts 2:1-4',
        meditation: {
          en: 'The Holy Spirit descends upon the Apostles at Pentecost.',
          es: 'El Espíritu Santo desciende sobre los Apóstoles en Pentecostés.',
        },
      },
      {
        number: 4,
        title: { en: 'The Assumption', es: 'La Asunción de María' },
        scripture: 'Revelation 12:1',
        meditation: {
          en: 'Mary is assumed body and soul into Heaven.',
          es: 'María es asunta al Cielo en cuerpo y alma.',
        },
      },
      {
        number: 5,
        title: { en: 'The Coronation of Mary', es: 'La Coronación de María' },
        scripture: 'Revelation 12:1',
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
      meditation: m.meditation[lang],
    })),
  };
}

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
  },
};
