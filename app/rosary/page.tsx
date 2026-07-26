'use client';

import { getTodaysMystery, ROSARY_MYSTERIES, getLocalizedMystery, ROSARY_UI, ROSARY_PRAYERS, type MysteryType } from '@/lib/data/rosary';
import { useLanguage } from '@/components/ThemeProvider';
import { BookOpen, Calendar, ChevronDown, Play, Printer, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { analytics } from '@/lib/analytics';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import {
  createRosaryProgress,
  describeRosaryProgress,
  parseRosaryProgress,
  ROSARY_PROGRESS_STORAGE_KEY,
  type RosaryProgress,
} from '@/lib/rosary-progress';

type RosaryPhase = 'opening' | 'decade' | 'decadeEnd' | 'closing' | 'complete';

// Opening prayers sequence: Sign of Cross + Creed together, Our Father, 3 Hail Marys, Glory Be
const OPENING_STEPS = ['signOfCrossAndCreed', 'ourFather', 'hailMary1', 'hailMary2', 'hailMary3', 'gloryBe'] as const;

// Closing prayers sequence: Hail Holy Queen, dialogue, final prayer (includes sign of cross)
const CLOSING_STEPS = ['hailHolyQueen', 'dialogue', 'finalPrayerWithSign'] as const;

// Prayers that should be collapsed by default (Our Father and Hail Mary)
const COLLAPSED_BY_DEFAULT = ['ourFather', 'hailMary'];

// Decade end prayers: Glory Be, optional Fatima Prayer
const DECADE_END_STEPS = ['gloryBe', 'fatimaPrayer'] as const;

function getStoredShowFatimaPrayer(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    return window.localStorage.getItem('rosary:showFatimaPrayer') !== 'false';
  } catch {
    return true;
  }
}

function getStoredExpandedPrayers(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};

  try {
    const storedExpanded = window.localStorage.getItem('rosary:expandedPrayers');
    if (!storedExpanded) return {};

    const parsed: unknown = JSON.parse(storedExpanded);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
    );
  } catch {
    return {};
  }
}

