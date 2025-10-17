import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, ExchangeRates, CurrencyInfo } from '@/types'

// Информация о поддерживаемых валютах
export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  PLN: {
    code: 'PLN',
    name: 'Polish Złoty',
    symbol: 'zł',
    flag: '🇵🇱'
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸'
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺'
  },
  UAH: {
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    symbol: '₴',
    flag: '🇺🇦'
  }
}

interface CurrencyState {
  // Текущая выбранная валюта
  selectedCurrency: Currency
  
  // Курсы валют относительно PLN
  exchangeRates: ExchangeRates
  
  // Когда последний раз обновлялись курсы
  lastUpdated: string | null
  
  // Загружаются ли курсы в данный момент
  isLoading: boolean
  
  // Ошибка при загрузке курсов
  error: string | null
  
  // Actions
  // eslint-disable-next-line no-unused-vars
  setSelectedCurrency: (currency: Currency) => void
  // eslint-disable-next-line no-unused-vars
  setExchangeRates: (rates: ExchangeRates, lastUpdated: string) => void
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void
  // eslint-disable-next-line no-unused-vars
  setError: (error: string | null) => void
  
  // Функция конвертации из PLN в выбранную валюту
  // eslint-disable-next-line no-unused-vars
  convertFromPLN: (amount: number) => number
  
  // Функция форматирования суммы в выбранной валюте
  // eslint-disable-next-line no-unused-vars
  formatAmount: (amount: number, showSymbol?: boolean) => string
  
  // Получить курс выбранной валюты
  getCurrentRate: () => number
  
  // Нужно ли обновить курсы (прошли сутки)
  shouldUpdateRates: () => boolean
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'PLN',
      exchangeRates: {
        USD: 1,
        EUR: 1,
        UAH: 1
      },
      lastUpdated: null,
      isLoading: false,
      error: null,
      
      setSelectedCurrency: (currency) => {
        set({ selectedCurrency: currency })
      },
      
      setExchangeRates: (rates, lastUpdated) => {
        set({ 
          exchangeRates: rates, 
          lastUpdated,
          error: null 
        })
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setError: (error) => {
        set({ error, isLoading: false })
      },
      
      convertFromPLN: (amount) => {
        const state = get()
        if (state.selectedCurrency === 'PLN') {
          return amount
        }
        
        const rate = state.exchangeRates[state.selectedCurrency]
        return amount * rate
      },
      
      formatAmount: (amount, showSymbol = true) => {
        const state = get()
        const currency = CURRENCIES[state.selectedCurrency]
        const convertedAmount = state.convertFromPLN(amount)
        
        const formatted = new Intl.NumberFormat('pl-PL', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(convertedAmount)
        
        if (!showSymbol) return formatted
        
        // Для PLN и UAH символ идет после числа
        if (state.selectedCurrency === 'PLN' || state.selectedCurrency === 'UAH') {
          return `${formatted} ${currency.symbol}`
        }
        
        // Для USD и EUR символ идет перед числом
        return `${currency.symbol}${formatted}`
      },
      
      getCurrentRate: () => {
        const state = get()
        if (state.selectedCurrency === 'PLN') return 1
        return state.exchangeRates[state.selectedCurrency]
      },
      
      shouldUpdateRates: () => {
        const state = get()
        if (!state.lastUpdated) return true
        
        const lastUpdate = new Date(state.lastUpdated)
        const now = new Date()
        const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
        
        // Обновляем если прошло больше 24 часов
        return hoursDiff >= 24
      }
    }),
    {
      name: 'currency-store',
      // Сохраняем все кроме isLoading и error
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        exchangeRates: state.exchangeRates,
        lastUpdated: state.lastUpdated
      })
    }
  )
)