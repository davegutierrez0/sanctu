/**
 * Complete Rosary passages generated from public-domain eBible.org VPL files.
 *
 * English: World English Bible, Catholic Edition (2020 stable text edition)
 * Source: https://ebible.org/Scriptures/eng-web-c_vpl.zip
 * VPL SHA-256: e94033a46e951a0369f4fa90ce5908117843e305d7c31f64322ad147e008d6cd
 * Spanish: Santa Biblia libre para el mundo (public-domain draft dated 2026-05-22)
 * Source: https://ebible.org/Scriptures/spablm_vpl.zip
 * VPL SHA-256: 0d3691a1807192b1507cc9fe892808eb2985899973d00d83753471a9939f3a9d
 *
 * Preserve the source wording exactly. Re-run scripts/generate-rosary-scripture.mjs
 * with the official source files instead of editing verse text by hand.
 */

export type RosaryMysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';
export type ScriptureLanguage = 'en' | 'es';
export type RosaryScriptureKey = `${RosaryMysteryType}-${1 | 2 | 3 | 4 | 5}`;

export interface ScriptureVerse {
  number: string;
  text: string;
}

export interface ScriptureSource {
  name: string;
  abbreviation: string;
  url: string;
  publicDomain: true;
  note: string;
}

export interface RosaryScripturePassage {
  verses: readonly ScriptureVerse[];
  source: ScriptureSource;
}

export const ROSARY_SCRIPTURE_SOURCES: Record<ScriptureLanguage, ScriptureSource> = {
  en: {
    name: 'World English Bible, Catholic Edition',
    abbreviation: 'WEBC',
    url: 'https://ebible.org/eng-web-c/copyright.htm',
    publicDomain: true,
    note: 'A modern public-domain Catholic edition for prayer and study; it is not the U.S. Mass lectionary.',
  },
  es: {
    name: 'Santa Biblia libre para el mundo',
    abbreviation: 'SBLM',
    url: 'https://ebible.org/bible/details.php?id=spablm',
    publicDomain: true,
    note: 'Traducción moderna de dominio público, actualmente en revisión; no es el leccionario católico oficial.',
  },
};

