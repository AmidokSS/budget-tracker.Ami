import { NextResponse } from 'next/server'

interface ExchangeRates {
  USD: number
  EUR: number
  UAH: number
}

const FALLBACK_RATES: ExchangeRates = {
  USD: 4.22,
  EUR: 4.55,
  UAH: 0.11
}

export async function GET() {
  try {
    // Пробуем получить курсы с API
    const response = await fetch('https://api.exchangerate.host/latest?base=PLN&symbols=USD,EUR,UAH', {
      next: { revalidate: 43200 } // 12 часов
    })

    if (!response.ok) {
      throw new Error('API недоступно')
    }

    const data = await response.json()
    
    if (!data.success || !data.rates) {
      throw new Error('Некорректный ответ API')
    }

    const rates: ExchangeRates = {
      USD: 1 / (data.rates.USD || FALLBACK_RATES.USD),
      EUR: 1 / (data.rates.EUR || FALLBACK_RATES.EUR),
      UAH: 1 / (data.rates.UAH || FALLBACK_RATES.UAH)
    }

    return NextResponse.json({
      success: true,
      rates,
      timestamp: Date.now(),
      source: 'api'
    })
  } catch (error) {
    console.error('Ошибка получения курсов валют:', error)
    
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      timestamp: Date.now(),
      source: 'fallback',
      message: 'Данные из кеша'
    })
  }
}