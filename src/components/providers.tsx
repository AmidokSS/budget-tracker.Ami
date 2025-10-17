'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'
import { SettingsProvider } from './SettingsProvider'
import { CurrencyInitializer } from '@/components/CurrencyInitializer'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <CurrencyInitializer />
        {children}
      </SettingsProvider>
    </QueryClientProvider>
  )
}
