/**
 * Common Catholic Prayers - Bilingual (English/Spanish)
 */

import type { Language } from '@/components/ThemeProvider';

export interface Prayer {
  id: string;
  title: { en: string; es: string };
  latin?: string | null;
  text: { en: string; es: string };
  category?: 'essential' | 'marian' | 'devotional' | 'mass';
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
  {
    id: 'sign-of-the-cross',
    title: { en: 'Sign of the Cross', es: 'Señal de la Cruz' },
    latin: 'Signum Crucis',
    category: 'essential',
    text: {
      en: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      es: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
    },
  },
  {
    id: 'saint-michael',
    title: { en: 'Prayer to Saint Michael', es: 'Oración a San Miguel' },
    latin: 'Sancte Michael Archangele',
    category: 'devotional',
    text: {
      en: 'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.',
      es: 'San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra la perversidad y asechanzas del demonio. Reprímale Dios, pedimos suplicantes; y tú, Príncipe de la milicia celestial, arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.',
    },
  },
  {
    id: 'anima-christi',
    title: { en: 'Anima Christi', es: 'Alma de Cristo' },
    latin: 'Anima Christi',
    category: 'mass',
    text: {
      en: 'Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within Thy wounds hide me. Permit me not to be separated from Thee. From the wicked foe defend me. At the hour of my death call me, and bid me come to Thee, that with Thy saints I may praise Thee forever and ever. Amen.',
      es: 'Alma de Cristo, santifícame. Cuerpo de Cristo, sálvame. Sangre de Cristo, embriágame. Agua del costado de Cristo, lávame. Pasión de Cristo, confórtame. ¡Oh buen Jesús!, óyeme. Dentro de tus llagas, escóndeme. No permitas que me aparte de Ti. Del maligno enemigo, defiéndeme. En la hora de mi muerte, llámame y mándame ir a Ti, para que con tus santos te alabe por los siglos de los siglos. Amén.',
    },
  },
  {
    id: 'spiritual-communion',
    title: { en: 'Act of Spiritual Communion', es: 'Comunión Espiritual' },
    latin: null,
    category: 'mass',
    text: {
      en: 'My Jesus, I believe that You are present in the Most Holy Sacrament. I love You above all things, and I desire to receive You into my soul. Since I cannot at this moment receive You sacramentally, come at least spiritually into my heart. I embrace You as if You were already there and unite myself wholly to You. Never permit me to be separated from You. Amen.',
      es: 'Creo, Jesús mío, que estás real y verdaderamente presente en el Santísimo Sacramento del altar. Te amo sobre todas las cosas y deseo recibirte en mi alma. Pero como ahora no puedo recibirte sacramentado, ven al menos espiritualmente a mi corazón. Y como si ya te hubiese recibido, te abrazo y me uno del todo a Ti. Señor, no permitas que jamás me aparte de Ti. Amén.',
    },
  },
  {
    id: 'suscipe',
    title: { en: 'Suscipe', es: 'Tomad, Señor, y Recibid' },
    latin: 'Suscipe',
    category: 'devotional',
    text: {
      en: 'Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will—all I have and call my own. You have given it all to me. To You, Lord, I return it. Everything is Yours; do with it what You will. Give me only Your love and Your grace. That is enough for me.',
      es: 'Tomad, Señor, y recibid toda mi libertad, mi memoria, mi entendimiento y toda mi voluntad; todo mi haber y mi poseer. Vos me lo disteis; a Vos, Señor, lo torno. Todo es vuestro: disponed de ello según vuestra voluntad. Dadme vuestro amor y gracia, que ésta me basta.',
    },
  },
  {
    id: 'daily-examen',
    title: { en: 'Daily Examen', es: 'Examen Diario' },
    latin: null,
    category: 'devotional',
    text: {
      en: 'Become aware of God’s presence.\n\nReview the day with gratitude. Notice the gifts, people, and moments for which you are thankful.\n\nPay attention to your emotions. Ask where you accepted grace and where you resisted it.\n\nChoose one moment of the day and pray from it. Ask forgiveness where needed and receive God’s mercy.\n\nLook toward tomorrow. Ask for the grace you most need, and entrust the coming day to God.',
      es: 'Hazte consciente de la presencia de Dios.\n\nRepasa el día con gratitud. Reconoce los dones, las personas y los momentos por los que das gracias.\n\nPresta atención a tus emociones. Pregunta dónde acogiste la gracia y dónde te resististe a ella.\n\nElige un momento del día y reza desde él. Pide perdón donde sea necesario y recibe la misericordia de Dios.\n\nMira hacia mañana. Pide la gracia que más necesitas y confía el día que viene a Dios.',
    },
  },
  {
    id: 'before-mass',
    title: { en: 'Prayer Before Mass', es: 'Oración Antes de la Misa' },
    latin: null,
    category: 'mass',
    text: {
      en: 'Almighty and ever-living God, I approach the sacrament of Your only-begotten Son, our Lord Jesus Christ. I come sick to the physician of life, unclean to the fountain of mercy, blind to the radiance of eternal light, and poor and needy to the Lord of heaven and earth. Lord, in Your great generosity, heal my sickness, wash away my defilement, enlighten my blindness, enrich my poverty, and clothe my nakedness. May I receive the Bread of Angels with reverence and humility, contrition and devotion, purity and faith, and with the purpose and intention that is for the good of my soul. Amen.',
      es: 'Dios todopoderoso y eterno, me acerco al sacramento de tu Hijo unigénito, nuestro Señor Jesucristo. Acudo enfermo al médico de la vida, impuro a la fuente de misericordia, ciego a la luz eterna, pobre y necesitado al Señor del cielo y de la tierra. Señor, por tu infinita bondad, sana mi enfermedad, lava mis manchas, ilumina mi ceguera, enriquece mi pobreza y viste mi desnudez. Que reciba el Pan de los Ángeles con reverencia y humildad, con contrición y devoción, con pureza y fe, y con el propósito e intención que convienen al bien de mi alma. Amén.',
    },
  },
  {
    id: 'after-communion',
    title: { en: 'Prayer After Communion', es: 'Oración Después de la Comunión' },
    latin: null,
    category: 'mass',
    text: {
      en: 'I give You thanks, Lord, holy Father, almighty and eternal God, for having fed me, a sinner and Your unworthy servant, with the precious Body and Blood of Your Son, our Lord Jesus Christ. Let this Holy Communion not bring me condemnation, but forgiveness and salvation. May it be a helmet of faith and a shield of good will, a cleansing from vice, a strengthening of charity and patience, humility and obedience, and every virtue. May it quiet all my evil impulses, increase my love for You and my neighbor, and bring me safely to Your heavenly banquet. Amen.',
      es: 'Te doy gracias, Señor, Padre santo, Dios todopoderoso y eterno, porque a mí, pecador e indigno siervo tuyo, me has alimentado con el precioso Cuerpo y Sangre de tu Hijo, nuestro Señor Jesucristo. Que esta sagrada Comunión no sea para mí motivo de condenación, sino perdón y salvación. Sea armadura de fe y escudo de buena voluntad, purificación de los vicios, aumento de caridad y paciencia, de humildad y obediencia, y de toda virtud. Aumente mi amor a Ti y al prójimo, y me conduzca seguro al banquete del cielo. Amén.',
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
      mass: 'Before & After Mass',
    },
    searchPlaceholder: 'Search prayers',
    all: 'All',
    favorites: 'Favorites',
    noResults: 'No prayers match your search.',
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
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
      mass: 'Antes y Después de la Misa',
    },
    searchPlaceholder: 'Buscar oraciones',
    all: 'Todas',
    favorites: 'Favoritas',
    noResults: 'Ninguna oración coincide con tu búsqueda.',
    favorite: 'Añadir a favoritas',
    unfavorite: 'Quitar de favoritas',
    backToHome: 'Volver al Inicio',
    backToPrayers: 'Volver a Oraciones',
    print: 'Imprimir',
  },
};
