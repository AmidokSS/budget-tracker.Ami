import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shouldResetLimit } from '@/lib/limitUtils'

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию (в production можно добавить API key)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем все активные лимиты
    const limits = await prisma.limit.findMany({
      where: { active: true }
    })

    // Находим лимиты, которые нужно сбросить
    const limitsToReset = limits.filter(limit => 
      shouldResetLimit({ period: limit.period, lastResetAt: limit.lastResetAt })
    )

    let resetCount = 0

    if (limitsToReset.length > 0) {
      // Сбрасываем лимиты
      await Promise.all(
        limitsToReset.map(async (limit) => {
          await prisma.limit.update({
            where: { id: limit.id },
            data: {
              currentAmount: 0,
              lastResetAt: new Date(),
            },
          })
          resetCount++
        })
      )
    }

    return NextResponse.json({
      success: true,
      message: `Reset ${resetCount} limits`,
      resetLimits: limitsToReset.map(l => ({ id: l.id, categoryId: l.categoryId, period: l.period }))
    })

  } catch (error) {
    console.error('Error in reset-limits cron job:', error)
    return NextResponse.json(
      { error: 'Failed to reset limits', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Для ручного запуска (только в development)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }
  
  // Перенаправляем на POST метод
  return POST(new NextRequest('http://localhost:3000/api/cron/reset-limits', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
    }
  }))
}