import { NextRequest, NextResponse } from 'next/server'
import type { ExchangeResponse } from '@/types'

// Кеш курсов валют
let cachedRates: ExchangeResponse | null = null
let lastFetch: Date | null = null

// Проверяем, нужно ли обновить кеш (прошло больше часа)
function shouldUpdateCache(): boolean {
  if (!cachedRates || !lastFetch) return true
  
  const hoursSinceUpdate = (Date.now() - lastFetch.getTime()) / (1000 * 60 * 60)
  return hoursSinceUpdate >= 1 // Обновляем каждый час для свежести данных
}

async function fetchExchangeRates(): Promise<ExchangeResponse> {
  try {
    // Используем Frankfurter API для получения курсов относительно PLN
    const response = await fetch('https://api.frankfurter.app/latest?from=PLN&to=USD,EUR,UAH')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    const result: ExchangeResponse = {
      rates: {
        USD: data.rates.USD || 0.25, // Запасное значение
        EUR: data.rates.EUR || 0.23, // Запасное значение  
        UAH: data.rates.UAH || 10.5   // Запасное значение
      },
      lastUpdated: new Date().toISOString(),
      baseCurrency: 'PLN'
    }
    
    // Кешируем результат
    cachedRates = result
    lastFetch = new Date()
    
    return result
    
  } catch (error) {
    console.error('Ошибка получения курсов валют:', error)
    
    // Если есть кешированные данные, возвращаем их
    if (cachedRates) {
      return cachedRates
    }
    
    // Иначе возвращаем запасные курсы
    const fallbackRates: ExchangeResponse = {
      rates: {
        USD: 0.25,  // 1 PLN ≈ 0.25 USD
        EUR: 0.23,  // 1 PLN ≈ 0.23 EUR
        UAH: 10.5   // 1 PLN ≈ 10.5 UAH
      },
      lastUpdated: new Date().toISOString(),
      baseCurrency: 'PLN'
    }
    
    cachedRates = fallbackRates
    lastFetch = new Date()
    
    return fallbackRates
  }
}

export async function GET(request: NextRequest) {
  try {
    // Проверяем параметр force для принудительного обновления
    const { searchParams } = new URL(request.url)
    const forceUpdate = searchParams.get('force') === 'true'
    
    // Если нужно обновить кеш или принудительное обновление
    if (shouldUpdateCache() || forceUpdate) {
      const rates = await fetchExchangeRates()
      return NextResponse.json(rates)
    }
    
    // Возвращаем кешированные данные
    if (cachedRates) {
      return NextResponse.json(cachedRates)
    }
    
    // Если кеша нет, получаем новые данные
    const rates = await fetchExchangeRates()
    return NextResponse.json(rates)
    
  } catch (error) {
    console.error('Ошибка в API exchange rates:', error)
    
    return NextResponse.json(
      { 
        error: 'Не удалось получить курсы валют',
        rates: {
          USD: 0.25,
          EUR: 0.23, 
          UAH: 10.5
        },
        lastUpdated: new Date().toISOString(),
        baseCurrency: 'PLN'
      },
      { status: 200 } // Возвращаем 200 с запасными данными
    )
  }
}