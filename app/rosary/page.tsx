'use client';

import { getTodaysMystery, ROSARY_MYSTERIES, getLocalizedMystery, ROSARY_UI, ROSARY_PRAYERS, type MysteryType } from '@/lib/data/rosary';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { ArrowLeft, Printer, RotateCcw, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';

type RosaryPhase = 'opening' | 'decade' | 'decadeEnd' | 'closing' | 'complete';

// Opening prayers sequence: Sign of Cross + Creed together, Our Father, 3 Hail Marys, Glory Be
const OPENING_STEPS = ['signOfCrossAndCreed', 'ourFather', 'hailMary1', 'hailMary2', 'hailMary3', 'gloryBe'] as const;

// Closing prayers sequence: Hail Holy Queen, dialogue, final prayer (includes sign of cross)
const CLOSING_STEPS = ['hailHolyQueen', 'dialogue', 'finalPrayerWithSign'] as const;

// Prayers that should be collapsed by default (Our Father and Hail Mary)
const COLLAPSED_BY_DEFAULT = ['ourFather', 'hailMary'];

// Decade end prayers: Glory Be, optional Fatima Prayer
const DECADE_END_STEPS = ['gloryBe', 'fatimaPrayer'] as const;

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

  // User preferences
  const [showFatimaPrayer, setShowFatimaPrayer] = useState(true);
  const [expandedPrayers, setExpandedPrayers] = useState<Record<string, boolean>>({});

  // Persist user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedFatima = window.localStorage.getItem('rosary:showFatimaPrayer');
    const storedExpanded = window.localStorage.getItem('rosary:expandedPrayers');
    if (storedFatima !== null) setShowFatimaPrayer(storedFatima === 'true');
    if (storedExpanded) {
      try {
        setExpandedPrayers(JSON.parse(storedExpanded));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('rosary:showFatimaPrayer', String(showFatimaPrayer));
  }, [showFatimaPrayer]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('rosary:expandedPrayers', JSON.stringify(expandedPrayers));
  }, [expandedPrayers]);

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
    setPhase('opening');
    setOpeningStep(0);
    setCurrentDecade(0);
    setCurrentBead(0);
    setDecadeEndStep(0);
    setClosingStep(0);
  };

  const nextStep = () => {
    if (phase === 'opening') {
      if (openingStep < OPENING_STEPS.length - 1) {
        setOpeningStep(openingStep + 1);
      } else {
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
        setPhase('complete');
      }
    }
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
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground)_12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Home
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleCompact />
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Print"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">{ui.title}</h1>

          {/* Mystery Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(localizedMysterySets).map(([key, mysterySet]) => {
              const isToday = key === todaysMysteryType;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setMysteryType(key as MysteryType);
                    reset();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    mysteryType === key
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {mysterySet.name}
                  {isToday && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-rose-500 rounded-full" title={ui.todaysMystery}>
                      <Calendar size={10} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="inline mr-1" />
            {ui.todaysMystery}: {localizedMysterySets[todaysMysteryType].name}
          </p>
        </header>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{getPhaseLabel()}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 dark:bg-rose-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Mystery (show during decade phase) */}
        {(phase === 'decade' || phase === 'decadeEnd') && (
          <div className="mb-12 p-8 rounded-2xl bg-stone-100 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800">
            <div className={`text-sm font-medium mb-2 ${currentMysterySet.color}`}>
              {currentMysterySet.name}
            </div>
            <h2 className="text-3xl font-light mb-3">
              {currentMystery.number}. {currentMystery.title}
            </h2>
            {currentMystery.scripture && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                {currentMystery.scripture}
              </p>
            )}
            {currentMystery.meditation && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentMystery.meditation}
              </p>
            )}
          </div>
        )}

        {/* Prayer Section */}
        {phase !== 'complete' && currentPrayer && (
          <div className="mb-12">
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
                        onClick={() => togglePrayerExpanded(p.key)}
                        className="inline-flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
                    onClick={() => togglePrayerExpanded(currentPrayer.key)}
                    className="inline-flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
                    onChange={(e) => setShowFatimaPrayer(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  {ui.includeFatima}
                </label>
              </div>
            )}

            {/* Next Button */}
            <div className="text-center">
              <button
                onClick={nextStep}
                className="px-12 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all"
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
              onClick={reset}
              className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-black font-medium transition-colors"
            >
              {ui.prayAnother}
            </button>
          </div>
        )}

        {/* All Mysteries List */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-light mb-6 tracking-tight">{ui.allMysteries}</h3>
          <div className="grid gap-4">
            {currentMysterySet.mysteries.map((mystery) => (
              <div
                key={mystery.number}
                className={`p-6 rounded-xl border transition-colors ${
                  (phase === 'decade' || phase === 'decadeEnd') && currentDecade === mystery.number - 1
                    ? 'border-rose-600 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/20'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <h4 className="font-medium mb-1">
                  {mystery.number}. {mystery.title}
                </h4>
                {mystery.scripture && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {mystery.scripture}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
