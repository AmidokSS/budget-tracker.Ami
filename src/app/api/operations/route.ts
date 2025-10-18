import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateRanges } from '@/lib/dateUtils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const period = searchParams.get('period')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: {
      categoryId?: string
      type?: string
      userId?: string
      date?: {
        gte?: Date
        lte?: Date
      }
    } = {}
    if (categoryId) where.categoryId = categoryId
    if (type) where.type = type
    if (userId) where.userId = userId

    // Фильтр по периоду
    if (period && period !== 'all') {
      const { startDate, endDate } = getDateRanges(period)
      
      if (startDate && endDate) {
        where.date = {
          gte: startDate,
          lte: endDate
        }
      } else if (startDate) {
        where.date = { gte: startDate }
      }
    }

    const operations = await prisma.operation.findMany({
      where,
      include: {
        category: true,
        user: true,
      },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json(operations)
  } catch (error) {
    console.error('Error fetching operations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch operations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, categoryId, type, note, userId } = body

    if (!amount || !categoryId || !type) {
      return NextResponse.json(
        { error: 'Amount, categoryId, and type are required' },
        { status: 400 }
      )
    }

    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    if (category.type !== type) {
      return NextResponse.json(
        { error: 'Operation type must match category type' },
        { status: 400 }
      )
    }

    const operation = await prisma.operation.create({
      data: {
        userId: userId || 'artur', // Используем переданного пользователя или Артура по умолчанию
        amount: parseFloat(amount),
        categoryId,
        type,
        note,
        date: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(operation, { status: 201 })
  } catch (error) {
    console.error('Error creating operation:', error)
    return NextResponse.json(
      { error: 'Failed to create operation' },
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
        { error: 'Operation ID is required' },
        { status: 400 }
      )
    }

    // Получаем операцию перед удалением для пересчета балансов
    const operation = await prisma.operation.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
      },
    })

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation not found' },
        { status: 404 }
      )
    }

    // Удаляем операцию
    await prisma.operation.delete({
      where: { id },
    })

    // Пересчитываем лимиты для expense операций
    if (operation.type === 'expense') {
      // Находим лимит для этой категории и уменьшаем потраченную сумму
      const limit = await prisma.limit.findFirst({
        where: { 
          categoryId: operation.categoryId,
          active: true 
        },
      })

      if (limit) {
        const { subtractAmounts } = await import('@/lib/currencyUtils')
        const newAmount = subtractAmounts(limit.currentAmount, operation.amount)
        
        await prisma.limit.update({
          where: { id: limit.id },
          data: {
            currentAmount: Math.max(0, newAmount.value),
          },
        })
      }
    }

    // Operation deleted successfully

    return NextResponse.json({ 
      message: 'Operation deleted successfully',
      deletedOperation: {
        id: operation.id,
        type: operation.type,
        amount: operation.amount,
        categoryName: operation.category?.name,
        userName: operation.user?.name,
      }
    })
  } catch (error) {
    console.error('Error deleting operation:', error)
    return NextResponse.json(
      { error: 'Failed to delete operation' },
      { status: 500 }
    )
  }
}