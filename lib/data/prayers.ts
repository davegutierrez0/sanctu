/**
 * Common Catholic Prayers - Bilingual (English/Spanish)
 */

import type { Language } from '@/components/ThemeProvider';

export interface Prayer {
  id: string;
  title: { en: string; es: string };
  latin?: string | null;
  text: { en: string; es: string };
  category?: 'essential' | 'marian' | 'devotional';
}

export const COMMON_PRAYERS: Prayer[] = [
  {
    id: 'our-father',
    title: { en: 'Our Father', es: 'Padre Nuestro' },
    latin: 'Pater Noster',
    category: 'essential',
    text: {
      en: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
      es: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
    },
  },
  {
    id: 'hail-mary',
    title: { en: 'Hail Mary', es: 'Ave María' },
    latin: 'Ave Maria',
    category: 'essential',
    text: {
      en: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
      es: "Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
    },
  },
  {
    id: 'glory-be',
    title: { en: 'Glory Be', es: 'Gloria al Padre' },
    latin: 'Gloria Patri',
    category: 'essential',
    text: {
      en: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
      es: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
    },
  },
  {
    id: 'creed',
    title: { en: "Apostles' Creed", es: 'Credo de los Apóstoles' },
    latin: 'Symbolum Apostolorum',
    category: 'essential',
    text: {
      en: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
      es: "Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
    },
  },
  {
    id: 'hail-holy-queen',
    title: { en: 'Hail, Holy Queen', es: 'Salve Regina' },
    latin: 'Salve Regina',
    category: 'marian',
    text: {
      en: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God. That we may be made worthy of the promises of Christ.",
      es: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra. Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo.",
    },
  },
  {
    id: 'fatima',
    title: { en: 'Fatima Prayer', es: 'Oración de Fátima' },
    latin: 'Oratio Fatimae',
    category: 'devotional',
    text: {
      en: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy.",
      es: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
    },
  },
  {
    id: 'memorare',
    title: { en: 'The Memorare', es: 'La Acordaos' },
    latin: null,
    category: 'marian',
    text: {
      en: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy, hear and answer me. Amen.",
      es: "Acordaos, oh piadosísima Virgen María, que jamás se ha oído decir que ninguno de los que han acudido a tu protección, implorando tu auxilio, haya sido desamparado. Animado por esta confianza, a ti también acudo, oh Madre, Virgen de las vírgenes, y gimiendo bajo el peso de mis pecados me atrevo a comparecer ante ti. Oh Madre de Dios, no deseches mis súplicas, antes bien, escúchalas y acógelas benignamente. Amén.",
    },
  },
  {
    id: 'angelus',
    title: { en: 'The Angelus', es: 'El Ángelus' },
    latin: 'Angelus Domini',
    category: 'devotional',
    text: {
      en: "V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\n\nHail Mary...\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to thy word.\n\nHail Mary...\n\nV. And the Word was made Flesh.\nR. And dwelt among us.\n\nHail Mary...\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection, through the same Christ Our Lord. Amen.",
      es: "V. El Ángel del Señor anunció a María.\nR. Y concibió por obra del Espíritu Santo.\n\nDios te salve, María...\n\nV. He aquí la esclava del Señor.\nR. Hágase en mí según tu palabra.\n\nDios te salve, María...\n\nV. Y el Verbo se hizo carne.\nR. Y habitó entre nosotros.\n\nDios te salve, María...\n\nV. Ruega por nosotros, Santa Madre de Dios.\nR. Para que seamos dignos de alcanzar las promesas de Cristo.\n\nOremos: Infunde, Señor, tu gracia en nuestras almas, para que, los que hemos conocido, por el anuncio del Ángel, la Encarnación de tu Hijo Jesucristo, lleguemos por los Méritos de su Pasión y su Cruz, a la gloria de la Resurrección. Por Jesucristo Nuestro Señor. Amén.",
    },
  },
  {
    id: 'morning-offering',
    title: { en: 'Morning Offering', es: 'Ofrenda de la Mañana' },
    latin: null,
    category: 'devotional',
    text: {
      en: "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.",
      es: "Oh Jesús, por medio del Corazón Inmaculado de María, te ofrezco mis oraciones, obras, alegrías y sufrimientos de este día por todas las intenciones de tu Sagrado Corazón, en unión con el Santo Sacrificio de la Misa en todo el mundo, por la salvación de las almas, la reparación de los pecados, la reunión de todos los cristianos, y en particular por las intenciones del Santo Padre este mes. Amén.",
    },
  },
  {
    id: 'angel-of-god',
    title: { en: 'Angel of God', es: 'Ángel de Dios' },
    latin: 'Angele Dei',
    category: 'devotional',
    text: {
      en: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.",
      es: "Ángel de Dios, que eres mi custodio, pues la bondad divina me ha encomendado a ti, ilumíname, guárdame, defiéndeme y gobiérname. Amén.",
    },
  },
  {
    id: 'eternal-rest',
    title: { en: 'Eternal Rest', es: 'Descanso Eterno' },
    latin: 'Requiem Aeternam',
    category: 'devotional',
    text: {
      en: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.",
      es: "Dales, Señor, el descanso eterno, y brille para ellos la luz perpetua. Descansen en paz. Amén.",
    },
  },
  {
    id: 'grace-before-meals',
    title: { en: 'Grace Before Meals', es: 'Bendición de los Alimentos' },
    latin: null,
    category: 'devotional',
    text: {
      en: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.",
      es: "Bendícenos, Señor, y bendice estos alimentos que por tu bondad vamos a recibir. Por Jesucristo nuestro Señor. Amén.",
    },
  },
  {
    id: 'grace-after-meals',
    title: { en: 'Grace After Meals', es: 'Acción de Gracias' },
    latin: null,
    category: 'devotional',
    text: {
      en: "We give Thee thanks, Almighty God, for all Thy benefits, who lives and reigns forever and ever. Amen.",
      es: "Te damos gracias, Señor, Dios todopoderoso, por todos tus beneficios. Tú que vives y reinas por los siglos de los siglos. Amén.",
    },
  },
  {
    id: 'act-of-contrition',
    title: { en: 'Act of Contrition', es: 'Acto de Contrición' },
    latin: null,
    category: 'essential',
    text: {
      en: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all-good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.",
      es: "Señor mío Jesucristo, Dios y Hombre verdadero, me pesa de todo corazón haberte ofendido. Propongo firmemente, con tu gracia, enmendarme y alejarme de las ocasiones de pecado, confesarme y cumplir la penitencia. Confío me perdonarás por tu infinita misericordia. Amén.",
    },
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

/**
 * Get localized prayer text
 */
export function getLocalizedPrayer(prayer: Prayer, lang: Language) {
  return {
    ...prayer,
    title: prayer.title[lang],
    text: prayer.text[lang],
  };
}

/**
 * Get all prayers localized
 */
export function getLocalizedPrayers(lang: Language) {
  return COMMON_PRAYERS.map((p) => getLocalizedPrayer(p, lang));
}

// UI Labels for prayers page
export const PRAYER_UI = {
  en: {
    title: 'Catholic Prayers',
    subtitle: 'Traditional prayers of the Church',
    categories: {
      essential: 'Essential Prayers',
      marian: 'Marian Devotions',
      devotional: 'Daily Devotions',
    },
    backToHome: 'Back to Home',
    backToPrayers: 'Back to Prayers',
    print: 'Print',
  },
  es: {
    title: 'Oraciones Católicas',
    subtitle: 'Oraciones tradicionales de la Iglesia',
    categories: {
      essential: 'Oraciones Esenciales',
      marian: 'Devociones Marianas',
      devotional: 'Devociones Diarias',
    },
    backToHome: 'Volver al Inicio',
    backToPrayers: 'Volver a Oraciones',
    print: 'Imprimir',
  },
};
