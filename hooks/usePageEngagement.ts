'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export function usePageEngagement(page: string) {
  const startTime = useRef(0);
  const firedThresholds = useRef(new Set<number>());

  useEffect(() => {
    startTime.current = Date.now();
    firedThresholds.current.clear();

    // Offline detection
    if (!navigator.onLine) {
      analytics.offlineUsage(page);
    }

    // Scroll depth tracking
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const percent = Math.round((window.scrollY / scrollHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !firedThresholds.current.has(threshold)) {
          firedThresholds.current.add(threshold);
          analytics.scrollDepth(page, threshold);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Time on page — fire on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (seconds > 2) {
        analytics.timeOnPage(page, seconds);
      }
    };
  }, [page]);
}
