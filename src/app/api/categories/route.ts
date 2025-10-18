import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Константы для автоматического создания лимитов
const DEFAULT_LIMIT_AMOUNT = 10000

// Функция для автоматического создания лимита для категории expense
async function createAutoLimitForCategory(categoryId: string, categoryName: string) {
  try {
    // Проверяем, не существует ли уже лимит для этой категории
    const existingLimit = await prisma.limit.findFirst({
      where: { categoryId }
    })

    if (existingLimit) {
      // Limit already exists for this category
      return existingLimit
    }

    // Создаем новый лимит
    const newLimit = await prisma.limit.create({
      data: {
        categoryId,
        limitAmount: DEFAULT_LIMIT_AMOUNT,
        currentAmount: 0,
        active: true,
        isAutoCreated: true,
      }
    })

    // Auto limit created successfully
    return newLimit
  } catch (error) {
    console.error(`Ошибка создания автоматического лимита для категории "${categoryName}":`, error)
    return null
  }
}

// Функция для удаления лимита при изменении типа категории с expense на income
async function deleteAutoLimitForCategory(categoryId: string, categoryName: string) {
  try {
    const deletedLimit = await prisma.limit.deleteMany({
      where: { categoryId }
    })

    if (deletedLimit.count > 0) {
      // Auto limit deleted successfully
    }
    return deletedLimit
  } catch (error) {
    console.error(`Ошибка удаления автоматического лимита для категории "${categoryName}":`, error)
    return null
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, emoji } = body

    if (!name || !type || !emoji) {
      return NextResponse.json(
        { error: 'Name, type, and emoji are required' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        emoji,
      },
    })

    // Автоматическое создание лимита для категорий с типом expense
    if (type === 'expense') {
      await createAutoLimitForCategory(category.id, category.name)
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, type, emoji } = body

    if (!id || !name || !type || !emoji) {
      return NextResponse.json(
        { error: 'ID, name, type, and emoji are required' },
        { status: 400 }
      )
    }

    // Получаем текущую категорию для сравнения типов
    const currentCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!currentCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        type,
        emoji,
      },
    })

    // Обработка изменения типа категории
    const oldType = currentCategory.type
    const newType = type

    if (oldType !== newType) {
      if (oldType === 'income' && newType === 'expense') {
        // Создаем лимит при изменении с income на expense
        await createAutoLimitForCategory(category.id, category.name)
      } else if (oldType === 'expense' && newType === 'income') {
        // Удаляем лимит при изменении с expense на income
        await deleteAutoLimitForCategory(category.id, category.name)
      }
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
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
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Проверяем, есть ли операции, связанные с этой категорией
    const operationsCount = await prisma.operation.count({
      where: { categoryId: id },
    })

    if (operationsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing operations' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}