import { Operation } from '@prisma/client';
import { format, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';

export interface MonthlyPeriod {
  period: string; // "YYYY-MM"
  startDate: Date;
  endDate: Date;
}

export interface MonthlyBalanceData {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  carryOverBalance: number;
  finalBalance: number;
  operationsCount: number;
}

export interface MonthlyResetResult {
  archivedOperations: number;
  newBalance: MonthlyBalanceData;
  carryOverBalance: number;
}

/**
 * Получить текущий месячный период
 */
export function getCurrentMonthlyPeriod(): MonthlyPeriod {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  
  return {
    period: format(now, 'yyyy-MM'),
    startDate,
    endDate
  };
}

/**
 * Получить месячный период по дате
 */
export function getMonthlyPeriodForDate(date: Date): MonthlyPeriod {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  
  return {
    period: format(date, 'yyyy-MM'),
    startDate,
    endDate
  };
}

/**
 * Проверить, нужно ли выполнить месячный сброс
 */
export function shouldPerformMonthlyReset(lastResetDate?: Date | null): boolean {
  if (!lastResetDate) return true;
  
  const currentPeriod = getCurrentMonthlyPeriod();
  const lastResetPeriod = getMonthlyPeriodForDate(lastResetDate);
  
  return currentPeriod.period !== lastResetPeriod.period;
}

/**
 * Рассчитать баланс для периода
 */
export function calculateMonthlyBalance(
  operations: Operation[],
  carryOverBalance: number = 0
): MonthlyBalanceData {
  const currentPeriod = getCurrentMonthlyPeriod();
  
  // Фильтруем операции для текущего периода
  const periodOperations = operations.filter(op => {
    const opDate = new Date(op.date);
    return isAfter(opDate, currentPeriod.startDate) || 
           (opDate >= currentPeriod.startDate && isBefore(opDate, currentPeriod.endDate)) ||
           opDate <= currentPeriod.endDate;
  });

  const totalIncome = periodOperations
    .filter(op => op.type === 'income')
    .reduce((sum, op) => sum + op.amount, 0);

  const totalExpense = periodOperations
    .filter(op => op.type === 'expense')
    .reduce((sum, op) => sum + op.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const finalBalance = carryOverBalance + netBalance;

  return {
    period: currentPeriod.period,
    totalIncome,
    totalExpense,
    netBalance,
    carryOverBalance,
    finalBalance,
    operationsCount: periodOperations.length
  };
}

/**
 * Получить список всех месячных периодов
 */
export function getMonthlyPeriods(startDate: Date, endDate: Date = new Date()): MonthlyPeriod[] {
  const periods: MonthlyPeriod[] = [];
  let currentDate = startOfMonth(startDate);
  const end = startOfMonth(endDate);

  while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
    periods.push(getMonthlyPeriodForDate(currentDate));
    
    // Переходим к следующему месяцу
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  return periods;
}

/**
 * Форматировать период для отображения
 */
export function formatPeriodForDisplay(period: string, locale: string = 'ru-RU'): string {
  const [year, month] = period.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long'
  }).format(date);
}

/**
 * Получить статистику по периодам
 */
export interface PeriodStats {
  totalPeriods: number;
  totalIncome: number;
  totalExpense: number;
  averageMonthlyIncome: number;
  averageMonthlyExpense: number;
  bestMonth: { period: string; balance: number } | null;
  worstMonth: { period: string; balance: number } | null;
}

export function calculatePeriodStats(balances: MonthlyBalanceData[]): PeriodStats {
  if (balances.length === 0) {
    return {
      totalPeriods: 0,
      totalIncome: 0,
      totalExpense: 0,
      averageMonthlyIncome: 0,
      averageMonthlyExpense: 0,
      bestMonth: null,
      worstMonth: null
    };
  }

  const totalIncome = balances.reduce((sum, b) => sum + b.totalIncome, 0);
  const totalExpense = balances.reduce((sum, b) => sum + b.totalExpense, 0);

  let bestMonth = balances[0];
  let worstMonth = balances[0];

  balances.forEach(balance => {
    if (balance.netBalance > bestMonth.netBalance) {
      bestMonth = balance;
    }
    if (balance.netBalance < worstMonth.netBalance) {
      worstMonth = balance;
    }
  });

  return {
    totalPeriods: balances.length,
    totalIncome,
    totalExpense,
    averageMonthlyIncome: totalIncome / balances.length,
    averageMonthlyExpense: totalExpense / balances.length,
    bestMonth: { period: bestMonth.period, balance: bestMonth.netBalance },
    worstMonth: { period: worstMonth.period, balance: worstMonth.netBalance }
  };
}