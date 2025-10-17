import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Получаем всех пользователей
    const users = await prisma.user.findMany();

    // Рассчитываем статистику для каждого пользователя используя aggregate
    const usersWithStats = await Promise.all(
      users.map(async user => {
        // Доходы пользователя
        const incomeStats = await prisma.operation.aggregate({
          where: {
            userId: user.id,
            type: 'income',
          },
          _sum: {
            amount: true,
          },
        });

        // Расходы пользователя
        const expenseStats = await prisma.operation.aggregate({
          where: {
            userId: user.id,
            type: 'expense',
          },
          _sum: {
            amount: true,
          },
        });

        const income = incomeStats._sum.amount || 0;
        const expense = expenseStats._sum.amount || 0;
        const balance = income - expense;

        return {
          id: user.id,
          name: user.name,
          income,
          expense,
          balance,
        };
      })
    );

    // Общая статистика
    const totalIncome = usersWithStats.reduce((sum, user) => sum + user.income, 0);
    const totalExpense = usersWithStats.reduce((sum, user) => sum + user.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    return NextResponse.json({
      users: usersWithStats,
      total: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalBalance,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}