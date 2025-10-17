import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    // Получаем операции с группировкой по пользователям и типам
    const operations = await prisma.operation.findMany({
      select: {
        userId: true,
        type: true,
        amount: true,
      },
    })

    // Рассчитываем статистику для каждого пользователя
    const usersWithStats = users.map(user => {
      const userOperations = operations.filter(op => op.userId === user.id)
      
      const income = userOperations
        .filter(op => op.type === 'income')
        .reduce((sum, op) => sum + op.amount, 0)
      
      const expense = userOperations
        .filter(op => op.type === 'expense')
        .reduce((sum, op) => sum + op.amount, 0)
      
      const balance = income - expense

      return {
        id: user.id,
        name: user.name,
        balance,
        income,
        expense,
      }
    })

    // Рассчитываем общую статистику
    const totalBalance = usersWithStats.reduce((sum, user) => sum + user.balance, 0)
    const totalIncome = usersWithStats.reduce((sum, user) => sum + user.income, 0)
    const totalExpense = usersWithStats.reduce((sum, user) => sum + user.expense, 0)

    return NextResponse.json({
      totalBalance,
      totalIncome,
      totalExpense,
      users: usersWithStats,
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}