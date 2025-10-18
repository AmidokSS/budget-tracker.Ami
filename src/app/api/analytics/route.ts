import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateRanges } from '@/lib/dateUtils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'current_month'

    // Определяем диапазон дат
    const { startDate, endDate } = getDateRanges(period)
    
    // Для случая 'all' используем очень старую дату
    const finalStartDate = startDate || new Date(2020, 0, 1)
    const finalEndDate = endDate || new Date()

    // Базовые условия запроса
    const whereCondition: any = {
      createdAt: {
        gte: finalStartDate,
        lte: finalEndDate
      }
    }

    if (userId && userId !== 'all') {
      whereCondition.userId = userId
    }

    // 1. Общая статистика
    const operations = await prisma.operation.findMany({
      where: whereCondition,
      include: {
        category: true,
        user: true
      }
    })

    const totalIncome = operations
      .filter(op => op.type === 'income')
      .reduce((sum, op) => sum + op.amount, 0)

    const totalExpense = operations
      .filter(op => op.type === 'expense')
      .reduce((sum, op) => sum + op.amount, 0)

    const balance = totalIncome - totalExpense

    // 2. Распределение расходов по категориям
    const expensesByCategory = operations
      .filter(op => op.type === 'expense')
      .reduce((acc: any, op) => {
        const categoryId = op.categoryId
        if (!acc[categoryId]) {
          acc[categoryId] = {
            name: op.category?.name || 'Неизвестно',
            emoji: op.category?.emoji || '💰',
            amount: 0,
            count: 0
          }
        }
        acc[categoryId].amount += op.amount
        acc[categoryId].count += 1
        return acc
      }, {})

    const categoryData = Object.values(expensesByCategory).map((cat: any) => ({
      ...cat,
      percentage: totalExpense > 0 ? (cat.amount / totalExpense * 100) : 0
    }))

    // 3. Динамика по дням
    const dailyData = operations.reduce((acc: any, op) => {
      const date = op.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 }
      }
      if (op.type === 'income') {
        acc[date].income += op.amount
      } else {
        acc[date].expense += op.amount
      }
      return acc
    }, {})

    const timelineData = Object.values(dailyData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // 4. Средний расход в день
    const daysCount = Math.max(1, Math.ceil((finalEndDate.getTime() - finalStartDate.getTime()) / (1000 * 60 * 60 * 24)))
    const avgDailyExpense = totalExpense / daysCount

    // 5. Лимиты
    const limits = await prisma.limit.findMany({
      where: {
        active: true,
        ...(userId && userId !== 'all' ? {
          category: {
            // Можно добавить фильтрацию по пользователю если нужно
          }
        } : {})
      },
      include: {
        category: true
      }
    })

    const limitsWithProgress = limits.map(limit => {
      const categoryExpenses = operations
        .filter(op => op.type === 'expense' && op.categoryId === limit.categoryId)
        .reduce((sum, op) => sum + op.amount, 0)

      const progress = limit.limitAmount > 0 ? (categoryExpenses / limit.limitAmount * 100) : 0

      return {
        id: limit.id,
        categoryName: limit.category?.name || 'Неизвестно',
        categoryEmoji: limit.category?.emoji || '💰',
        limitAmount: limit.limitAmount,
        currentAmount: categoryExpenses,
        progress: Math.min(progress, 100),
        isOverLimit: progress > 100,
        isAutoCreated: limit.isAutoCreated
      }
    })

    // 6. Цели
    const goals = await prisma.goal.findMany({
      where: userId && userId !== 'all' ? {} : {} // Можно добавить фильтрацию
    })

    const activeGoals = goals.filter(goal => !goal.archived)
    const completedGoals = activeGoals.filter(goal => goal.currentAmount >= goal.targetAmount)
    const goalsCompletionRate = activeGoals.length > 0 ? 
      (completedGoals.length / activeGoals.length * 100) : 0

    // 7. Топ категории расходов
    const topCategories = categoryData
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 5)

    const analytics = {
      // Общая статистика
      summary: {
        totalIncome,
        totalExpense,
        balance,
        avgDailyExpense,
        operationsCount: operations.length,
        period: period
      },

      // Данные для графиков
      categoryDistribution: categoryData,
      timeline: timelineData,
      topCategories,

      // Лимиты и цели
      limits: limitsWithProgress,
      goals: {
        total: activeGoals.length,
        completed: completedGoals.length,
        completionRate: goalsCompletionRate,
        archived: goals.filter(g => g.archived).length
      },

      // Дополнительная аналитика
      insights: {
        mostExpensiveCategory: categoryData.reduce((max: any, cat: any) => 
          cat.amount > (max?.amount || 0) ? cat : max, null
        ),
        avgTransactionAmount: operations.length > 0 ? 
          (totalIncome + totalExpense) / operations.length : 0,
        incomeVsExpenseRatio: totalExpense > 0 ? (totalIncome / totalExpense) : 0
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Ошибка получения аналитики:', error)
    return NextResponse.json(
      { error: 'Ошибка получения аналитики' },
      { status: 500 }
    )
  }
}