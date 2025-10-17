'use client'

import { createContext, useContext, useEffect } from 'react'
import { useSettings } from '@/hooks/useSettings'

const SettingsContext = createContext<ReturnType<typeof useSettings> | null>(null)

export const useGlobalSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useGlobalSettings must be used within SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useSettings()

  // Автоматически загружаем курсы валют при первом запуске
  useEffect(() => {
    const lastUpdated = settings.settings.lastUpdated
    const now = Date.now()
    const twelveHours = 12 * 60 * 60 * 1000

    // Если прошло больше 12 часов, обновляем курсы
    if (now - lastUpdated > twelveHours) {
      settings.updateExchangeRates()
    }
  }, [settings])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}