import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import PWAInstaller from "@/components/PWAInstaller";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import "./print.css";

export const metadata: Metadata = {
  title: "Sanctus - Catholic Prayer App",
  description: "Daily Mass readings, Rosary, and essential Catholic prayers. Fast, offline-capable, and ad-free.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <body className="antialiased text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <PWAInstaller />
          <div className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
