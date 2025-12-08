/**
 * Rosary Mysteries
 */

export type MysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface Mystery {
  number: number;
  title: string;
  scripture?: string;
  meditation?: string;
}

export interface MysterySet {
  type: MysteryType;
  name: string;
  days: string[];
  color: string;
  mysteries: Mystery[];
}

export const ROSARY_MYSTERIES: Record<MysteryType, MysterySet> = {
  joyful: {
    type: 'joyful',
    name: 'Joyful Mysteries',
    days: ['Monday', 'Saturday'],
    color: 'text-yellow-600',
    mysteries: [
      {
        number: 1,
        title: 'The Annunciation',
        scripture: 'Luke 1:26-38',
        meditation: 'The angel Gabriel announces to Mary that she will be the Mother of God.',
      },
      {
        number: 2,
        title: 'The Visitation',
        scripture: 'Luke 1:39-56',
        meditation: 'Mary visits her cousin Elizabeth, who proclaims her blessed.',
      },
      {
        number: 3,
        title: 'The Nativity',
        scripture: 'Luke 2:1-20',
        meditation: 'Jesus is born in Bethlehem.',
      },
      {
        number: 4,
        title: 'The Presentation',
        scripture: 'Luke 2:22-38',
        meditation: 'Mary and Joseph present Jesus in the Temple.',
      },
      {
        number: 5,
        title: 'Finding in the Temple',
        scripture: 'Luke 2:41-52',
        meditation: 'Mary and Joseph find the young Jesus teaching in the Temple.',
      },
    ],
  },
  luminous: {
    type: 'luminous',
    name: 'Luminous Mysteries',
    days: ['Thursday'],
    color: 'text-blue-400',
    mysteries: [
      {
        number: 1,
        title: 'The Baptism in the Jordan',
        scripture: 'Matthew 3:13-17',
        meditation: 'Jesus is baptized by John and the Father proclaims Him His beloved Son.',
      },
      {
        number: 2,
        title: 'The Wedding at Cana',
        scripture: 'John 2:1-11',
        meditation: 'At Mary\'s request, Jesus performs His first miracle.',
      },
      {
        number: 3,
        title: 'Proclamation of the Kingdom',
        scripture: 'Mark 1:14-15',
        meditation: 'Jesus proclaims the Gospel and calls us to conversion.',
      },
      {
        number: 4,
        title: 'The Transfiguration',
        scripture: 'Matthew 17:1-8',
        meditation: 'Jesus is transfigured in glory before Peter, James, and John.',
      },
      {
        number: 5,
        title: 'Institution of the Eucharist',
        scripture: 'Matthew 26:26-28',
        meditation: 'Jesus gives us His Body and Blood at the Last Supper.',
      },
    ],
  },
  sorrowful: {
    type: 'sorrowful',
    name: 'Sorrowful Mysteries',
    days: ['Tuesday', 'Friday'],
    color: 'text-red-600',
    mysteries: [
      {
        number: 1,
        title: 'The Agony in the Garden',
        scripture: 'Matthew 26:36-46',
        meditation: 'Jesus prays in anguish in the Garden of Gethsemane.',
      },
      {
        number: 2,
        title: 'The Scourging at the Pillar',
        scripture: 'Matthew 27:26',
        meditation: 'Jesus is brutally scourged by the Roman soldiers.',
      },
      {
        number: 3,
        title: 'The Crowning with Thorns',
        scripture: 'Matthew 27:27-31',
        meditation: 'Jesus is mocked and crowned with thorns.',
      },
      {
        number: 4,
        title: 'The Carrying of the Cross',
        scripture: 'Matthew 27:32',
        meditation: 'Jesus carries His cross to Calvary.',
      },
      {
        number: 5,
        title: 'The Crucifixion',
        scripture: 'Matthew 27:33-56',
        meditation: 'Jesus dies on the cross for our salvation.',
      },
    ],
  },
  glorious: {
    type: 'glorious',
    name: 'Glorious Mysteries',
    days: ['Wednesday', 'Sunday'],
    color: 'text-purple-600',
    mysteries: [
      {
        number: 1,
        title: 'The Resurrection',
        scripture: 'Matthew 28:1-10',
        meditation: 'Jesus rises from the dead in glory.',
      },
      {
        number: 2,
        title: 'The Ascension',
        scripture: 'Acts 1:6-11',
        meditation: 'Jesus ascends into Heaven.',
      },
      {
        number: 3,
        title: 'The Descent of the Holy Spirit',
        scripture: 'Acts 2:1-4',
        meditation: 'The Holy Spirit descends upon the Apostles at Pentecost.',
      },
      {
        number: 4,
        title: 'The Assumption',
        scripture: 'Revelation 12:1',
        meditation: 'Mary is assumed body and soul into Heaven.',
      },
      {
        number: 5,
        title: 'The Coronation of Mary',
        scripture: 'Revelation 12:1',
        meditation: 'Mary is crowned Queen of Heaven and Earth.',
      },
    ],
  },
};

/**
 * Get today's mystery based on day of week
 */
export function getTodaysMystery(): MysterySet {
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  for (const [key, mysterySet] of Object.entries(ROSARY_MYSTERIES)) {
    if (mysterySet.days.includes(dayOfWeek)) {
      return mysterySet;
    }
  }

  // Fallback to joyful
  return ROSARY_MYSTERIES.joyful;
}

/**
 * Get mystery by type
 */
export function getMysteryByType(type: MysteryType): MysterySet {
  return ROSARY_MYSTERIES[type];
}
