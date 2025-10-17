'use client'

import { useCurrency } from '@/hooks/useCurrency'

export function CurrencyInitializer() {
  // Хук автоматически обновляет курсы при необходимости
  useCurrency()
  
  return null // Невидимый компонент
}