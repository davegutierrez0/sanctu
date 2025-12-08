'use client';

import { Book, Coffee, Heart, Moon, Printer, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

export default function HomePage() {
  const { isDark, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Print-only header */}
      <div className="print-header">
        <h1>Sanctus</h1>
        <p>{today}</p>
      </div>

      {/* Top Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight small-caps">
            Sanctus
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Print"
            >
              <Printer size={20} />
            </button>

            <a
              href="https://buymeacoffee.com/sanctusapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-black transition-colors text-sm font-medium shadow-sm"
            >
              <Coffee size={16} />
              Support
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-3">
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {today}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            A Quiet Place to Pray
          </h1>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/readings"
            className="group block p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Book className="text-purple-600 dark:text-purple-400 mb-4" size={28} />
            <h2 className="text-2xl font-medium mb-2">Today's Readings</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Daily Mass readings, Gospel, and Psalms
            </p>
          </Link>

          <Link
            href="/rosary"
            className="group block p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Heart className="text-rose-600 dark:text-rose-400 mb-4" size={28} />
            <h2 className="text-2xl font-medium mb-2">Pray the Rosary</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Interactive guide with mysteries and meditations
            </p>
          </Link>
        </div>

        {/* Essential Prayers */}
        <section className="mb-16">
          <h2 className="text-3xl font-light mb-8 tracking-tight">Essential Prayers</h2>
          <div className="space-y-4">
            {[
              { id: 'our-father', title: 'Our Father', latin: 'Pater Noster' },
              { id: 'hail-mary', title: 'Hail Mary', latin: 'Ave Maria' },
              { id: 'glory-be', title: 'Glory Be', latin: 'Gloria Patri' },
              { id: 'creed', title: "Apostles' Creed", latin: 'Symbolum Apostolorum' },
            ].map((prayer) => (
              <Link
                key={prayer.id}
                href={`/prayers/${prayer.id}`}
                className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">{prayer.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {prayer.latin}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}

            <Link
              href="/prayers"
              className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-center text-gray-600 dark:text-gray-400"
            >
              View All Prayers →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="no-print text-center text-sm text-gray-500 dark:text-gray-400 pt-12 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <p>Made with prayer for the faithful</p>
          <p>
            <a
              href="https://buymeacoffee.com/davegutierrez0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Support this free app
            </a>
          </p>
        </footer>
      </main>

      {/* Print-only footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctus App - {today}
      </div>
    </>
  );
}