export const ROSARY_SCRIPTURE_PASSAGES = {
  "en": {
    "joyful-1": [
      {
        "number": "26",
        "text": "Now in the sixth month, the angel Gabriel was sent from God to a city of Galilee named Nazareth,"
      },
      {
        "number": "27",
        "text": "to a virgin pledged to be married to a man whose name was Joseph, of David’s house. The virgin’s name was Mary."
      },
      {
        "number": "28",
        "text": "Having come in, the angel said to her, “Rejoice, you highly favored one! The Lord is with you. Blessed are you among women!”"
      },
      {
        "number": "29",
        "text": "But when she saw him, she was greatly troubled at the saying, and considered what kind of salutation this might be."
      },
      {
        "number": "30",
        "text": "The angel said to her, “Don’t be afraid, Mary, for you have found favor with God."
      },
      {
        "number": "31",
        "text": "Behold, you will conceive in your womb and give birth to a son, and shall name him ‘Jesus.’"
      },
      {
        "number": "32",
        "text": "He will be great and will be called the Son of the Most High. The Lord God will give him the throne of his father David,"
      },
      {
        "number": "33",
        "text": "and he will reign over the house of Jacob forever. There will be no end to his Kingdom.”"
      },
      {
        "number": "34",
        "text": "Mary said to the angel, “How can this be, seeing I am a virgin?”"
      },
      {
        "number": "35",
        "text": "The angel answered her, “The Holy Spirit will come on you, and the power of the Most High will overshadow you. Therefore also the holy one who is born from you will be called the Son of God."
      },
      {
        "number": "36",
        "text": "Behold, Elizabeth your relative also has conceived a son in her old age; and this is the sixth month with her who was called barren."
      },
      {
        "number": "37",
        "text": "For nothing spoken by God is impossible.”"
      },
      {
        "number": "38",
        "text": "Mary said, “Behold, the servant of the Lord; let it be done to me according to your word.” Then the angel departed from her."
      }
    ],
    "joyful-2": [
      {
        "number": "39",
        "text": "Mary arose in those days and went into the hill country with haste, into a city of Judah,"
      },
      {
        "number": "40",
        "text": "and entered into the house of Zacharias and greeted Elizabeth."
      },
      {
        "number": "41",
        "text": "When Elizabeth heard Mary’s greeting, the baby leaped in her womb; and Elizabeth was filled with the Holy Spirit."
      },
      {
        "number": "42",
        "text": "She called out with a loud voice and said, “Blessed are you among women, and blessed is the fruit of your womb!"
      },
      {
        "number": "43",
        "text": "Why am I so favored, that the mother of my Lord should come to me?"
      },
      {
        "number": "44",
        "text": "For behold, when the voice of your greeting came into my ears, the baby leaped in my womb for joy!"
      },
      {
        "number": "45",
        "text": "Blessed is she who believed, for there will be a fulfillment of the things which have been spoken to her from the Lord!”"
      },
      {
        "number": "46",
        "text": "Mary said, “My soul magnifies the Lord."
      },
      {
        "number": "47",
        "text": "My spirit has rejoiced in God my Savior,"
      },
      {
        "number": "48",
        "text": "for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed."
      },
      {
        "number": "49",
        "text": "For he who is mighty has done great things for me. Holy is his name."
      },
      {
        "number": "50",
        "text": "His mercy is for generations and generations on those who fear him."
      },
      {
        "number": "51",
        "text": "He has shown strength with his arm. He has scattered the proud in the imagination of their hearts."
      },
      {
        "number": "52",
        "text": "He has put down princes from their thrones, and has exalted the lowly."
      },
      {
        "number": "53",
        "text": "He has filled the hungry with good things. He has sent the rich away empty."
      },
      {
        "number": "54",
        "text": "He has given help to Israel, his servant, that he might remember mercy,"
      },
      {
        "number": "55",
        "text": "as he spoke to our fathers, to Abraham and his offspring forever.”"
      },
      {
        "number": "56",
        "text": "Mary stayed with her about three months, and then returned to her house."
      }
    ],
    "joyful-3": [
      {
        "number": "1",
        "text": "Now in those days, a decree went out from Caesar Augustus that all the world should be enrolled."
      },
      {
        "number": "2",
        "text": "This was the first enrollment made when Quirinius was governor of Syria."
      },
      {
        "number": "3",
        "text": "All went to enroll themselves, everyone to his own city."
      },
      {
        "number": "4",
        "text": "Joseph also went up from Galilee, out of the city of Nazareth, into Judea, to David’s city, which is called Bethlehem, because he was of the house and family of David,"
      },
      {
        "number": "5",
        "text": "to enroll himself with Mary, who was pledged to be married to him as wife, being pregnant."
      },
      {
        "number": "6",
        "text": "While they were there, the day had come for her to give birth."
      },
      {
        "number": "7",
        "text": "She gave birth to her firstborn son. She wrapped him in bands of cloth and laid him in a feeding trough, because there was no room for them in the inn."
      },
      {
        "number": "8",
        "text": "There were shepherds in the same country staying in the field, and keeping watch by night over their flock."
      },
      {
        "number": "9",
        "text": "Behold, an angel of the Lord stood by them, and the glory of the Lord shone around them, and they were terrified."
      },
      {
        "number": "10",
        "text": "The angel said to them, “Don’t be afraid, for behold, I bring you good news of great joy which will be to all the people."
      },
      {
        "number": "11",
        "text": "For there is born to you today, in David’s city, a Savior, who is Christ the Lord."
      },
      {
        "number": "12",
        "text": "This is the sign to you: you will find a baby wrapped in strips of cloth, lying in a feeding trough.”"
      },
      {
        "number": "13",
        "text": "Suddenly, there was with the angel a multitude of the heavenly army praising God and saying,"
      },
      {
        "number": "14",
        "text": "“Glory to God in the highest, on earth peace, good will toward men.”"
      },
      {
        "number": "15",
        "text": "When the angels went away from them into the sky, the shepherds said to one another, “Let’s go to Bethlehem, now, and see this thing that has happened, which the Lord has made known to us.”"
      },
      {
        "number": "16",
        "text": "They came with haste and found both Mary and Joseph, and the baby was lying in the feeding trough."
      },
      {
        "number": "17",
        "text": "When they saw it, they publicized widely the saying which was spoken to them about this child."
      },
      {
        "number": "18",
        "text": "All who heard it wondered at the things which were spoken to them by the shepherds."
      },
      {
        "number": "19",
        "text": "But Mary kept all these sayings, pondering them in her heart."
      },
      {
        "number": "20",
        "text": "The shepherds returned, glorifying and praising God for all the things that they had heard and seen, just as it was told them."
      }
    ],
    "joyful-4": [
      {
        "number": "22",
        "text": "When the days of their purification according to the law of Moses were fulfilled, they brought him up to Jerusalem to present him to the Lord"
      },
      {
        "number": "23",
        "text": "(as it is written in the law of the Lord, “Every male who opens the womb shall be called holy to the Lord”),"
      },
      {
        "number": "24",
        "text": "and to offer a sacrifice according to that which is said in the law of the Lord, “A pair of turtledoves, or two young pigeons.”"
      },
      {
        "number": "25",
        "text": "Behold, there was a man in Jerusalem whose name was Simeon. This man was righteous and devout, looking for the consolation of Israel, and the Holy Spirit was on him."
      },
      {
        "number": "26",
        "text": "It had been revealed to him by the Holy Spirit that he should not see death before he had seen the Lord’s Christ."
      },
      {
        "number": "27",
        "text": "He came in the Spirit into the temple. When the parents brought in the child, Jesus, that they might do concerning him according to the custom of the law,"
      },
      {
        "number": "28",
        "text": "then he received him into his arms and blessed God, and said,"
      },
      {
        "number": "29",
        "text": "“Now you are releasing your servant, Master, according to your word, in peace;"
      },
      {
        "number": "30",
        "text": "for my eyes have seen your salvation,"
      },
      {
        "number": "31",
        "text": "which you have prepared before the face of all peoples;"
      },
      {
        "number": "32",
        "text": "a light for revelation to the nations, and the glory of your people Israel.”"
      },
      {
        "number": "33",
        "text": "Joseph and his mother were marveling at the things which were spoken concerning him."
      },
      {
        "number": "34",
        "text": "Simeon blessed them, and said to Mary, his mother, “Behold, this child is appointed for the falling and the rising of many in Israel, and for a sign which is spoken against."
      },
      {
        "number": "35",
        "text": "Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.”"
      },
      {
        "number": "36",
        "text": "There was one Anna, a prophetess, the daughter of Phanuel, of the tribe of Asher (she was of a great age, having lived with a husband seven years from her virginity,"
      },
      {
        "number": "37",
        "text": "and she had been a widow for about eighty-four years), who didn’t depart from the temple, worshiping with fastings and petitions night and day."
      },
      {
        "number": "38",
        "text": "Coming up at that very hour, she gave thanks to the Lord, and spoke of him to all those who were looking for redemption in Jerusalem."
      }
    ],
    "joyful-5": [
      {
        "number": "41",
        "text": "His parents went every year to Jerusalem at the feast of the Passover."
      },
      {
        "number": "42",
        "text": "When he was twelve years old, they went up to Jerusalem according to the custom of the feast;"
      },
      {
        "number": "43",
        "text": "and when they had fulfilled the days, as they were returning, the boy Jesus stayed behind in Jerusalem. Joseph and his mother didn’t know it,"
      },
      {
        "number": "44",
        "text": "but supposing him to be in the company, they went a day’s journey; and they looked for him among their relatives and acquaintances."
      },
      {
        "number": "45",
        "text": "When they didn’t find him, they returned to Jerusalem, looking for him."
      },
      {
        "number": "46",
        "text": "After three days they found him in the temple, sitting in the middle of the teachers, both listening to them and asking them questions."
      },
      {
        "number": "47",
        "text": "All who heard him were amazed at his understanding and his answers."
      },
      {
        "number": "48",
        "text": "When they saw him, they were astonished; and his mother said to him, “Son, why have you treated us this way? Behold, your father and I were anxiously looking for you.”"
      },
      {
        "number": "49",
        "text": "He said to them, “Why were you looking for me? Didn’t you know that I must be in my Father’s house?”"
      },
      {
        "number": "50",
        "text": "They didn’t understand the saying which he spoke to them."
      },
      {
        "number": "51",
        "text": "And he went down with them and came to Nazareth. He was subject to them, and his mother kept all these sayings in her heart."
      },
      {
        "number": "52",
        "text": "And Jesus increased in wisdom and stature, and in favor with God and men."
      }
    ],
    "luminous-1": [
      {
        "number": "13",
        "text": "Then Jesus came from Galilee to the Jordan to John, to be baptized by him."
      },
      {
        "number": "14",
        "text": "But John would have hindered him, saying, “I need to be baptized by you, and you come to me?”"
      },
      {
        "number": "15",
        "text": "But Jesus, answering, said to him, “Allow it now, for this is the fitting way for us to fulfill all righteousness.” Then he allowed him."
      },
      {
        "number": "16",
        "text": "Jesus, when he was baptized, went up directly from the water: and behold, the heavens were opened to him. He saw the Spirit of God descending as a dove, and coming on him."
      },
      {
        "number": "17",
        "text": "Behold, a voice out of the heavens said, “This is my beloved Son, with whom I am well pleased.”"
      }
    ],
    "luminous-2": [
      {
        "number": "1",
        "text": "The third day, there was a wedding in Cana of Galilee. Jesus’ mother was there."
      },
      {
        "number": "2",
        "text": "Jesus also was invited, with his disciples, to the wedding."
      },
      {
        "number": "3",
        "text": "When the wine ran out, Jesus’ mother said to him, “They have no wine.”"
      },
      {
        "number": "4",
        "text": "Jesus said to her, “Woman, what does that have to do with you and me? My hour has not yet come.”"
      },
      {
        "number": "5",
        "text": "His mother said to the servants, “Whatever he says to you, do it.”"
      },
      {
        "number": "6",
        "text": "Now there were six water pots of stone set there after the Jews’ way of purifying, containing two or three metretes apiece."
      },
      {
        "number": "7",
        "text": "Jesus said to them, “Fill the water pots with water.” So they filled them up to the brim."
      },
      {
        "number": "8",
        "text": "He said to them, “Now draw some out, and take it to the ruler of the feast.” So they took it."
      },
      {
        "number": "9",
        "text": "When the ruler of the feast tasted the water now become wine, and didn’t know where it came from (but the servants who had drawn the water knew), the ruler of the feast called the bridegroom"
      },
      {
        "number": "10",
        "text": "and said to him, “Everyone serves the good wine first, and when the guests have drunk freely, then that which is worse. You have kept the good wine until now!”"
      },
      {
        "number": "11",
        "text": "This beginning of his signs Jesus did in Cana of Galilee, and revealed his glory; and his disciples believed in him."
      }
    ],
    "luminous-3": [
      {
        "number": "14",
        "text": "Now after John was taken into custody, Jesus came into Galilee, preaching the Good News of God’s Kingdom,"
      },
      {
        "number": "15",
        "text": "and saying, “The time is fulfilled, and God’s Kingdom is at hand! Repent, and believe in the Good News.”"
      }
    ],
    "luminous-4": [
      {
        "number": "1",
        "text": "After six days, Jesus took with him Peter, James, and John his brother, and brought them up into a high mountain by themselves."
      },
      {
        "number": "2",
        "text": "He was changed before them. His face shone like the sun, and his garments became as white as the light."
      },
      {
        "number": "3",
        "text": "Behold, Moses and Elijah appeared to them talking with him."
      },
      {
        "number": "4",
        "text": "Peter answered and said to Jesus, “Lord, it is good for us to be here. If you want, let’s make three tents here: one for you, one for Moses, and one for Elijah.”"
      },
      {
        "number": "5",
        "text": "While he was still speaking, behold, a bright cloud overshadowed them. Behold, a voice came out of the cloud, saying, “This is my beloved Son, in whom I am well pleased. Listen to him.”"
      },
      {
        "number": "6",
        "text": "When the disciples heard it, they fell on their faces, and were very afraid."
      },
      {
        "number": "7",
        "text": "Jesus came and touched them and said, “Get up, and don’t be afraid.”"
      },
      {
        "number": "8",
        "text": "Lifting up their eyes, they saw no one, except Jesus alone."
      }
    ],
    "luminous-5": [
      {
        "number": "26",
        "text": "As they were eating, Jesus took bread, gave thanks for it, and broke it. He gave to the disciples and said, “Take, eat; this is my body.”"
      },
      {
        "number": "27",
        "text": "He took the cup, gave thanks, and gave to them, saying, “All of you drink it,"
      },
      {
        "number": "28",
        "text": "for this is my blood of the new covenant, which is poured out for many for the remission of sins."
      }
    ],
    "sorrowful-1": [
      {
        "number": "36",
        "text": "Then Jesus came with them to a place called Gethsemane, and said to his disciples, “Sit here, while I go there and pray.”"
      },
      {
        "number": "37",
        "text": "He took with him Peter and the two sons of Zebedee, and began to be sorrowful and severely troubled."
      },
      {
        "number": "38",
        "text": "Then Jesus said to them, “My soul is exceedingly sorrowful, even to death. Stay here and watch with me.”"
      },
      {
        "number": "39",
        "text": "He went forward a little, fell on his face, and prayed, saying, “My Father, if it is possible, let this cup pass away from me; nevertheless, not what I desire, but what you desire.”"
      },
      {
        "number": "40",
        "text": "He came to the disciples and found them sleeping, and said to Peter, “What, couldn’t you watch with me for one hour?"
      },
      {
        "number": "41",
        "text": "Watch and pray, that you don’t enter into temptation. The spirit indeed is willing, but the flesh is weak.”"
      },
      {
        "number": "42",
        "text": "Again, a second time he went away and prayed, saying, “My Father, if this cup can’t pass away from me unless I drink it, your desire be done.”"
      },
      {
        "number": "43",
        "text": "He came again and found them sleeping, for their eyes were heavy."
      },
      {
        "number": "44",
        "text": "He left them again, went away, and prayed a third time, saying the same words."
      },
      {
        "number": "45",
        "text": "Then he came to his disciples and said to them, “Are you still sleeping and resting? Behold, the hour is at hand, and the Son of Man is betrayed into the hands of sinners."
      },
      {
        "number": "46",
        "text": "Arise, let’s be going. Behold, he who betrays me is at hand.”"
      }
    ],
    "sorrowful-2": [
      {
        "number": "26",
        "text": "Then he released Barabbas to them, but Jesus he flogged and delivered to be crucified."
      }
    ],
    "sorrowful-3": [
      {
        "number": "27",
        "text": "Then the governor’s soldiers took Jesus into the Praetorium, and gathered the whole garrison together against him."
      },
      {
        "number": "28",
        "text": "They stripped him and put a scarlet robe on him."
      },
      {
        "number": "29",
        "text": "They braided a crown of thorns and put it on his head, and a reed in his right hand; and they kneeled down before him and mocked him, saying, “Hail, King of the Jews!”"
      },
      {
        "number": "30",
        "text": "They spat on him, and took the reed and struck him on the head."
      },
      {
        "number": "31",
        "text": "When they had mocked him, they took the robe off him, and put his clothes on him, and led him away to crucify him."
      }
    ],
    "sorrowful-4": [
      {
        "number": "16",
        "text": "So then he delivered him to them to be crucified. So they took Jesus and led him away."
      },
      {
        "number": "17",
        "text": "He went out, bearing his cross, to the place called “The Place of a Skull”, which is called in Hebrew, “Golgotha”,"
      }
    ],
    "sorrowful-5": [
      {
        "number": "33",
        "text": "When they came to the place that is called “The Skull”, they crucified him there with the criminals, one on the right and the other on the left."
      },
      {
        "number": "34",
        "text": "Jesus said, “Father, forgive them, for they don’t know what they are doing.” Dividing his garments among them, they cast lots."
      },
      {
        "number": "35",
        "text": "The people stood watching. The rulers with them also scoffed at him, saying, “He saved others. Let him save himself, if this is the Christ of God, his chosen one!”"
      },
      {
        "number": "36",
        "text": "The soldiers also mocked him, coming to him and offering him vinegar,"
      },
      {
        "number": "37",
        "text": "and saying, “If you are the King of the Jews, save yourself!”"
      },
      {
        "number": "38",
        "text": "An inscription was also written over him in letters of Greek, Latin, and Hebrew: “THIS IS THE KING OF THE JEWS.”"
      },
      {
        "number": "39",
        "text": "One of the criminals who was hanged insulted him, saying, “If you are the Christ, save yourself and us!”"
      },
      {
        "number": "40",
        "text": "But the other answered, and rebuking him said, “Don’t you even fear God, seeing you are under the same condemnation?"
      },
      {
        "number": "41",
        "text": "And we indeed justly, for we receive the due reward for our deeds, but this man has done nothing wrong.”"
      },
      {
        "number": "42",
        "text": "He said to Jesus, “Lord, remember me when you come into your Kingdom.”"
      },
      {
        "number": "43",
        "text": "Jesus said to him, “Assuredly I tell you, today you will be with me in Paradise.”"
      },
      {
        "number": "44",
        "text": "It was now about the sixth hour, and darkness came over the whole land until the ninth hour."
      },
      {
        "number": "45",
        "text": "The sun was darkened, and the veil of the temple was torn in two."
      },
      {
        "number": "46",
        "text": "Jesus, crying with a loud voice, said, “Father, into your hands I commit my spirit!” Having said this, he breathed his last."
      }
    ],
    "glorious-1": [
      {
        "number": "1",
        "text": "Now after the Sabbath, as it began to dawn on the first day of the week, Mary Magdalene and the other Mary came to see the tomb."
      },
      {
        "number": "2",
        "text": "Behold, there was a great earthquake, for an angel of the Lord descended from the sky and came and rolled away the stone from the door and sat on it."
      },
      {
        "number": "3",
        "text": "His appearance was like lightning, and his clothing white as snow."
      },
      {
        "number": "4",
        "text": "For fear of him, the guards shook, and became like dead men."
      },
      {
        "number": "5",
        "text": "The angel answered the women, “Don’t be afraid, for I know that you seek Jesus, who has been crucified."
      },
      {
        "number": "6",
        "text": "He is not here, for he has risen, just like he said. Come, see the place where the Lord was lying."
      },
      {
        "number": "7",
        "text": "Go quickly and tell his disciples, ‘He has risen from the dead, and behold, he goes before you into Galilee; there you will see him.’ Behold, I have told you.”"
      },
      {
        "number": "8",
        "text": "They departed quickly from the tomb with fear and great joy, and ran to bring his disciples word."
      },
      {
        "number": "9",
        "text": "As they went to tell his disciples, behold, Jesus met them, saying, “Rejoice!” They came and took hold of his feet, and worshiped him."
      },
      {
        "number": "10",
        "text": "Then Jesus said to them, “Don’t be afraid. Go tell my brothers that they should go into Galilee, and there they will see me.”"
      }
    ],
    "glorious-2": [
      {
        "number": "6",
        "text": "Therefore, when they had come together, they asked him, “Lord, are you now restoring the kingdom to Israel?”"
      },
      {
        "number": "7",
        "text": "He said to them, “It isn’t for you to know times or seasons which the Father has set within his own authority."
      },
      {
        "number": "8",
        "text": "But you will receive power when the Holy Spirit has come upon you. You will be witnesses to me in Jerusalem, in all Judea and Samaria, and to the uttermost parts of the earth.”"
      },
      {
        "number": "9",
        "text": "When he had said these things, as they were looking, he was taken up, and a cloud received him out of their sight."
      },
      {
        "number": "10",
        "text": "While they were looking steadfastly into the sky as he went, behold, two men stood by them in white clothing,"
      },
      {
        "number": "11",
        "text": "who also said, “You men of Galilee, why do you stand looking into the sky? This Jesus, who was received up from you into the sky, will come back in the same way as you saw him going into the sky.”"
      }
    ],
    "glorious-3": [
      {
        "number": "1",
        "text": "Now when the day of Pentecost had come, they were all with one accord in one place."
      },
      {
        "number": "2",
        "text": "Suddenly there came from the sky a sound like the rushing of a mighty wind, and it filled all the house where they were sitting."
      },
      {
        "number": "3",
        "text": "Tongues like fire appeared and were distributed to them, and one sat on each of them."
      },
      {
        "number": "4",
        "text": "They were all filled with the Holy Spirit and began to speak with other languages, as the Spirit gave them the ability to speak."
      }
    ],
    "glorious-4": [
      {
        "number": "1",
        "text": "A great sign was seen in heaven: a woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars."
      }
    ],
    "glorious-5": [
      {
        "number": "1",
        "text": "A great sign was seen in heaven: a woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars."
      }
    ]
  },
  "es": {
    "joyful-1": [
      {
        "number": "26",
        "text": "En el sexto mes, el ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret,"
      },
      {
        "number": "27",
        "text": "a una virgen comprometida a casarse con un hombre que se llamaba José, de la casa de David. La virgen se llamaba María."
      },
      {
        "number": "28",
        "text": "Al entrar, el ángel le dijo: «¡Alégrate, muy favorecida! El Señor está contigo. Bendita eres entre las mujeres»."
      },
      {
        "number": "29",
        "text": "Pero cuando lo vio, se preocupó mucho por el dicho, y pensó qué clase de saludo sería éste."
      },
      {
        "number": "30",
        "text": "El ángel le dijo: “No temas, María, porque has encontrado el favor de Dios."
      },
      {
        "number": "31",
        "text": "He aquí que concebirás en tu seno y darás a luz un hijo, al que pondrás por nombre «Jesús»."
      },
      {
        "number": "32",
        "text": "Será grande y se llamará Hijo del Altísimo. El Señor Dios le dará el trono de su padre David,"
      },
      {
        "number": "33",
        "text": "y reinará sobre la casa de Jacob para siempre. Su Reino no tendrá fin”."
      },
      {
        "number": "34",
        "text": "María dijo al ángel: «¿Cómo puede ser esto, siendo yo virgen?»."
      },
      {
        "number": "35",
        "text": "El ángel le respondió: «El Espíritu Santo vendrá sobre ti, y el poder del Altísimo te cubrirá con su sombra. Por eso también el santo que nazca de ti será llamado Hijo de Dios."
      },
      {
        "number": "36",
        "text": "He aquí que también Elisabet, tu pariente, ha concebido un hijo en su vejez; y éste es el sexto mes de la que se llamaba estéril."
      },
      {
        "number": "37",
        "text": "Porque nada de lo dicho por Dios es imposible.»"
      },
      {
        "number": "38",
        "text": "María dijo: «He aquí la sierva del Señor; hágase en mí según tu palabra». Entonces el ángel se alejó de ella."
      }
    ],
    "joyful-2": [
      {
        "number": "39",
        "text": "En aquellos días, María se levantó y se fue de prisa a la región montañosa, a una ciudad de Judá,"
      },
      {
        "number": "40",
        "text": "entró en casa de Zacarías y saludó a Isabel."
      },
      {
        "number": "41",
        "text": "Cuando Isabel oyó el saludo de María, el niño saltó en su seno; e Isabel quedó llena del Espíritu Santo."
      },
      {
        "number": "42",
        "text": "Gritó en voz alta y dijo: «Bendita eres entre las mujeres y bendito es el fruto de tu vientre."
      },
      {
        "number": "43",
        "text": "¿Por qué soy tan favorecida, para que la madre de mi Señor venga a mí?"
      },
      {
        "number": "44",
        "text": "Porque cuando la voz de tu saludo llegó a mis oídos, el niño saltó de alegría en mi vientre."
      },
      {
        "number": "45",
        "text": "¡Bienaventurada la que ha creído, porque se cumplirán las cosas que se le han dicho de parte del Señor!»"
      },
      {
        "number": "46",
        "text": "María dijo, «Mi alma engrandece al Señor."
      },
      {
        "number": "47",
        "text": "Mi espíritu se ha alegrado en Dios, mi Salvador,"
      },
      {
        "number": "48",
        "text": "pues ha mirado el humilde estado de su sierva. Porque he aquí que, a partir de ahora, todas las generaciones me llamarán dichosa."
      },
      {
        "number": "49",
        "text": "Porque el que es poderoso ha hecho grandes cosas por mí. Santo es su nombre."
      },
      {
        "number": "50",
        "text": "Su misericordia es por generaciones y generaciones sobre los que le temen."
      },
      {
        "number": "51",
        "text": "Ha demostrado poder con su brazo. Ha dispersado a los orgullosos en la imaginación de sus corazones."
      },
      {
        "number": "52",
        "text": "Ha derribado a los príncipes de sus tronos, y ha exaltado a los humildes."
      },
      {
        "number": "53",
        "text": "Ha colmado de bienes a los hambrientos. Ha enviado a los ricos con las manos vacías."
      },
      {
        "number": "54",
        "text": "Ha dado ayuda a Israel, su siervo, para que se acuerde de la misericordia,"
      },
      {
        "number": "55",
        "text": "como habló con nuestros padres, a Abraham y a su descendencia para siempre»."
      },
      {
        "number": "56",
        "text": "María se quedó con ella unos tres meses y luego volvió a su casa."
      }
    ],
    "joyful-3": [
      {
        "number": "1",
        "text": "En aquellos días, salió un decreto de César Augusto para que se inscribiera todo el mundo."
      },
      {
        "number": "2",
        "text": "Esta fue la primera inscripción que se hizo cuando Quirinius era gobernador de Siria."
      },
      {
        "number": "3",
        "text": "Todos fueron a inscribirse, cada uno a su ciudad."
      },
      {
        "number": "4",
        "text": "También José subió de Galilea, de la ciudad de Nazaret, a Judea, a la ciudad de David, que se llama Belén, porque era de la casa y de la familia de David,"
      },
      {
        "number": "5",
        "text": "para inscribirse con María, que estaba comprometida con él como esposa, estando embarazada."
      },
      {
        "number": "6",
        "text": "Mientras estaban allí, le llegó el día de dar a luz."
      },
      {
        "number": "7",
        "text": "Dio a luz a su hijo primogénito. Lo envolvió en pañales y lo puso en un pesebre, porque no había sitio para ellos en la posada."
      },
      {
        "number": "8",
        "text": "Había en la misma región unos pastores que permanecían en el campo y velaban de noche por su rebaño."
      },
      {
        "number": "9",
        "text": "He aquí que un ángel del Señor se puso junto a ellos, y la gloria del Señor los rodeó, y se asustaron."
      },
      {
        "number": "10",
        "text": "El ángel les dijo: “No temáis, porque he aquí que os traigo una buena noticia de gran alegría que será para todo el pueblo."
      },
      {
        "number": "11",
        "text": "Porque os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor."
      },
      {
        "number": "12",
        "text": "Esta es la señal para vosotros: encontraréis un niño envuelto en pañales, acostado en un pesebre”."
      },
      {
        "number": "13",
        "text": "De repente, apareció con el ángel una multitud del ejército celestial que alababa a Dios y decía"
      },
      {
        "number": "14",
        "text": "«Gloria a Dios en las alturas, en la tierra la paz, la buena voluntad hacia los hombres»."
      },
      {
        "number": "15",
        "text": "Cuando los ángeles se alejaron de ellos hacia el cielo, los pastores se dijeron unos a otros: «Vamos ahora a Belén a ver esto que ha sucedido y que el Señor nos ha dado a conocer.»"
      },
      {
        "number": "16",
        "text": "Llegaron a toda prisa y encontraron a María y a José, y al niño acostado en el pesebre."
      },
      {
        "number": "17",
        "text": "Al verlo, difundieron ampliamente el dicho que se les había dicho sobre este niño."
      },
      {
        "number": "18",
        "text": "Todos los que lo oían se asombraban de lo que les decían los pastores."
      },
      {
        "number": "19",
        "text": "Pero María guardaba todas estas palabras, meditándolas en su corazón."
      },
      {
        "number": "20",
        "text": "Los pastores volvieron glorificando y alabando a Dios por todo lo que habían oído y visto, tal como se les había dicho."
      }
    ],
    "joyful-4": [
      {
        "number": "22",
        "text": "Cuando se cumplieron los días de su purificación según la ley de Moisés, lo llevaron a Jerusalén para presentarlo al Señor"
      },
      {
        "number": "23",
        "text": "(como está escrito en la ley del Señor: «Todo varón que abra el vientre será llamado santo para el Señor»),"
      },
      {
        "number": "24",
        "text": "y para ofrecer un sacrificio según lo que se dice en la ley del Señor: «Un par de tórtolas o dos pichones»."
      },
      {
        "number": "25",
        "text": "He aquí que había en Jerusalén un hombre que se llamaba Simeón. Este hombre era justo y piadoso, y buscaba la consolación de Israel, y el Espíritu Santo estaba sobre él."
      },
      {
        "number": "26",
        "text": "Le había sido revelado por el Espíritu Santo que no vería la muerte antes de ver al Cristo del Señor."
      },
      {
        "number": "27",
        "text": "Entró en el templo en el Espíritu. Cuando los padres introdujeron al niño, Jesús, para que hicieran con él lo que estaba previsto en la ley,"
      },
      {
        "number": "28",
        "text": "entonces lo recibió en sus brazos, bendijo a Dios y dijo"
      },
      {
        "number": "29",
        "text": "«Ahora, Señor, liberas a tu siervo, en paz, según tu palabra;"
      },
      {
        "number": "30",
        "text": "porque mis ojos han visto tu salvación,"
      },
      {
        "number": "31",
        "text": "que has preparado delante de todos los pueblos;"
      },
      {
        "number": "32",
        "text": "una luz para la revelación a las naciones, y la gloria de tu pueblo Israel»."
      },
      {
        "number": "33",
        "text": "José y su madre se maravillaban de lo que se decía de él."
      },
      {
        "number": "34",
        "text": "Simeón los bendijo, y dijo a María, su madre: «He aquí que este niño está destinado a la caída y al levantamiento de muchos en Israel, y a ser una señal de la que se habla."
      },
      {
        "number": "35",
        "text": "Sí, una espada atravesará tu propia alma, para que se revelen los pensamientos de muchos corazones.»"
      },
      {
        "number": "36",
        "text": "Había una tal Ana, profetisa, hija de Fanuel, de la tribu de Aser (era de edad avanzada, pues había vivido con un marido siete años desde su virginidad,"
      },
      {
        "number": "37",
        "text": "y llevaba como ochenta y cuatro años de viuda), que no se apartaba del templo, adorando con ayunos y peticiones noche y día."
      },
      {
        "number": "38",
        "text": "Subiendo a esa misma hora, dio gracias al Señor y habló de él a todos los que buscaban la redención en Jerusalén."
      }
    ],
    "joyful-5": [
      {
        "number": "41",
        "text": "Sus padres iban todos los años a Jerusalén en la fiesta de la Pascua."
      },
      {
        "number": "42",
        "text": "Cuando tenía doce años, subieron a Jerusalén según la costumbre de la fiesta;"
      },
      {
        "number": "43",
        "text": "y cuando se cumplieron los días, al regresar, el niño Jesús se quedó en Jerusalén. José y su madre no lo sabían,"
      },
      {
        "number": "44",
        "text": "pero suponiendo que estaba en la compañía, se fueron de viaje un día; y lo buscaron entre sus parientes y conocidos."
      },
      {
        "number": "45",
        "text": "Al no encontrarlo, volvieron a Jerusalén buscándolo."
      },
      {
        "number": "46",
        "text": "Al cabo de tres días lo encontraron en el templo, sentado en medio de los maestros, escuchándolos y haciéndoles preguntas."
      },
      {
        "number": "47",
        "text": "Todos los que le oían se asombraban de su comprensión y de sus respuestas."
      },
      {
        "number": "48",
        "text": "Al verle, se asombraron; y su madre le dijo: «Hijo, ¿por qué nos has tratado así? He aquí que tu padre y yo te buscábamos ansiosamente»."
      },
      {
        "number": "49",
        "text": "Él les dijo: «¿Por qué me buscabais? ¿No sabíais que debía estar en la casa de mi Padre?»"
      },
      {
        "number": "50",
        "text": "Ellos no entendían lo que les decía."
      },
      {
        "number": "51",
        "text": "Bajó con ellos y llegó a Nazaret. Se sometió a ellos, y su madre guardaba todas estas palabras en su corazón."
      },
      {
        "number": "52",
        "text": "Y Jesús crecía en sabiduría y en estatura, y en gracia ante Dios y los hombres."
      }
    ],
    "luminous-1": [
      {
        "number": "13",
        "text": "Entonces Jesús vino de Galilea al Jordán, a Juan, para ser bautizado por él."
      },
      {
        "number": "14",
        "text": "Pero Juan se lo impedía, diciendo: «Tengo necesidad de ser bautizado por ti, ¿y tú vienes a mí?»"
      },
      {
        "number": "15",
        "text": "Pero Jesús, respondiendo, le dijo: «Permítelo ahora, porque éste es el camino adecuado para cumplir toda justicia.» Entonces se lo permitió."
      },
      {
        "number": "16",
        "text": "Jesús, después de ser bautizado, subió directamente del agua; y he aquí que se le abrieron los cielos. Vio que el Espíritu de Dios descendía como una paloma y venía sobre él."
      },
      {
        "number": "17",
        "text": "He aquí que una voz de los cielos decía: «Este es mi Hijo amado, en quien me complazco.»"
      }
    ],
    "luminous-2": [
      {
        "number": "1",
        "text": "Al tercer día, hubo una boda en Caná de Galilea. La madre de Jesús estaba allí."
      },
      {
        "number": "2",
        "text": "También Jesús fue invitado, con sus discípulos, a la boda."
      },
      {
        "number": "3",
        "text": "Cuando se acabó el vino, la madre de Jesús le dijo: «No tienen vino»."
      },
      {
        "number": "4",
        "text": "Jesús le dijo: «Mujer, ¿qué tiene que ver eso contigo y conmigo? Todavía no ha llegado mi hora»."
      },
      {
        "number": "5",
        "text": "Su madre dijo a los criados: «Haced lo que él os diga»."
      },
      {
        "number": "6",
        "text": "Había allí seis tinajas de piedra, colocadas según la costumbre judía de purificación, y en cada una cabían dos o tres metretas."
      },
      {
        "number": "7",
        "text": "Jesús les dijo: «Llenad de agua las tinajas». Así que las llenaron hasta el borde."
      },
      {
        "number": "8",
        "text": "Les dijo: «Sacad ahora un poco y llevadlo al maestresala del banquete». Así que lo llevaron."
      },
      {
        "number": "9",
        "text": "Cuando el maestresala probó el agua convertida en vino, y no sabía de dónde procedía (pero los criados que habían sacado el agua sí lo sabían), el maestresala llamó al novio"
      },
      {
        "number": "10",
        "text": "y le dijo: «Todos sirven primero el vino bueno, y cuando los invitados han bebido libremente, entonces el que es peor. ¡Tú has guardado el vino bueno hasta ahora!»"
      },
      {
        "number": "11",
        "text": "Este principio de sus milagros lo hizo Jesús en Caná de Galilea, y reveló su gloria; y sus discípulos creyeron en él."
      }
    ],
    "luminous-3": [
      {
        "number": "14",
        "text": "Después de que Juan fue detenido, Jesús vino a Galilea predicando la Buena Nueva del Reino de Dios,"
      },
      {
        "number": "15",
        "text": "y diciendo: «¡El tiempo se ha cumplido y el Reino de Dios está cerca! Arrepentíos y creed en la Buena Nueva»."
      }
    ],
    "luminous-4": [
      {
        "number": "1",
        "text": "Al cabo de seis días, Jesús tomó consigo a Pedro, Santiago y Juan, su hermano, y los llevó solos a un monte alto."
      },
      {
        "number": "2",
        "text": "Se transformó ante ellos. Su rostro brillaba como el sol, y sus vestidos se volvieron blancos como la luz."
      },
      {
        "number": "3",
        "text": "Se les aparecieron Moisés y Elías hablando con él."
      },
      {
        "number": "4",
        "text": "Pedro respondió y dijo a Jesús: «Señor, es bueno que estemos aquí. Si quieres, hagamos aquí tres tiendas: una para ti, otra para Moisés y otra para Elías»."
      },
      {
        "number": "5",
        "text": "Mientras aún hablaba, he aquí que una nube brillante los cubrió con su sombra. De la nube salió una voz que decía: «Este es mi Hijo amado, en quien me complazco. Escuchadle»."
      },
      {
        "number": "6",
        "text": "Cuando los discípulos lo oyeron, cayeron de bruces y tuvieron mucho miedo."
      },
      {
        "number": "7",
        "text": "Jesús se acercó, los tocó y les dijo: «Levantaos y no temáis»."
      },
      {
        "number": "8",
        "text": "Levantando los ojos, no vieron a nadie, excepto a Jesús solo."
      }
    ],
    "luminous-5": [
      {
        "number": "26",
        "text": "Mientras comían, Jesús tomó el pan, dio gracias por él y lo partió. Se lo dio a los discípulos y les dijo: «Tomad, comed; esto es mi cuerpo»."
      },
      {
        "number": "27",
        "text": "Tomó la copa, dio gracias y se la dio a ellos, diciendo: «Bebed todos de ella,"
      },
      {
        "number": "28",
        "text": "porque ésta es mi sangre de la nueva alianza, que se derrama por muchos para la remisión de los pecados."
      }
    ],
    "sorrowful-1": [
      {
        "number": "36",
        "text": "Entonces Jesús vino con ellos a un lugar llamado Getsemaní, y dijo a sus discípulos: «Sentaos aquí, mientras voy allí a orar.»"
      },
      {
        "number": "37",
        "text": "Tomó consigo a Pedro y a los dos hijos de Zebedeo, y comenzó a entristecerse y a angustiarse gravemente."
      },
      {
        "number": "38",
        "text": "Entonces les dijo: «Mi alma está muy triste, hasta la muerte. Quedaos aquí y velad conmigo»."
      },
      {
        "number": "39",
        "text": "Se adelantó un poco, se postró sobre su rostro y oró diciendo: «Padre mío, si es posible, haz que pase de mí esta copa; pero no lo que yo quiero, sino lo que tú quieres.»"
      },
      {
        "number": "40",
        "text": "Vino a los discípulos y los encontró durmiendo, y dijo a Pedro: «¿Qué, no habéis podido velar conmigo una hora?"
      },
      {
        "number": "41",
        "text": "Velad y orad, para que no entréis en tentación. El espíritu, en efecto, está dispuesto, pero la carne es débil»."
      },
      {
        "number": "42",
        "text": "Otra vez se fue y oró diciendo: «Padre mío, si esta copa no puede pasar de mí sin que yo la beba, hágase tu voluntad»."
      },
      {
        "number": "43",
        "text": "Volvió y los encontró durmiendo, pues los ojos de ellos estaban cargados."
      },
      {
        "number": "44",
        "text": "Los dejó de nuevo, se fue y oró por tercera vez, diciendo las mismas palabras."
      },
      {
        "number": "45",
        "text": "Entonces se acercó a sus discípulos y les dijo: «¿Todavía estáis durmiendo y descansando? He aquí que se acerca la hora, y el Hijo del Hombre es entregado en manos de los pecadores."
      },
      {
        "number": "46",
        "text": "Levantaos, vamos. He aquí que se acerca el que me traiciona»."
      }
    ],
    "sorrowful-2": [
      {
        "number": "26",
        "text": "Entonces les soltó a Barrabás; y habiendo azotado a Jesús, le entregó para ser crucificado."
      }
    ],
    "sorrowful-3": [
      {
        "number": "27",
        "text": "Entonces los soldados del gobernador llevaron a Jesús al pretorio, y reunieron alrededor de él a toda la compañía;"
      },
      {
        "number": "28",
        "text": "y desnudándole, le echaron encima un manto escarlata,"
      },
      {
        "number": "29",
        "text": "y pusieron sobre su cabeza una corona tejida de espinas, y una caña en su mano derecha; e hincando la rodilla delante de él, le escarnecían, diciendo: «¡Salve, Rey de los judíos!»"
      },
      {
        "number": "30",
        "text": "Y escupiéndole, tomaban la caña y le golpeaban en la cabeza."
      },
      {
        "number": "31",
        "text": "Después de haberle escarnecido, le quitaron el manto, le pusieron sus vestidos, y le llevaron para crucificarle."
      }
    ],
    "sorrowful-4": [
      {
        "number": "16",
        "text": "Entonces se lo entregó para que lo crucificaran. Tomaron, pues, a Jesús y se lo llevaron."
      },
      {
        "number": "17",
        "text": "Salió, llevando su cruz, al lugar llamado «Lugar de la Calavera», que en hebreo se llama «Gólgota»,"
      }
    ],
    "sorrowful-5": [
      {
        "number": "33",
        "text": "Y cuando llegaron al lugar llamado de la Calavera, le crucificaron allí, y a los malhechores, uno a la derecha y otro a la izquierda."
      },
      {
        "number": "34",
        "text": "Y Jesús decía: «Padre, perdónalos, porque no saben lo que hacen». Y repartieron entre sí sus vestidos, echando suertes."
      },
      {
        "number": "35",
        "text": "Y el pueblo estaba mirando; y aun los gobernantes se burlaban de él, diciendo: «A otros salvó; sálvese a sí mismo, si éste es el Cristo, el escogido de Dios»."
      },
      {
        "number": "36",
        "text": "Los soldados también le escarnecían, acercándose y presentándole vinagre,"
      },
      {
        "number": "37",
        "text": "y diciendo: «Si tú eres el Rey de los judíos, sálvate a ti mismo»."
      },
      {
        "number": "38",
        "text": "Había también sobre él un título escrito con letras griegas, latinas y hebreas: «ESTE ES EL REY DE LOS JUDÍOS»."
      },
      {
        "number": "39",
        "text": "Y uno de los malhechores que estaban colgados le injuriaba, diciendo: «Si tú eres el Cristo, sálvate a ti mismo y a nosotros»."
      },
      {
        "number": "40",
        "text": "Respondiendo el otro, le reprendió, diciendo: «¿Ni aun temes tú a Dios, estando en la misma condenación?"
      },
      {
        "number": "41",
        "text": "Nosotros, a la verdad, justamente padecemos, porque recibimos lo que merecieron nuestros hechos; mas éste ningún mal hizo»."
      },
      {
        "number": "42",
        "text": "Y dijo a Jesús: «Acuérdate de mí cuando vengas en tu Reino»."
      },
      {
        "number": "43",
        "text": "Entonces Jesús le dijo: «De cierto te digo que hoy estarás conmigo en el paraíso»."
      },
      {
        "number": "44",
        "text": "Cuando era como la hora sexta, hubo tinieblas sobre toda la tierra hasta la hora novena."
      },
      {
        "number": "45",
        "text": "Y el sol se oscureció, y el velo del templo se rasgó por la mitad."
      },
      {
        "number": "46",
        "text": "Entonces Jesús, clamando a gran voz, dijo: «Padre, en tus manos encomiendo mi espíritu». Y habiendo dicho esto, expiró."
      }
    ],
    "glorious-1": [
      {
        "number": "1",
        "text": "Pasado el día de reposo, al amanecer del primer día de la semana, vinieron María Magdalena y la otra María, a ver el sepulcro."
      },
      {
        "number": "2",
        "text": "Y hubo un gran terremoto; porque un ángel del Señor, descendiendo del cielo y llegando, removió la piedra, y se sentó sobre ella."
      },
      {
        "number": "3",
        "text": "Su aspecto era como un relámpago, y su vestido blanco como la nieve."
      },
      {
        "number": "4",
        "text": "Y de miedo de él los guardas temblaron y se quedaron como muertos."
      },
      {
        "number": "5",
        "text": "Mas el ángel, respondiendo, dijo a las mujeres: «No temáis vosotras; porque yo sé que buscáis a Jesús, el que fue crucificado."
      },
      {
        "number": "6",
        "text": "No está aquí, pues ha resucitado, como dijo. Venid, ved el lugar donde fue puesto el Señor."
      },
      {
        "number": "7",
        "text": "E id pronto y decid a sus discípulos que ha resucitado de los muertos, y he aquí va delante de vosotros a Galilea; allí le veréis. He aquí, os lo he dicho»."
      },
      {
        "number": "8",
        "text": "Entonces ellas, saliendo del sepulcro con temor y gran gozo, fueron corriendo a dar las nuevas a sus discípulos."
      },
      {
        "number": "9",
        "text": "Y mientras iban a dar las nuevas a los discípulos, he aquí, Jesús les salió al encuentro, diciendo: «¡Alegraos!» Y ellas, acercándose, abrazaron sus pies, y le adoraron."
      },
      {
        "number": "10",
        "text": "Entonces Jesús les dijo: «No temáis; id, dad las nuevas a mis hermanos, para que vayan a Galilea, y allí me verán»."
      }
    ],
    "glorious-2": [
      {
        "number": "6",
        "text": "Por eso, cuando se reunieron, le preguntaron: «Señor, ¿restauras ahora el reino a Israel?»."
      },
      {
        "number": "7",
        "text": "Les dijo: «No os corresponde a vosotros conocer los tiempos o las épocas que el Padre ha fijado con su propia autoridad."
      },
      {
        "number": "8",
        "text": "Pero recibiréis poder cuando el Espíritu Santo haya venido sobre vosotros. Seréis testigos de mí en Jerusalén, en toda Judea y Samaria, y hasta los confines de la tierra.»"
      },
      {
        "number": "9",
        "text": "Cuando dijo estas cosas, mientras ellos miraban, fue alzado, y una nube lo recibió fuera de su vista."
      },
      {
        "number": "10",
        "text": "Mientras ellos miraban fijamente al cielo mientras él se iba, he aquí que se pusieron junto a ellos dos hombres vestidos de blanco,"
      },
      {
        "number": "11",
        "text": "que también dijeron: «Hombres de Galilea, ¿por qué estáis mirando al cielo? Este Jesús, que ha sido recibido de entre vosotros en el cielo, volverá de la misma manera que le habéis visto subir al cielo.»"
      }
    ],
    "glorious-3": [
      {
        "number": "1",
        "text": "Al llegar el día de Pentecostés, estaban todos reunidos en un mismo lugar."
      },
      {
        "number": "2",
        "text": "De repente, vino del cielo un ruido como el de un viento impetuoso, que llenó toda la casa donde estaban sentados."
      },
      {
        "number": "3",
        "text": "Aparecieron unas lenguas como de fuego que se repartieron entre ellos, y una se posó sobre cada uno de ellos."
      },
      {
        "number": "4",
        "text": "Todos fueron llenos del Espíritu Santo y comenzaron a hablar en otras lenguas, según el Espíritu les daba la capacidad de hablar."
      }
    ],
    "glorious-4": [
      {
        "number": "1",
        "text": "Se vio una gran señal en el cielo: una mujer vestida de sol, con la luna bajo sus pies, y en su cabeza una corona de doce estrellas."
      }
    ],
    "glorious-5": [
      {
        "number": "1",
        "text": "Se vio una gran señal en el cielo: una mujer vestida de sol, con la luna bajo sus pies, y en su cabeza una corona de doce estrellas."
      }
    ]
  }
} as const satisfies Record<
  ScriptureLanguage,
  Record<RosaryScriptureKey, readonly ScriptureVerse[]>
>;

export function getRosaryScripturePassage(
  mysteryType: RosaryMysteryType,
  mysteryNumber: number,
  language: ScriptureLanguage,
): RosaryScripturePassage {
  const key = `${mysteryType}-${mysteryNumber}` as RosaryScriptureKey;
  const verses = ROSARY_SCRIPTURE_PASSAGES[language][key];

  if (!verses) {
    throw new Error(`Missing Rosary Scripture passage: ${key}`);
  }

  return {
    verses,
    source: ROSARY_SCRIPTURE_SOURCES[language],
  };
}
