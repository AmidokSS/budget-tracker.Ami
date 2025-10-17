import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount)
}

export function formatCurrencyCompact(amount: number, isCompact: boolean = false): string {
  if (!isCompact) {
    return formatCurrency(amount)
  }

  const absAmount = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  
  if (absAmount >= 1000000) {
    return `${sign}${(absAmount / 1000000).toFixed(1)}M zł`
  } else if (absAmount >= 1000) {
    return `${sign}${(absAmount / 1000).toFixed(1)}K zł`
  } else {
    return `${sign}${absAmount.toFixed(0)} zł`
  }
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
