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
            staleTime: 0, // Данные сразу считаются устаревшими
            refetchOnWindowFocus: true, // Обновлять при фокусе на окне
            refetchOnReconnect: true, // Обновлять при восстановлении соединения
            refetchIntervalInBackground: false, // Не обновлять в фоне
            retry: 3, // Повторять неудачные запросы 3 раза
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
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
