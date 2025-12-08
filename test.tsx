import React, { useState, useEffect, useMemo } from 'react';
import { Book, Sun, Moon, Settings, ChevronRight, ChevronLeft, Heart, Share2, Coffee, Printer, RotateCcw } from 'lucide-react';

/**
 * SANCTUS - A Minimalist Catholic Web App
 * * Features:
 * - Zero dependency (except React/Lucide)
 * - LocalStorage persistence for preferences
 * - Liturgical Calendar logic (simplified)
 * - Interactive Rosary tracker
 * - Printer friendly CSS
 */

// --- DATA: PRAYERS ---
const COMMON_PRAYERS = [
  {
    id: 'our-father',
    title: 'Our Father',
    latin: 'Pater Noster',
    text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latin: 'Ave Maria',
    text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latin: 'Gloria Patri',
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
  },
  {
    id: 'creed',
    title: "Apostles' Creed",
    latin: 'Symbolum Apostolorum',
    text: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
  },
  {
    id: 'hail-holy-queen',
    title: 'Hail, Holy Queen',
    latin: 'Salve Regina',
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God. That we may be made worthy of the promises of Christ."
  },
  {
    id: 'fatima',
    title: 'Fatima Prayer',
    latin: 'Oratio Fatimae',
    text: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy."
  },
  {
    id: 'memorae',
    title: 'The Memorare',
    latin: null,
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by