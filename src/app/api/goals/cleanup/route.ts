import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/goals/cleanup
 * Удалить все архивированные цели
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем секретный ключ для безопасности
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    // Получаем все архивированные цели
    const archivedGoals = await prisma.goal.findMany({
      where: {
        archived: true
      }
    });

    if (archivedGoals.length === 0) {
      return NextResponse.json({
        message: 'Нет архивированных целей для удаления',
        deletedCount: 0
      });
    }

    // Удаляем архивированные цели
    const result = await prisma.goal.deleteMany({
      where: {
        archived: true
      }
    });

    console.log(`🗑️ Удалено ${result.count} архивированных целей`);

    return NextResponse.json({
      success: true,
      message: `Удалено ${result.count} архивированных целей`,
      deletedCount: result.count,
      deletedGoals: archivedGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount
      }))
    });

  } catch (error) {
    console.error('❌ Ошибка при очистке архивированных целей:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}

/**
 * POST /api/goals/cleanup
 * Ручное удаление архивированных целей
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, confirm } = body;

    // Проверяем секретный ключ
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    if (!confirm) {
      return NextResponse.json({ error: 'Требуется подтверждение удаления' }, { status: 400 });
    }

    // Получаем количество архивированных целей
    const count = await prisma.goal.count({
      where: {
        archived: true
      }
    });

    if (count === 0) {
      return NextResponse.json({
        message: 'Нет архивированных целей для удаления',
        deletedCount: 0
      });
    }

    // Удаляем архивированные цели
    const result = await prisma.goal.deleteMany({
      where: {
        archived: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `Успешно удалено ${result.count} архивированных целей`,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('❌ Ошибка при ручном удалении архивированных целей:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}