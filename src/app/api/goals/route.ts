import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        archived: false  // Показываем только неархивированные цели
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, targetAmount, deadline, emoji } = body

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: 'Title and target amount are required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
        emoji: emoji || '💰',
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, targetAmount, deadline, emoji, currentAmount, archived, addAmount, withdrawAmount, userId = '1' } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    const updateData: {
      title?: string
      targetAmount?: number
      deadline?: Date | null
      emoji?: string
      currentAmount?: number
      archived?: boolean
    } = {}

    // Обновление основных полей
    if (title !== undefined) updateData.title = title
    if (targetAmount !== undefined) updateData.targetAmount = parseFloat(targetAmount)
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null
    if (emoji !== undefined) updateData.emoji = emoji
    if (currentAmount !== undefined) updateData.currentAmount = parseFloat(currentAmount)
    if (archived !== undefined) updateData.archived = archived

    let goal;

    // Пополнение цели с созданием операции расхода
    if (addAmount !== undefined) {
      const { addAmounts } = await import('@/lib/currencyUtils')
      const currentGoal = await prisma.goal.findUnique({ where: { id } })
      if (!currentGoal) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }

      const amount = parseFloat(addAmount)
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }

      const newGoalAmount = addAmounts(currentGoal.currentAmount, amount)
      updateData.currentAmount = newGoalAmount.value

      // Выполняем транзакцию: обновляем цель + создаем операцию расхода
      const result = await prisma.$transaction(async (tx) => {
        // Обновляем цель
        const updatedGoal = await tx.goal.update({
          where: { id },
          data: updateData,
        })

        // Находим или создаем категорию "Цели"
        let goalsCategory = await tx.category.findFirst({
          where: { name: 'Цели', type: 'expense' }
        })

        if (!goalsCategory) {
          goalsCategory = await tx.category.create({
            data: {
              name: 'Цели',
              type: 'expense',
              emoji: '🎯'
            }
          })
        }

        // Создаем операцию расхода
        await tx.operation.create({
          data: {
            userId: userId,
            categoryId: goalsCategory.id,
            type: 'expense',
            amount: amount,
            note: `Пополнение цели: ${currentGoal.title}`,
            date: new Date()
          }
        })

        return updatedGoal
      })

      goal = result
    }
    // Снятие средств с цели с созданием операции дохода
    else if (withdrawAmount !== undefined) {
      const currentGoal = await prisma.goal.findUnique({ where: { id } })
      if (!currentGoal) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }

      const amount = parseFloat(withdrawAmount)
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }

      if (amount > currentGoal.currentAmount) {
        return NextResponse.json({ error: 'Insufficient funds in goal' }, { status: 400 })
      }

      const { subtractAmounts } = await import('@/lib/currencyUtils')
      const newGoalAmount = subtractAmounts(currentGoal.currentAmount, amount)
      updateData.currentAmount = newGoalAmount.value

      // Выполняем транзакцию: обновляем цель + создаем операцию дохода
      const result = await prisma.$transaction(async (tx) => {
        // Обновляем цель
        const updatedGoal = await tx.goal.update({
          where: { id },
          data: updateData,
        })

        // Находим или создаем категорию "Цели (возврат)"
        let goalsReturnCategory = await tx.category.findFirst({
          where: { name: 'Цели (возврат)', type: 'income' }
        })

        if (!goalsReturnCategory) {
          goalsReturnCategory = await tx.category.create({
            data: {
              name: 'Цели (возврат)',
              type: 'income',
              emoji: '💰'
            }
          })
        }

        // Создаем операцию дохода
        await tx.operation.create({
          data: {
            userId: userId,
            categoryId: goalsReturnCategory.id,
            type: 'income',
            amount: amount,
            note: `Снятие средств с цели: ${currentGoal.title}`,
            date: new Date()
          }
        })

        return updatedGoal
      })

      goal = result
    }
    // Обычное обновление без операций
    else {
      goal = await prisma.goal.update({
        where: { id },
        data: updateData,
      })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    await prisma.goal.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}