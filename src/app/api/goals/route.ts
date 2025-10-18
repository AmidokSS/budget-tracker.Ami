import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
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
    const { id, title, targetAmount, deadline, emoji, currentAmount, archived, addAmount } = body

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

    // Пополнение цели
    if (addAmount !== undefined) {
      const currentGoal = await prisma.goal.findUnique({ where: { id } })
      if (currentGoal) {
        updateData.currentAmount = currentGoal.currentAmount + parseFloat(addAmount)
      }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    })

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