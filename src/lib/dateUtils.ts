import { 
  format, 
  formatDistanceToNow, 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  subDays, 
  startOfDay,
  isToday,
  isYesterday,
  isTomorrow,
  differenceInDays,
  parseISO,
  addDays,
  addMonths,
  isSameDay,
  isSameMonth
} from 'date-fns'
import { ru } from 'date-fns/locale'

// Базовые функции форматирования дат
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd.MM.yyyy', { locale: ru })
}

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru })
}

export const formatShortDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'd MMM', { locale: ru })
}

export const formatMonthYear = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'LLLL yyyy', { locale: ru })
}

// Умное форматирование относительного времени
export const formatRelativeTime = (date: Date | string) => {
  if (!date) return 'Никогда'
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return `Сегодня в ${format(dateObj, 'HH:mm', { locale: ru })}`
  }
  
  if (isYesterday(dateObj)) {
    return `Вчера в ${format(dateObj, 'HH:mm', { locale: ru })}`
  }
  
  // Для дат в пределах недели показываем относительное время
  const daysDiff = Math.abs(differenceInDays(new Date(), dateObj))
  if (daysDiff <= 7) {
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: ru 
    })
  }
  
  // Для более старых дат показываем полную дату
  return formatDate(dateObj)
}

// Форматирование для дедлайнов (используется в GoalCard)
export const formatDeadline = (deadline: Date | string | null) => {
  if (!deadline) return 'Без срока'
  
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline
  const now = new Date()
  const diffDays = differenceInDays(deadlineDate, now)
  
  if (diffDays < 0) return 'Просрочено'
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Завтра'
  if (diffDays < 7) return `${diffDays} дн.`
  if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7)
    return `${weeks} нед.`
  }
  if (diffDays < 365) {
    const months = Math.ceil(diffDays / 30)
    return `${months} мес.`
  }
  
  return formatDate(deadlineDate)
}

// Утилиты для API запросов (заменят ручные вычисления)
export const getDateRanges = (period: string) => {
  const now = new Date()
  
  switch (period) {
    case 'current_month':
      return {
        startDate: startOfMonth(now),
        endDate: now
      }
    case 'last_month':
      const lastMonth = subMonths(now, 1)
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      }
    case 'last_7_days':
      return {
        startDate: startOfDay(subDays(now, 7)),
        endDate: now
      }
    case 'last_30_days':
      return {
        startDate: startOfDay(subDays(now, 30)),
        endDate: now
      }
    case 'current_year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now
      }
    default:
      return {
        startDate: null,
        endDate: null
      }
  }
}

// Утилиты для графиков (заменят toLocaleDateString)
export const formatChartDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'd MMM', { locale: ru })
}

export const formatChartMonth = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM yyyy', { locale: ru })
}

// Проверки дат
export const isDateToday = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isToday(dateObj)
}

export const isDateThisMonth = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isSameMonth(dateObj, new Date())
}

// Утилиты для валидации дат в формах
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const parseStringToDate = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString)
    return isValidDate(date) ? date : null
  } catch {
    return null
  }
}

// Константы для использования в интерфейсе
export const DATE_FORMATS = {
  display: 'dd.MM.yyyy',
  input: 'yyyy-MM-dd',
  chart: 'd MMM',
  full: 'dd MMMM yyyy',
  time: 'HH:mm',
  datetime: 'dd.MM.yyyy HH:mm'
} as const