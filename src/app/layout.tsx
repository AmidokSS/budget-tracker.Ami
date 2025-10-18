import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/providers'
import { DynamicGradientWrapper } from '@/components/DynamicGradientWrapper'
import { PerformanceProvider } from '@/hooks/usePerformance'

export const metadata: Metadata = {
  title: 'Budget Tracker | Управление финансами',
  description:
    'Современное PWA приложение для управления личными финансами, категориями расходов, целями и лимитами. Работает офлайн.',
  keywords: 'бюджет, финансы, трекер расходов, управление деньгами, PWA, офлайн',
  authors: [{ name: 'Budget Tracker Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Budget Tracker',
    startupImage: '/icon-72x72.svg',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Budget Tracker',
    title: 'Budget Tracker | Управление финансами',
    description: 'Современное PWA приложение для управления личными финансами',
  },
  twitter: {
    card: 'summary',
    title: 'Budget Tracker | Управление финансами',
    description: 'Современное PWA приложение для управления личными финансами',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-72x72.svg" />
        <meta property="og:title" content="Budget Tracker | Управление финансами" />
        <meta property="og:description" content="Современное PWA приложение для управления личными финансами" />
        <meta property="og:image" content="/icon-72x72.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Budget Tracker | Управление финансами" />
        <meta name="twitter:description" content="Современное PWA приложение для управления личными финансами" />
        <meta name="twitter:image" content="/icon-72x72.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Budget Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="background-color" content="#0f172a" />
      </head>
      <body
        className="min-h-screen bg-background text-foreground antialiased"
      >
        <Providers>
          <PerformanceProvider>
            <DynamicGradientWrapper>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 pb-20 md:pb-0">{children}</main>
              </div>
            </DynamicGradientWrapper>
          </PerformanceProvider>
        </Providers>
      </body>
    </html>
  )
}
