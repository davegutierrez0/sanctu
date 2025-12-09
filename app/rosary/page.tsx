'use client';

import { getTodaysMystery, ROSARY_MYSTERIES, getLocalizedMystery, ROSARY_UI, type MysteryType } from '@/lib/data/rosary';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { ArrowLeft, Printer, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function RosaryPage() {
  const { language } = useLanguage();
  const ui = ROSARY_UI[language];
  const [mysteryType, setMysteryType] = useState<MysteryType>(() => getTodaysMystery().type);
  const [currentDecade, setCurrentDecade] = useState(0);
  const [currentBead, setCurrentBead] = useState(0); // 0-9 for each decade

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
  const totalBeads = 10;
  const progress = ((currentDecade * 10 + currentBead) / 50) * 100;

  const nextBead = () => {
    if (currentBead < totalBeads - 1) {
      setCurrentBead(currentBead + 1);
    } else if (currentDecade < 4) {
      setCurrentDecade(currentDecade + 1);
      setCurrentBead(0);
    }
  };

  const reset = () => {
    setCurrentDecade(0);
    setCurrentBead(0);
  };

  const isCompleted = currentDecade === 4 && currentBead === totalBeads - 1;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground) 12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
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
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">The Holy Rosary</h1>

          {/* Mystery Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(localizedMysterySets).map(([key, mysterySet]) => (
              <button
                key={key}
                onClick={() => {
                  setMysteryType(key as MysteryType);
                  reset();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mysteryType === key
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {mysterySet.name}
              </button>
            ))}
          </div>
        </header>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Decade {currentDecade + 1} of 5</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 dark:bg-rose-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Mystery */}
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

        {/* Bead Counter */}
        <div className="mb-12">
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalBeads }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  i <= currentBead
                    ? 'bg-rose-600 border-rose-600 dark:bg-rose-400 dark:border-rose-400'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Prayer Text */}
          <div className="prayer-text max-w-xl mx-auto text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentBead === 0 && currentDecade > 0 ? 'Pray:' : 'Current Prayer:'}
            </p>
            <p className="text-lg">
              {currentBead === 0 && currentDecade === 0
                ? "Our Father..."
                : currentBead === 0
                ? "Our Father..."
                : "Hail Mary..."}
            </p>
          </div>

          {/* Next Button */}
          {!isCompleted ? (
            <div className="text-center">
              <button
                onClick={nextBead}
                className="px-12 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Next Bead
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-xl font-medium text-rose-600 dark:text-rose-400">
                Rosary Complete!
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Finish with the Hail Holy Queen and closing prayers
              </p>
              <button
                onClick={reset}
                className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-black font-medium transition-colors"
              >
                Pray Another Rosary
              </button>
            </div>
          )}
        </div>

        {/* All Mysteries List */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-light mb-6 tracking-tight">All Mysteries</h3>
          <div className="grid gap-4">
            {currentMysterySet.mysteries.map((mystery) => (
              <div
                key={mystery.number}
                className={`p-6 rounded-xl border transition-colors ${
                  currentDecade === mystery.number - 1
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
