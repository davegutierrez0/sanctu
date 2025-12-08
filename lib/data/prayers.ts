/**
 * Common Catholic Prayers
 * Ported from original test.tsx
 */

export interface Prayer {
  id: string;
  title: string;
  latin?: string | null;
  text: string;
  category?: 'essential' | 'marian' | 'devotional';
}

export const COMMON_PRAYERS: Prayer[] = [
  {
    id: 'our-father',
    title: 'Our Father',
    latin: 'Pater Noster',
    category: 'essential',
    text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latin: 'Ave Maria',
    category: 'essential',
    text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latin: 'Gloria Patri',
    category: 'essential',
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
  },
  {
    id: 'creed',
    title: "Apostles' Creed",
    latin: 'Symbolum Apostolorum',
    category: 'essential',
    text: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
  },
  {
    id: 'hail-holy-queen',
    title: 'Hail, Holy Queen',
    latin: 'Salve Regina',
    category: 'marian',
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God. That we may be made worthy of the promises of Christ.",
  },
  {
    id: 'fatima',
    title: 'Fatima Prayer',
    latin: 'Oratio Fatimae',
    category: 'devotional',
    text: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy.",
  },
  {
    id: 'memorare',
    title: 'The Memorare',
    latin: null,
    category: 'marian',
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy, hear and answer me. Amen.",
  },
  {
    id: 'angelus',
    title: 'The Angelus',
    latin: 'Angelus Domini',
    category: 'devotional',
    text: "V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\n\nHail Mary...\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to thy word.\n\nHail Mary...\n\nV. And the Word was made Flesh.\nR. And dwelt among us.\n\nHail Mary...\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection, through the same Christ Our Lord. Amen.",
  },
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    latin: null,
    category: 'devotional',
    text: "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.",
  },
  {
    id: 'angel-of-god',
    title: 'Angel of God',
    latin: 'Angele Dei',
    category: 'devotional',
    text: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.",
  },
  {
    id: 'eternal-rest',
    title: 'Eternal Rest',
    latin: 'Requiem Aeternam',
    category: 'devotional',
    text: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.",
  },
  {
    id: 'grace-before-meals',
    title: 'Grace Before Meals',
    latin: null,
    category: 'devotional',
    text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.",
  },
  {
    id: 'grace-after-meals',
    title: 'Grace After Meals',
    latin: null,
    category: 'devotional',
    text: "We give Thee thanks, Almighty God, for all Thy benefits, who lives and reigns forever and ever. Amen.",
  },
];

/**
 * Get prayer by ID
 */
export function getPrayerById(id: string): Prayer | undefined {
  return COMMON_PRAYERS.find((p) => p.id === id);
}

/**
 * Get prayers by category
 */
export function getPrayersByCategory(category: Prayer['category']): Prayer[] {
  return COMMON_PRAYERS.filter((p) => p.category === category);
}
