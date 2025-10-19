import { Limit } from '@/types'

/**
 * Проверяет, нужно ли сбросить лимит на основе его периода и даты последнего сброса
 */
export function shouldResetLimit(limit: Limit | { period: string; lastResetAt: Date | string }): boolean {
  const now = new Date()
  const lastReset = typeof limit.lastResetAt === 'string' ? new Date(limit.lastResetAt) : limit.lastResetAt
  
  if (limit.period === 'weekly') {
    // Сброс каждый понедельник
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeekStart = getWeekStart(now)
    const lastResetWeekStart = getWeekStart(lastReset)
    
    return currentWeekStart.getTime() > lastResetWeekStart.getTime()
  } else {
    // Сброс каждый месяц (1 число)
    const currentMonth = now.getFullYear() * 12 + now.getMonth()
    const lastResetMonth = lastReset.getFullYear() * 12 + lastReset.getMonth()
    
    return currentMonth > lastResetMonth
  }
}

/**
 * Получает дату начала недели (понедельник)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // корректировка если воскресенье
  return new Date(d.setDate(diff))
}

/**
 * Получает дату начала месяца
 */
function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Возвращает дату следующего сброса для лимита
 */
export function getNextResetDate(limit: Limit): Date {
  const lastReset = new Date(limit.lastResetAt)
  
  if (limit.period === 'weekly') {
    const nextMonday = getWeekStart(lastReset)
    nextMonday.setDate(nextMonday.getDate() + 7)
    return nextMonday
  } else {
    // Следующий месяц, 1 число
    const nextMonth = new Date(lastReset.getFullYear(), lastReset.getMonth() + 1, 1)
    return nextMonth
  }
}

/**
 * Возвращает количество дней до следующего сброса лимита
 */
export function getDaysUntilReset(limit: Limit): number {
  const now = new Date()
  const nextReset = getNextResetDate(limit)
  const diffTime = nextReset.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Возвращает текстовое описание периода лимита
 */
export function getPeriodLabel(period: 'monthly' | 'weekly'): string {
  return period === 'weekly' ? 'Еженедельно' : 'Ежемесячно'
}

/**
 * Возвращает прогресс лимита в процентах
 */
export function getLimitProgress(limit: Limit): number {
  if (limit.limitAmount === 0) return 0
  return Math.min((limit.currentAmount / limit.limitAmount) * 100, 100)
}

/**
 * Проверяет, превышен ли лимит
 */
export function isLimitExceeded(limit: Limit): boolean {
  return limit.currentAmount > limit.limitAmount
}

/**
 * Возвращает оставшуюся сумму лимита
 */
export function getRemainingAmount(limit: Limit): number {
  return Math.max(limit.limitAmount - limit.currentAmount, 0)
}

/**
 * Форматирует дату для отображения
 */
export function formatResetDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}