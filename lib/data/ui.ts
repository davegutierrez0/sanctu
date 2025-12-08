/**
 * UI Translations - Bilingual (English/Spanish)
 */

import type { Language } from '@/components/ThemeProvider';

export const UI = {
  en: {
    // Home page
    tagline: 'A Quiet Place to Pray',
    todaysReadings: "Today's Readings",
    todaysReadingsDesc: 'Daily Mass readings, Gospel, and Psalms',
    prayRosary: 'Pray the Rosary',
    prayRosaryDesc: 'Interactive guide with mysteries and meditations',
    essentialPrayers: 'Essential Prayers',
    viewAllPrayers: 'View All Prayers',
    support: 'Support',
    footer: 'Made with prayer for the faithful',
    supportApp: 'Support this free app',

    // Navigation
    home: 'Home',
    prayers: 'Prayers',
    rosary: 'Rosary',
    readings: 'Readings',

    // Readings page
    dailyReadings: 'Daily Readings',
    loading: 'Loading...',
    errorLoading: 'Unable to load readings',
    tryAgain: 'Try Again',

    // Common
    print: 'Print',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
  },
  es: {
    // Home page
    tagline: 'Un Lugar Tranquilo para Orar',
    todaysReadings: 'Lecturas de Hoy',
    todaysReadingsDesc: 'Lecturas diarias de la Misa, Evangelio y Salmos',
    prayRosary: 'Rezar el Rosario',
    prayRosaryDesc: 'Guía interactiva con misterios y meditaciones',
    essentialPrayers: 'Oraciones Esenciales',
    viewAllPrayers: 'Ver Todas las Oraciones',
    support: 'Apoyar',
    footer: 'Hecho con oración para los fieles',
    supportApp: 'Apoya esta aplicación gratuita',

    // Navigation
    home: 'Inicio',
    prayers: 'Oraciones',
    rosary: 'Rosario',
    readings: 'Lecturas',

    // Readings page
    dailyReadings: 'Lecturas Diarias',
    loading: 'Cargando...',
    errorLoading: 'No se pudieron cargar las lecturas',
    tryAgain: 'Intentar de Nuevo',

    // Common
    print: 'Imprimir',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
  },
};

export function getUI(lang: Language) {
  return UI[lang];
}

// Essential prayers for home page (with translations)
export const ESSENTIAL_PRAYER_IDS = ['our-father', 'hail-mary', 'glory-be', 'creed'];
