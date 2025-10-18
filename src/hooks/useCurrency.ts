import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrencyStore } from '@/stores/currencyStore'
import type { ExchangeResponse } from '@/types'

// Хук для автоматического обновления курсов валют
export function useCurrencyUpdater() {
  const { 
    shouldUpdateRates, 
    setExchangeRates, 
    setLoading, 
    setError 
  } = useCurrencyStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<ExchangeResponse> => {
      const response = await fetch('/api/exchange')
      if (!response.ok) {
        throw new Error('Не удалось получить курсы валют')
      }
      return response.json()
    },
    enabled: shouldUpdateRates(),
    staleTime: 1000 * 60 * 60, // 1 час
    gcTime: 1000 * 60 * 60 * 24, // 24 часа
    refetchOnWindowFocus: false,
    retry: 2
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Ошибка загрузки курсов')
    }
  }, [error, setError])

  useEffect(() => {
    if (data) {
      setExchangeRates(data.rates, data.lastUpdated)
    }
  }, [data, setExchangeRates])
}

// Основной хук для работы с валютами
export function useCurrency() {
  const store = useCurrencyStore()
  
  // Автоматически обновляем курсы при необходимости
  useCurrencyUpdater()
  
  return {
    // Состояние
    selectedCurrency: store.selectedCurrency,
    exchangeRates: store.exchangeRates,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,
    
    // Действия
    setSelectedCurrency: store.setSelectedCurrency,
    
    // Утилиты
    convertFromPLN: store.convertFromPLN,
    formatAmount: store.formatAmount,
    formatAmountWhole: store.formatAmountWhole,
    getCurrentRate: store.getCurrentRate,
    shouldUpdateRates: store.shouldUpdateRates,
    
    // Дополнительные утилиты
    formatCurrency: (amount: number, options?: {
      showSymbol?: boolean
      convertFromPLN?: boolean
    }) => {
      const { showSymbol = true, convertFromPLN = true } = options || {}
      const finalAmount = convertFromPLN ? store.convertFromPLN(amount) : amount
      return store.formatAmount(finalAmount, showSymbol)
    },
    
    // Компактное форматирование больших сумм
    formatCurrencyCompact: (amount: number, showSymbol: boolean = true) => {
      const convertedAmount = store.convertFromPLN(amount)
      const currency = require('@/stores/currencyStore').CURRENCIES[store.selectedCurrency]
      
      let formattedNumber: string
      
      if (Math.abs(convertedAmount) >= 1000000) {
        formattedNumber = (convertedAmount / 1000000).toFixed(1) + 'M'
      } else if (Math.abs(convertedAmount) >= 1000) {
        formattedNumber = (convertedAmount / 1000).toFixed(1) + 'K'
      } else {
        formattedNumber = convertedAmount.toFixed(2)
      }
      
      if (!showSymbol) return formattedNumber
      
      // Для PLN и UAH символ идет после числа
      if (store.selectedCurrency === 'PLN' || store.selectedCurrency === 'UAH') {
        return `${formattedNumber} ${currency.symbol}`
      }
      
      // Для USD и EUR символ идет перед числом
      return `${currency.symbol}${formattedNumber}`
    },
    
    // Получить информацию о текущей валюте
    getCurrentCurrencyInfo: () => {
      const { CURRENCIES } = require('@/stores/currencyStore')
      return CURRENCIES[store.selectedCurrency]
    },
    
    // Принудительно обновить курсы
    forceUpdateRates: async () => {
      try {
        store.setLoading(true)
        const response = await fetch('/api/exchange?force=true')
        if (!response.ok) {
          throw new Error('Не удалось обновить курсы')
        }
        const data = await response.json()
        store.setExchangeRates(data.rates, data.lastUpdated)
      } catch (error) {
        store.setError(error instanceof Error ? error.message : 'Ошибка обновления курсов')
      }
    }
  }
}