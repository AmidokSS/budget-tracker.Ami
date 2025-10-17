import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/providers'
import { DynamicGradientWrapper } from '@/components/DynamicGradientWrapper'

const inter = Inter({ subsets: ['latin'] })

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
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>
          <DynamicGradientWrapper>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
            </div>
          </DynamicGradientWrapper>
        </Providers>
      </body>
    </html>
  )
}
