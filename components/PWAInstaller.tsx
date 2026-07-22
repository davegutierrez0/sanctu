'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registration.update().catch((error) => {
            console.error('Service Worker update failed:', error);
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Track PWA install prompt
    const handleBeforeInstallPrompt = () => {
      analytics.pwaPromptShown();
    };

    const handleAppInstalled = () => {
      analytics.pwaInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
