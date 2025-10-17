import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/providers'
import { DynamicGradientWrapper } from '@/components/DynamicGradientWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Бюджет-трекер | Управление финансами',
  description:
    'Современное приложение для управления личными финансами, категориями расходов, целями и лимитами',
  keywords: 'бюджет, финансы, трекер расходов, управление деньгами',
  authors: [{ name: 'Budget Tracker Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
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