export default function RosaryPage() {
  const { language } = useLanguage();
  const ui = ROSARY_UI[language];
  const prayers = ROSARY_PRAYERS;

  // Get today's mystery type for auto-selection
  const todaysMysteryType = useMemo(() => getTodaysMystery().type, []);

  const [mysteryType, setMysteryType] = useState<MysteryType>(todaysMysteryType);
  const [phase, setPhase] = useState<RosaryPhase>('opening');
  const [openingStep, setOpeningStep] = useState<number>(0);
  const [currentDecade, setCurrentDecade] = useState(0);
  const [currentBead, setCurrentBead] = useState(0); // 0 = Our Father, 1-10 = Hail Marys
  const [decadeEndStep, setDecadeEndStep] = useState<number>(0);
  const [closingStep, setClosingStep] = useState<number>(0);

  usePageEngagement('rosary');

  // User preferences
  const [showFatimaPrayer, setShowFatimaPrayer] = useState(true);
  const [expandedPrayers, setExpandedPrayers] = useState<Record<string, boolean>>({});
  const [savedProgress, setSavedProgress] = useState<RosaryProgress | null>(null);
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setShowFatimaPrayer(getStoredShowFatimaPrayer());
      setExpandedPrayers(getStoredExpandedPrayers());
      try {
        setSavedProgress(
          parseRosaryProgress(
            window.localStorage.getItem(ROSARY_PROGRESS_STORAGE_KEY),
          ),
        );
      } catch {
        setSavedProgress(null);
      }
      setStorageHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageHydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('rosary:showFatimaPrayer', String(showFatimaPrayer));
    } catch {
      return;
    }
  }, [showFatimaPrayer, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('rosary:expandedPrayers', JSON.stringify(expandedPrayers));
    } catch {
      return;
    }
  }, [expandedPrayers, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated || !sessionActive || typeof window === 'undefined') return;

    try {
      if (phase === 'complete') {
        window.localStorage.removeItem(ROSARY_PROGRESS_STORAGE_KEY);
        return;
      }

      const checkpoint = createRosaryProgress({
        mysteryType,
        phase,
        openingStep,
        currentDecade,
        currentBead,
        decadeEndStep,
        closingStep,
      });

      window.localStorage.setItem(ROSARY_PROGRESS_STORAGE_KEY, JSON.stringify(checkpoint));
    } catch {
      return;
    }
  }, [
    closingStep,
    currentBead,
    currentDecade,
    decadeEndStep,
    mysteryType,
    openingStep,
    phase,
    sessionActive,
    storageHydrated,
  ]);

  const localizedMysterySets = useMemo(
    () =>
      Object.entries(ROSARY_MYSTERIES).reduce(
        (acc, [key, set]) => ({ ...acc, [key]: getLocalizedMystery(set, language) }),
        {} as Record<MysteryType, ReturnType<typeof getLocalizedMystery>>
      ),
    [language]
  );

  const currentMysterySet = localizedMysterySets[mysteryType];
  const currentMystery = currentMysterySet.mysteries[currentDecade];
  const savedMysterySet = savedProgress
    ? localizedMysterySets[savedProgress.mysteryType]
    : null;

  // Calculate progress
  const calculateProgress = useCallback(() => {
    const openingTotal = OPENING_STEPS.length;
    const decadeTotal = 11; // Our Father + 10 Hail Marys
    const decadeEndTotal = showFatimaPrayer ? 2 : 1;
    const closingTotal = CLOSING_STEPS.length;
    const totalSteps = openingTotal + (decadeTotal + decadeEndTotal) * 5 + closingTotal;

    let currentStep = 0;
    if (phase === 'opening') {
      currentStep = openingStep;
    } else if (phase === 'decade') {
      currentStep = openingTotal + currentDecade * (decadeTotal + decadeEndTotal) + currentBead;
    } else if (phase === 'decadeEnd') {
      currentStep = openingTotal + currentDecade * (decadeTotal + decadeEndTotal) + decadeTotal + decadeEndStep;
    } else if (phase === 'closing') {
      currentStep = openingTotal + 5 * (decadeTotal + decadeEndTotal) + closingStep;
    } else if (phase === 'complete') {
      currentStep = totalSteps;
    }

    return (currentStep / totalSteps) * 100;
  }, [phase, openingStep, currentDecade, currentBead, decadeEndStep, closingStep, showFatimaPrayer]);

  const progress = calculateProgress();

  const togglePrayerExpanded = (key: string) => {
    setExpandedPrayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    analytics.rosaryReset();
    setSessionActive(false);
    setSavedProgress(null);
    try {
      window.localStorage.removeItem(ROSARY_PROGRESS_STORAGE_KEY);
    } catch {
      // The Rosary remains usable when browser storage is unavailable.
    }
    setPhase('opening');
    setOpeningStep(0);
    setCurrentDecade(0);
    setCurrentBead(0);
    setDecadeEndStep(0);
    setClosingStep(0);
  };

  const skipToDecade = (decadeIndex: number) => {
    setSavedProgress(null);
    setSessionActive(true);
    setPhase('decade');
    setCurrentDecade(decadeIndex);
    setCurrentBead(0);
    setDecadeEndStep(0);
    setClosingStep(0);
  };

  const nextStep = () => {
    setSavedProgress(null);
    setSessionActive(true);

    if (phase === 'opening') {
      if (openingStep < OPENING_STEPS.length - 1) {
        setOpeningStep(openingStep + 1);
      } else {
        analytics.rosaryStarted(mysteryType, language);
        setPhase('decade');
        setCurrentBead(0);
      }
    } else if (phase === 'decade') {
      if (currentBead < 10) {
        setCurrentBead(currentBead + 1);
      } else {
        setPhase('decadeEnd');
        setDecadeEndStep(0);
      }
    } else if (phase === 'decadeEnd') {
      const maxStep = showFatimaPrayer ? 1 : 0;
      if (decadeEndStep < maxStep) {
        setDecadeEndStep(decadeEndStep + 1);
      } else {
        analytics.rosaryDecadeCompleted(currentDecade + 1, mysteryType);
        if (currentDecade < 4) {
          setCurrentDecade(currentDecade + 1);
          setCurrentBead(0);
          setPhase('decade');
        } else {
          setPhase('closing');
          setClosingStep(0);
        }
      }
    } else if (phase === 'closing') {
      if (closingStep < CLOSING_STEPS.length - 1) {
        setClosingStep(closingStep + 1);
      } else {
        analytics.rosaryCompleted(mysteryType, language);
        setPhase('complete');
      }
    }
  };

  const resumeRosary = () => {
    if (!savedProgress) return;

    setMysteryType(savedProgress.mysteryType);
    setPhase(savedProgress.phase);
    setOpeningStep(savedProgress.openingStep);
    setCurrentDecade(savedProgress.currentDecade);
    setCurrentBead(savedProgress.currentBead);
    setDecadeEndStep(savedProgress.decadeEndStep);
    setClosingStep(savedProgress.closingStep);
    setSavedProgress(null);
    setSessionActive(true);
  };

  // Check if a prayer should be expanded by default
  const isExpandedByDefault = (key: string) => !COLLAPSED_BY_DEFAULT.includes(key);

  // Get the effective expanded state (user preference or default)
  const isPrayerExpanded = (key: string) => {
    if (key in expandedPrayers) {
      return expandedPrayers[key];
    }
    return isExpandedByDefault(key);
  };

  // Get current prayer info based on phase and step
  const getCurrentPrayer = () => {
    if (phase === 'opening') {
      const step = OPENING_STEPS[openingStep];
      switch (step) {
        case 'signOfCrossAndCreed':
          return {
            key: 'signOfCrossAndCreed',
            combinedPrayers: [
              { key: 'signOfCross', prayer: prayers.signOfTheCross[language] },
              { key: 'creed', prayer: prayers.apostlesCreed[language] }
            ]
          };
        case 'ourFather':
          return { key: 'ourFather', prayer: prayers.ourFather[language] };
        case 'hailMary1':
        case 'hailMary2':
        case 'hailMary3':
          return { key: 'hailMary', prayer: prayers.hailMary[language], count: parseInt(step.slice(-1)) };
        case 'gloryBe':
          return { key: 'gloryBe', prayer: prayers.gloryBe[language] };
      }
    } else if (phase === 'decade') {
      if (currentBead === 0) {
        return { key: 'ourFather', prayer: prayers.ourFather[language] };
      } else {
        return { key: 'hailMary', prayer: prayers.hailMary[language], count: currentBead };
      }
    } else if (phase === 'decadeEnd') {
      const step = DECADE_END_STEPS[decadeEndStep];
      if (step === 'gloryBe') {
        return { key: 'gloryBe', prayer: prayers.gloryBe[language] };
      } else {
        return { key: 'fatimaPrayer', prayer: prayers.fatimaPrayer[language], optional: true };
      }
    } else if (phase === 'closing') {
      const step = CLOSING_STEPS[closingStep];
      switch (step) {
        case 'hailHolyQueen':
          return { key: 'hailHolyQueen', prayer: prayers.hailHolyQueen[language] };
        case 'dialogue':
          return { key: 'dialogue', dialogue: prayers.closingDialogue[language] };
        case 'finalPrayerWithSign':
          return {
            key: 'finalPrayerWithSign',
            combinedPrayers: [
              { key: 'finalPrayer', prayer: prayers.closingPrayer[language] },
              { key: 'signOfCross', prayer: prayers.signOfTheCross[language] }
            ]
          };
      }
    }
    return null;
  };

  const currentPrayer = getCurrentPrayer();

  // Get button text
  const getButtonText = () => {
    if (phase === 'opening') {
      return openingStep === OPENING_STEPS.length - 1 ? ui.beginRosary : ui.nextPrayer;
    } else if (phase === 'decade') {
      return ui.nextBead;
    } else if (phase === 'decadeEnd') {
      const maxStep = showFatimaPrayer ? 1 : 0;
      if (decadeEndStep >= maxStep) {
        return currentDecade < 4 ? ui.nextDecade : ui.finishRosary;
      }
      return ui.nextPrayer;
    } else if (phase === 'closing') {
      return closingStep === CLOSING_STEPS.length - 1 ? ui.complete : ui.nextPrayer;
    }
    return ui.next;
  };

  // Get phase label
  const getPhaseLabel = () => {
    if (phase === 'opening') return ui.openingPrayers;
    if (phase === 'closing') return ui.closingPrayers;
    if (phase === 'decadeEnd') return ui.decadeComplete;
    return `${ui.decade} ${currentDecade + 1}`;
  };

  return (
    <div className="sanctu-page rosary-page">
      <AppHeader
        backHref="/"
        backLabel={language === 'es' ? 'Inicio' : 'Home'}
        action={(
          <div className="header-actions">
            <button
              type="button"
              onClick={() => { analytics.printClicked('rosary'); window.print(); }}
              className="header-control"
              aria-label={language === 'es' ? 'Imprimir' : 'Print'}
            >
              <Printer size={18} />
            </button>
            <button
              type="button"
              onClick={reset}
              className="header-control"
              aria-label={language === 'es' ? 'Reiniciar' : 'Reset'}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}
      />

      <main className="sanctu-content content-page">
        <header className="page-heading centered">
          <p className="eyebrow">Sanctu</p>
          <h1>{ui.title}</h1>

          {/* Mystery Selector */}
          <div className="rosary-mystery-selector" role="group" aria-label={ui.selectMystery}>
            {Object.entries(localizedMysterySets).map(([key, mysterySet]) => {
              const isToday = key === todaysMysteryType;
              const isSelected = mysteryType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setMysteryType(key as MysteryType);
                    analytics.mysteryChanged(key);
                    reset();
                  }}
                  className={isSelected ? 'rosary-mystery-option is-selected' : 'rosary-mystery-option'}
                  aria-pressed={mysteryType === key}
                >
                  {mysterySet.name}
                  {isToday && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-rose-500 rounded-full"
                      title={ui.todaysMystery}
                      aria-hidden="true"
                    >
                      <Calendar size={10} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="rosary-today">
            <Calendar aria-hidden="true" size={13} />
            {ui.todaysMystery}: {localizedMysterySets[todaysMysteryType].name}
          </p>
        </header>

        {savedProgress && savedMysterySet && (
          <section className="rosary-resume stone-card" aria-labelledby="rosary-resume-title">
            <div className="rosary-resume-heading">
              <span className="rosary-resume-icon" aria-hidden="true">
                <Play size={17} fill="currentColor" />
              </span>
              <div>
                <p className="eyebrow">{ui.resumeTitle}</p>
                <h2 id="rosary-resume-title">{savedMysterySet.name}</h2>
              </div>
            </div>
            <p className="rosary-resume-position">
              {ui.resumeAt}: {describeRosaryProgress(savedProgress, language)}
            </p>
            <div className="rosary-resume-actions">
              <button type="button" className="primary-button" onClick={resumeRosary}>
                <Play size={15} fill="currentColor" />
                {ui.resume}
              </button>
              <button type="button" className="secondary-button" onClick={reset}>
                {ui.startOver}
              </button>
            </div>
          </section>
        )}

        {/* Progress */}
        <div className="mb-12">
          <div className="rosary-progress-label">
            <span>{getPhaseLabel()}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="rosary-progress-track"
            role="progressbar"
            aria-label={`${ui.progress}: ${getPhaseLabel()}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="rosary-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Mystery (show during decade phase) */}
        {(phase === 'decade' || phase === 'decadeEnd') && (
          <div className="rosary-mystery stone-card">
            <div className={`text-sm font-medium mb-2 ${currentMysterySet.color}`}>
              {currentMysterySet.name}
            </div>
            <h2 className="text-3xl font-light mb-3">
              {currentMystery.number}. {currentMystery.title}
            </h2>
            {currentMystery.meditation && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentMystery.meditation}
              </p>
            )}
            <details key={`${mysteryType}-${currentDecade}`} className="rosary-scripture">
              <summary>
                <span className="rosary-scripture-label">
                  <BookOpen size={17} />
                  {ui.readScripture}
                </span>
                <span className="rosary-scripture-reference">
                  {currentMystery.scripture.reference}
                </span>
                <ChevronDown className="rosary-scripture-chevron" size={17} />
              </summary>
              <div className="rosary-scripture-text">
                <p className="rosary-scripture-intro">{ui.scriptureReflection}</p>
                <blockquote cite={currentMystery.scripture.source.url}>
                  {currentMystery.scripture.verses.map((verse) => (
                    <p className="rosary-scripture-verse" key={verse.number}>
                      <sup
                        className="rosary-scripture-verse-number"
                        aria-label={`${ui.verse} ${verse.number}`}
                      >
                        {verse.number}
                      </sup>
                      {verse.text}
                    </p>
                  ))}
                </blockquote>
                <footer className="rosary-scripture-source">
                  <p>
                    {ui.scriptureTranslation}:{' '}
                    <a
                      href={currentMystery.scripture.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {currentMystery.scripture.source.name}
                    </a>{' '}
                    ({currentMystery.scripture.source.abbreviation}) · {ui.publicDomain}
                  </p>
                  <p>{currentMystery.scripture.source.note}</p>
                </footer>
              </div>
            </details>
          </div>
        )}

        {/* Prayer Section */}
        {phase !== 'complete' && currentPrayer && (
          <div className="rosary-prayer stone-card">
            {/* Bead Counter (show during decade phase) */}
            {phase === 'decade' && (
              <div className="flex justify-center gap-2 mb-6 items-center">
                {Array.from({ length: 11 }).map((_, i) => {
                  const isOurFather = i === 0;
                  const isActive = i <= currentBead;
                  const baseSize = isOurFather ? 'w-10 h-10' : 'w-8 h-8';
                  const activeColor = isOurFather
                    ? 'bg-amber-500 border-amber-500 dark:bg-amber-400 dark:border-amber-400'
                    : 'bg-rose-600 border-rose-600 dark:bg-rose-400 dark:border-rose-400';
                  const inactiveColor = isOurFather
                    ? 'border-amber-300 dark:border-amber-500'
                    : 'border-gray-300 dark:border-gray-700';

                  return (
                    <div
                      key={i}
                      className={`${baseSize} rounded-full border-2 transition-all ${isActive ? activeColor : inactiveColor}`}
                      title={isOurFather ? prayers.ourFather[language].title : prayers.hailMary[language].title}
                    />
                  );
                })}
              </div>
            )}

            {/* Opening prayer progress indicator */}
            {phase === 'opening' && (
              <div className="flex justify-center gap-2 mb-6">
                {OPENING_STEPS.map((step, i) => {
                  const isActive = i <= openingStep;
                  const isCurrent = i === openingStep;
                  return (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all ${
                        isActive
                          ? isCurrent
                            ? 'bg-rose-600 dark:bg-rose-400 scale-125'
                            : 'bg-rose-400 dark:bg-rose-600'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Prayer Text */}
            <div className="prayer-text max-w-xl mx-auto text-center mb-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {ui.pray}
                {'count' in currentPrayer && currentPrayer.count && phase === 'decade' && ` (${currentPrayer.count}/10)`}
                {'count' in currentPrayer && currentPrayer.count && phase === 'opening' && ` (${currentPrayer.count}/3)`}
                {'optional' in currentPrayer && currentPrayer.optional && ` ${ui.optional}`}
              </p>

              {'dialogue' in currentPrayer && currentPrayer.dialogue ? (
                <div className="space-y-4 text-left">
                  <p className="text-lg text-gray-900 dark:text-gray-100 italic">
                    {currentPrayer.dialogue.versicle}
                  </p>
                  <p className="text-lg text-gray-900 dark:text-gray-100 italic font-medium">
                    {currentPrayer.dialogue.response}
                  </p>
                </div>
              ) : 'combinedPrayers' in currentPrayer && currentPrayer.combinedPrayers ? (
                <div className="space-y-6">
                  {currentPrayer.combinedPrayers.map((p) => (
                    <div key={p.key} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => togglePrayerExpanded(p.key)}
                        className="rosary-disclosure inline-flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        aria-expanded={isPrayerExpanded(p.key)}
                      >
                        {isPrayerExpanded(p.key) ? '−' : '+'} {p.prayer.title}...
                      </button>
                      {isPrayerExpanded(p.key) && (
                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed text-left">
                          {'intro' in p.prayer && (p.prayer as { intro?: string }).intro && (
                            <p className="font-medium mb-2">{(p.prayer as { intro: string }).intro}</p>
                          )}
                          <p>{p.prayer.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : 'prayer' in currentPrayer && currentPrayer.prayer ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => togglePrayerExpanded(currentPrayer.key)}
                    className="rosary-disclosure inline-flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    aria-expanded={isPrayerExpanded(currentPrayer.key)}
                  >
                    {isPrayerExpanded(currentPrayer.key) ? '−' : '+'} {currentPrayer.prayer.title}...
                  </button>
                  {isPrayerExpanded(currentPrayer.key) && (
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed text-left">
                      {'intro' in currentPrayer.prayer && (currentPrayer.prayer as { intro?: string }).intro && (
                        <p className="font-medium mb-2">{(currentPrayer.prayer as { intro: string }).intro}</p>
                      )}
                      <p>{currentPrayer.prayer.text}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Fatima Prayer Toggle (show during decade end) */}
            {phase === 'decadeEnd' && decadeEndStep === 0 && (
              <div className="flex justify-center mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFatimaPrayer}
                    onChange={(e) => { setShowFatimaPrayer(e.target.checked); analytics.fatimaPrayerToggled(e.target.checked); }}
                    className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  {ui.includeFatima}
                </label>
              </div>
            )}

            {/* Next Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={nextStep}
                className="rosary-primary-button"
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        )}

        {/* Complete State */}
        {phase === 'complete' && (
          <div className="text-center space-y-4 mb-12">
            <p className="text-xl font-medium text-rose-600 dark:text-rose-400">
              {ui.rosaryComplete}
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-black font-medium transition-colors"
            >
              {ui.prayAnother}
            </button>
          </div>
        )}

        {/* All Mysteries List */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-light mb-6 tracking-tight">{ui.allMysteries}</h2>
          <div className="grid gap-4">
            {currentMysterySet.mysteries.map((mystery) => {
              const isActive = (phase === 'decade' || phase === 'decadeEnd') && currentDecade === mystery.number - 1;
              return (
                <button
                  key={mystery.number}
                  type="button"
                  onClick={() => skipToDecade(mystery.number - 1)}
                  aria-pressed={isActive}
                  className={`p-6 rounded-xl border transition-colors text-left ${
                    isActive
                      ? 'border-rose-600 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/10'
                  }`}
                >
                  <h3 className="font-medium mb-1">
                    {mystery.number}. {mystery.title}
                  </h3>
                  {mystery.scripture && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {mystery.scripture.reference}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
