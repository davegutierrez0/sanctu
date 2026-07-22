import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PWAInstaller from "@/components/PWAInstaller";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import "./print.css";

export const metadata: Metadata = {
  title: "Sanctus — A Catholic Liturgical Companion",
  description: "The Liturgy of the Hours, daily Mass readings, a bilingual Mass guide, Rosary, and Catholic prayers in a fast offline companion.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sanctus",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d8d1c5" },
    { media: "(prefers-color-scheme: dark)", color: "#17191b" },
  ],
};

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem('theme') || 'system';
      var language = localStorage.getItem('language');
      var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      if (language === 'en' || language === 'es') document.documentElement.lang = language;
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <PWAInstaller />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
