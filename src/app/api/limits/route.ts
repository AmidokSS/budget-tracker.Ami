import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shouldResetLimit } from '@/lib/limitUtils'

export async function GET() {
  try {
    const limits = await prisma.limit.findMany({
      where: { active: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Проверяем и сбрасываем лимиты, если необходимо
    const limitsToReset = limits.filter(limit => 
      shouldResetLimit({ period: limit.period, lastResetAt: limit.lastResetAt })
    )
    
    if (limitsToReset.length > 0) {
      await Promise.all(
        limitsToReset.map(limit =>
          prisma.limit.update({
            where: { id: limit.id },
            data: {
              currentAmount: 0,
              lastResetAt: new Date(),
            },
          })
        )
      )
      
      // Получаем обновленные лимиты
      const updatedLimits = await prisma.limit.findMany({
        where: { active: true },
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      
      return NextResponse.json(updatedLimits)
    }

    return NextResponse.json(limits)
  } catch (error) {
    console.error('Error fetching limits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch limits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, limitAmount, period = 'monthly' } = body

    if (!categoryId || !limitAmount) {
      return NextResponse.json(
        { error: 'Category ID and limit amount are required' },
        { status: 400 }
      )
    }

    if (!['monthly', 'weekly'].includes(period)) {
      return NextResponse.json(
        { error: 'Period must be either "monthly" or "weekly"' },
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

    // Проверяем, что лимит устанавливается только для расходов
    if (category.type !== 'expense') {
      return NextResponse.json(
        { error: 'Limits can only be set for expense categories' },
        { status: 400 }
      )
    }

    // Проверяем, нет ли уже активного лимита для этой категории
    const existingLimit = await prisma.limit.findFirst({
      where: {
        categoryId,
        active: true,
      },
    })

    if (existingLimit) {
      return NextResponse.json(
        { error: 'Active limit already exists for this category' },
        { status: 409 }
      )
    }

    const limit = await prisma.limit.create({
      data: {
        categoryId,
        limitAmount: parseFloat(limitAmount),
        period,
        lastResetAt: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(limit, { status: 201 })
  } catch (error) {
    console.error('Error creating limit:', error)
    return NextResponse.json(
      { error: 'Failed to create limit' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, limitAmount, period } = body

    if (!id || !limitAmount) {
      return NextResponse.json(
        { error: 'Limit ID and amount are required' },
        { status: 400 }
      )
    }

    if (period && !['monthly', 'weekly'].includes(period)) {
      return NextResponse.json(
        { error: 'Period must be either "monthly" or "weekly"' },
        { status: 400 }
      )
    }

    const updateData: any = {
      limitAmount: parseFloat(limitAmount),
    }

    // Если изменяется период, сбрасываем текущую сумму и дату последнего сброса
    if (period) {
      updateData.period = period
      updateData.currentAmount = 0
      updateData.lastResetAt = new Date()
    }

    const limit = await prisma.limit.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(limit)
  } catch (error) {
    console.error('Error updating limit:', error)
    return NextResponse.json(
      { error: 'Failed to update limit' },
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
        { error: 'Limit ID is required' },
        { status: 400 }
      )
    }

    await prisma.limit.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Limit deleted successfully' })
  } catch (error) {
    console.error('Error deleting limit:', error)
    return NextResponse.json(
      { error: 'Failed to delete limit' },
      { status: 500 }
    )
  }
}