import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface MonthlyStats {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  operationsCount: number;
  previousBalance: number;
  finalBalance: number;
}

/**
 * GET /api/monthly-stats
 * Получить статистику по месяцам без изменения схемы БД
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';
    const months = parseInt(searchParams.get('months') || '12');

    // Получаем все операции пользователя
    const operations = await prisma.operation.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      }
    });

    if (operations.length === 0) {
      return NextResponse.json({
        currentMonth: {
          period: format(new Date(), 'yyyy-MM'),
          totalIncome: 0,
          totalExpense: 0,
          netBalance: 0,
          operationsCount: 0,
          previousBalance: 0,
          finalBalance: 0
        },
        monthlyStats: [],
        totalBalance: 0
      });
    }

    // Группируем операции по месяцам
    const monthlyGroups = new Map<string, typeof operations>();
    
    operations.forEach(operation => {
      const period = format(new Date(operation.date), 'yyyy-MM');
      if (!monthlyGroups.has(period)) {
        monthlyGroups.set(period, []);
      }
      monthlyGroups.get(period)!.push(operation);
    });

    // Сортируем периоды
    const periods = Array.from(monthlyGroups.keys()).sort();
    const monthlyStats: MonthlyStats[] = [];
    let runningBalance = 0;

    // Рассчитываем статистику для каждого месяца
    for (const period of periods) {
      const monthOperations = monthlyGroups.get(period)!;
      
      const totalIncome = monthOperations
        .filter(op => op.type === 'income')
        .reduce((sum, op) => sum + op.amount, 0);

      const totalExpense = monthOperations
        .filter(op => op.type === 'expense')
        .reduce((sum, op) => sum + op.amount, 0);

      const netBalance = totalIncome - totalExpense;
      const previousBalance = runningBalance;
      runningBalance += netBalance;

      monthlyStats.push({
        period,
        totalIncome,
        totalExpense,
        netBalance,
        operationsCount: monthOperations.length,
        previousBalance,
        finalBalance: runningBalance
      });
    }

    // Получаем текущий месяц
    const currentPeriod = format(new Date(), 'yyyy-MM');
    const currentMonth = monthlyStats.find(stat => stat.period === currentPeriod) || {
      period: currentPeriod,
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      operationsCount: 0,
      previousBalance: runningBalance,
      finalBalance: runningBalance
    };

    // Возвращаем последние N месяцев
    const recentStats = monthlyStats.slice(-months);

    return NextResponse.json({
      currentMonth,
      monthlyStats: recentStats,
      totalBalance: runningBalance,
      periodsCount: periods.length
    });

  } catch (error) {
    console.error('Ошибка при получении месячной статистики:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статистики' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/monthly-stats/simulate-reset
 * Симуляция месячного сброса (для демонстрации)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = '1' } = body;

    // Получаем операции текущего месяца
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    const currentMonthOperations = await prisma.operation.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    });

    // Рассчитываем баланс текущего месяца
    const totalIncome = currentMonthOperations
      .filter(op => op.type === 'income')
      .reduce((sum, op) => sum + op.amount, 0);

    const totalExpense = currentMonthOperations
      .filter(op => op.type === 'expense')
      .reduce((sum, op) => sum + op.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Получаем предыдущий баланс (сумма всех операций до текущего месяца)
    const previousOperations = await prisma.operation.findMany({
      where: {
        userId: userId,
        date: {
          lt: startDate
        }
      }
    });

    const previousIncome = previousOperations
      .filter(op => op.type === 'income')
      .reduce((sum, op) => sum + op.amount, 0);

    const previousExpense = previousOperations
      .filter(op => op.type === 'expense')
      .reduce((sum, op) => sum + op.amount, 0);

    const carryOverBalance = previousIncome - previousExpense;
    const finalBalance = carryOverBalance + netBalance;

    // Возвращаем результат симуляции
    return NextResponse.json({
      simulation: true,
      period: format(now, 'yyyy-MM'),
      currentMonth: {
        totalIncome,
        totalExpense,
        netBalance,
        operationsCount: currentMonthOperations.length,
        operations: currentMonthOperations
      },
      balances: {
        carryOverBalance,
        currentMonthBalance: netBalance,
        finalBalance
      },
      resetPreview: {
        operationsToArchive: currentMonthOperations.length,
        newStartingBalance: finalBalance,
        message: `После сброса баланс составит ${finalBalance.toLocaleString('ru-RU')} ₽`
      }
    });

  } catch (error) {
    console.error('Ошибка при симуляции сброса:', error);
    return NextResponse.json(
      { error: 'Ошибка при выполнении симуляции' },
      { status: 500 }
    );
  }
}