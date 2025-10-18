import currency from 'currency.js'

// Настройки валют с их символами и точностью
const CURRENCY_CONFIGS = {
  PLN: { symbol: 'zł', precision: 2 },
  USD: { symbol: '$', precision: 2 },
  EUR: { symbol: '€', precision: 2 },
  UAH: { symbol: '₴', precision: 2 }
} as const

type CurrencyCode = keyof typeof CURRENCY_CONFIGS

// Создание объекта валюты с правильными настройками
export const createCurrency = (value: number, currencyCode: CurrencyCode = 'PLN') => {
  const config = CURRENCY_CONFIGS[currencyCode]
  
  return currency(value, {
    symbol: config.symbol,
    precision: config.precision,
    separator: ' ',
    decimal: ','
  })
}

// Точные математические операции
export const addAmounts = (amount1: number, amount2: number, currencyCode: CurrencyCode = 'PLN') => {
  const curr1 = createCurrency(amount1, currencyCode)
  const curr2 = createCurrency(amount2, currencyCode)
  return curr1.add(curr2)
}

export const subtractAmounts = (amount1: number, amount2: number, currencyCode: CurrencyCode = 'PLN') => {
  const curr1 = createCurrency(amount1, currencyCode)
  const curr2 = createCurrency(amount2, currencyCode)
  return curr1.subtract(curr2)
}

export const multiplyAmount = (amount: number, multiplier: number, currencyCode: CurrencyCode = 'PLN') => {
  const curr = createCurrency(amount, currencyCode)
  return curr.multiply(multiplier)
}

export const divideAmount = (amount: number, divisor: number, currencyCode: CurrencyCode = 'PLN') => {
  const curr = createCurrency(amount, currencyCode)
  return curr.divide(divisor)
}

// Форматирование для отображения
export const formatCurrencyPrecise = (
  amount: number, 
  currencyCode: CurrencyCode = 'PLN',
  options: {
    showSymbol?: boolean
    compact?: boolean
    precision?: number
  } = {}
) => {
  const { showSymbol = true, compact = false, precision } = options
  const config = CURRENCY_CONFIGS[currencyCode]
  
  const curr = currency(amount, {
    precision: precision ?? config.precision,
    separator: ' ',
    decimal: ',',
  })

  if (compact) {
    const value = curr.value
    
    if (Math.abs(value) >= 1000000) {
      const compactCurr = curr.divide(1000000)
      const formatted = compactCurr.format({ precision: 1 })
      return showSymbol ? `${formatted}M ${config.symbol}` : `${formatted}M`
    } else if (Math.abs(value) >= 1000) {
      const compactCurr = curr.divide(1000)
      const formatted = compactCurr.format({ precision: 1 })
      return showSymbol ? `${formatted}K ${config.symbol}` : `${formatted}K`
    }
  }

  if (!showSymbol) {
    return curr.format({ symbol: '' }).trim()
  }

  // Для PLN и UAH символ после числа
  if (currencyCode === 'PLN' || currencyCode === 'UAH') {
    return `${curr.format({ symbol: '' })} ${config.symbol}`
  }
  
  // Для USD и EUR символ перед числом
  return `${config.symbol}${curr.format({ symbol: '' })}`
}

// Форматирование целых чисел (для лимитов)
export const formatCurrencyWhole = (
  amount: number, 
  currencyCode: CurrencyCode = 'PLN',
  showSymbol: boolean = true
) => {
  return formatCurrencyPrecise(amount, currencyCode, {
    showSymbol,
    precision: 0
  })
}

// Конвертация валют с точными вычислениями
export const convertCurrency = (
  amount: number,
  rate: number,
  fromCurrency: CurrencyCode = 'PLN',
  toCurrency: CurrencyCode = 'PLN'
) => {
  const sourceCurr = createCurrency(amount, fromCurrency)
  const converted = sourceCurr.multiply(rate)
  
  // Пересоздаем с настройками целевой валюты
  return createCurrency(converted.value, toCurrency)
}

// Вычисление процентов с точностью
export const calculatePercentage = (
  current: number,
  total: number,
  currencyCode: CurrencyCode = 'PLN'
) => {
  if (total === 0) return 0
  
  const currentCurr = createCurrency(current, currencyCode)
  const totalCurr = createCurrency(total, currencyCode)
  
  return currentCurr.divide(totalCurr).multiply(100).value
}

// Утилиты для агрегации (суммы, средние значения)
export const sumAmounts = (amounts: number[], currencyCode: CurrencyCode = 'PLN') => {
  return amounts.reduce((acc, amount) => {
    return acc.add(createCurrency(amount, currencyCode))
  }, createCurrency(0, currencyCode))
}

export const averageAmount = (amounts: number[], currencyCode: CurrencyCode = 'PLN') => {
  if (amounts.length === 0) return createCurrency(0, currencyCode)
  
  const sum = sumAmounts(amounts, currencyCode)
  return sum.divide(amounts.length)
}

// Проверки
export const isPositiveAmount = (amount: number) => {
  return createCurrency(amount).value > 0
}

export const isZeroAmount = (amount: number, tolerance: number = 0.01) => {
  return Math.abs(createCurrency(amount).value) < tolerance
}

export const compareAmounts = (amount1: number, amount2: number, currencyCode: CurrencyCode = 'PLN') => {
  const curr1 = createCurrency(amount1, currencyCode)
  const curr2 = createCurrency(amount2, currencyCode)
  
  if (curr1.value > curr2.value) return 1
  if (curr1.value < curr2.value) return -1
  return 0
}

// Экспорт типов для использования в других файлах
export type { CurrencyCode }
export type CurrencyInstance = ReturnType<typeof createCurrency>