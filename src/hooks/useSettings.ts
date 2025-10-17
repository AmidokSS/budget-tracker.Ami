'use client'

import { useState, useEffect } from 'react'

export interface ExchangeRates {
  USD: number
  EUR: number
  UAH: number
}

export interface Settings {
  fontSize: 'small' | 'medium' | 'large'
  baseCurrency: 'PLN'
  exchangeRates: ExchangeRates
  animations: 'full' | 'fast' | 'disabled'
  lastUpdated: number
}

const DEFAULT_SETTINGS: Settings = {
  fontSize: 'medium',
  baseCurrency: 'PLN',
  exchangeRates: {
    USD: 4.22,
    EUR: 4.55,
    UAH: 0.11
  },
  animations: 'full',
  lastUpdated: Date.now()
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка настроек из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('budget-settings')
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Сохранение настроек в localStorage
  const saveSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('budget-settings', JSON.stringify(updated))
    
    // Применяем настройки к DOM
    applySettings(updated)
  }

  // Применение настроек к интерфейсу
  const applySettings = (settingsToApply: Settings) => {
    // Размер шрифта
    document.documentElement.setAttribute('data-font-size', settingsToApply.fontSize)
    
    // Анимации
    document.documentElement.setAttribute('data-animations', settingsToApply.animations)
  }

  // Обновление курсов валют
  const updateExchangeRates = async (): Promise<{ success: boolean; fromCache?: boolean }> => {
    try {
      const response = await fetch('/api/exchange-rates')
      const data = await response.json()
      
      if (data.success) {
        saveSettings({ 
          exchangeRates: data.rates,
          lastUpdated: data.timestamp 
        })
        return { success: true, fromCache: data.source === 'fallback' }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Ошибка обновления курсов:', error)
      return { success: false }
    }
  }

  // Применяем настройки при загрузке
  useEffect(() => {
    if (!isLoading) {
      applySettings(settings)
    }
  }, [settings, isLoading])

  return {
    settings,
    isLoading,
    updateSetting: saveSettings,
    updateExchangeRates
  }
}