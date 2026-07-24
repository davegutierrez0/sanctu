import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PWAInstaller from "@/components/PWAInstaller";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import "./print.css";

const title = "Sanctu — A Catholic Liturgical Companion";
const description = "The Liturgy of the Hours, daily Mass readings, a bilingual Mass guide, Rosary, and Catholic prayers in a fast offline companion.";
const socialCard = "/social/sanctu-social-card.png";
const productionUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "Sanctu",
    locale: "en_US",
    title,
    description,
    url: "/",
    images: [
      {
        url: socialCard,
        width: 1200,
        height: 630,
        alt: "Sanctu, a Catholic liturgical companion, beside a Gothic stained-glass window",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialCard],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sanctu",
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
