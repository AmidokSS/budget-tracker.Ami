import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { 
  formatCurrencyPrecise, 
  formatCurrencyWhole as formatCurrencyWholeUtil, 
  type CurrencyCode 
} from './currencyUtils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Обновленные функции с точными вычислениями
export function formatCurrency(
  amount: number, 
  currencyCode: CurrencyCode = 'PLN'
): string {
  return formatCurrencyPrecise(amount, currencyCode, { showSymbol: true })
}

export function formatCurrencyCompact(
  amount: number, 
  isCompact: boolean = false,
  currencyCode: CurrencyCode = 'PLN'
): string {
  if (!isCompact) {
    return formatCurrency(amount, currencyCode)
  }

  return formatCurrencyPrecise(amount, currencyCode, { 
    showSymbol: true, 
    compact: true 
  })
}

// Дополнительные утилиты форматирования
export function formatCurrencyWithoutSymbol(
  amount: number,
  currencyCode: CurrencyCode = 'PLN'
): string {
  return formatCurrencyPrecise(amount, currencyCode, { showSymbol: false })
}

export function formatCurrencyWhole(
  amount: number,
  currencyCode: CurrencyCode = 'PLN'
): string {
  return formatCurrencyWholeUtil(amount, currencyCode, true)
}

export function getPageGradient(pathname: string): string {
  const gradients: Record<string, string> = {
    '/': 'from-indigo-900 via-purple-900 to-indigo-800',
    '/categories': 'from-emerald-900 via-green-800 to-emerald-700',
    '/goals': 'from-cyan-900 via-blue-900 to-cyan-800',
    '/limits': 'from-amber-900 via-orange-800 to-amber-700',
    '/operations': 'from-rose-900 via-red-900 to-rose-800',
    '/analytics': 'from-slate-900 via-indigo-900 to-slate-800',
    '/settings': 'from-gray-900 via-slate-800 to-gray-700',
  }
  
  return gradients[pathname] || gradients['/']
}
