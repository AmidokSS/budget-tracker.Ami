import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Временный API для месячного сброса без изменения схемы БД
 * Использует комментарии в операциях для отслеживания архивированных записей
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем секретный ключ для безопасности
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    console.log('🔄 Запуск месячного сброса (временная версия)...');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    let processedUsers = 0;
    let totalResetOperations = 0;
    const results = [];

    for (const user of users) {
      try {
        // Проверяем, есть ли операции с меткой архива для текущего периода
        const archiveMarker = `ARCHIVED_${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        
        const existingArchive = await prisma.operation.findFirst({
          where: {
            userId: user.id,
            note: {
              contains: archiveMarker
            }
          }
        });

        if (existingArchive) {
          console.log(`⏭️ Пользователь ${user.id}: сброс уже выполнен в этом месяце`);
          continue;
        }

        // Получаем операции текущего месяца
        const startDate = startOfMonth(now);
        const endDate = endOfMonth(now);

        const monthOperations = await prisma.operation.findMany({
          where: {
            userId: user.id,
            date: {
              gte: startDate,
              lte: endDate
            },
            NOT: {
              note: {
                contains: 'ARCHIVED_'
              }
            }
          }
        });

        if (monthOperations.length === 0) {
          console.log(`⏭️ Пользователь ${user.id}: нет операций для архивирования`);
          continue;
        }

        // Рассчитываем баланс
        const totalIncome = monthOperations
          .filter(op => op.type === 'income')
          .reduce((sum, op) => sum + op.amount, 0);

        const totalExpense = monthOperations
          .filter(op => op.type === 'expense')
          .reduce((sum, op) => sum + op.amount, 0);

        const netBalance = totalIncome - totalExpense;

        // Создаем специальную запись-маркер архива
        await prisma.operation.create({
          data: {
            userId: user.id,
            categoryId: monthOperations[0].categoryId, // Берем категорию первой операции
            type: 'income',
            amount: 0.01, // Минимальная сумма для маркера
            date: endDate,
            note: `${archiveMarker} - Баланс периода: доходы ${totalIncome}, расходы ${totalExpense}, итого ${netBalance}. Операций: ${monthOperations.length}`
          }
        });

        // Обновляем заметки у операций для пометки как архивированные
        for (const op of monthOperations) {
          await prisma.operation.update({
            where: { id: op.id },
            data: {
              note: `${op.note || ''} [${archiveMarker}]`
            }
          });
        }

        results.push({
          userId: user.id,
          resetOperations: monthOperations.length,
          netBalance,
          totalIncome,
          totalExpense
        });

        processedUsers++;
        totalResetOperations += monthOperations.length;

        console.log(`✅ Пользователь ${user.id}: обработано ${monthOperations.length} операций, баланс ${netBalance}`);

      } catch (userError) {
        console.error(`❌ Ошибка при обработке пользователя ${user.id}:`, userError);
        results.push({
          userId: user.id,
          error: userError instanceof Error ? userError.message : 'Неизвестная ошибка'
        });
      }
    }

    console.log(`🎉 Месячный сброс завершен: обработано ${processedUsers} пользователей, помечено ${totalResetOperations} операций`);

    return NextResponse.json({
      success: true,
      message: 'Месячный сброс выполнен (временная версия)',
      processedUsers,
      totalResetOperations,
      results,
      note: 'Операции помечены как архивированные в заметках'
    });

  } catch (error) {
    console.error('❌ Ошибка при выполнении месячного сброса:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}

/**
 * POST /api/cron/monthly-reset
 * Ручной запуск месячного сброса для тестирования
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, userId } = body;

    // Проверяем секретный ключ
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Неавторизованный доступ' }, { status: 401 });
    }

    console.log('🔧 Ручной запуск месячного сброса...');

    // Если указан конкретный пользователь
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }

      const now = new Date();
      const archiveMarker = `ARCHIVED_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Проверяем, не было ли уже сброса
      const existingArchive = await prisma.operation.findFirst({
        where: {
          userId: userId,
          note: {
            contains: archiveMarker
          }
        }
      });

      if (existingArchive) {
        return NextResponse.json({
          message: 'Сброс уже выполнен в этом месяце',
          alreadyProcessed: true
        });
      }

      // Получаем операции текущего месяца
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);

      const monthOperations = await prisma.operation.findMany({
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate
          },
          NOT: {
            note: {
              contains: 'ARCHIVED_'
            }
          }
        }
      });

      if (monthOperations.length === 0) {
        return NextResponse.json({
          message: 'Нет операций для архивирования',
          resetOperations: 0
        });
      }

      // Рассчитываем баланс
      const totalIncome = monthOperations
        .filter(op => op.type === 'income')
        .reduce((sum, op) => sum + op.amount, 0);

      const totalExpense = monthOperations
        .filter(op => op.type === 'expense')
        .reduce((sum, op) => sum + op.amount, 0);

      const netBalance = totalIncome - totalExpense;

      // Создаем маркер и помечаем операции
      await prisma.operation.create({
        data: {
          userId: userId,
          categoryId: monthOperations[0].categoryId,
          type: 'income',
          amount: 0.01,
          date: endDate,
          note: `${archiveMarker} - Баланс периода: доходы ${totalIncome}, расходы ${totalExpense}, итого ${netBalance}. Операций: ${monthOperations.length}`
        }
      });

      // Обновляем заметки у операций для пометки как архивированные
      for (const op of monthOperations) {
        await prisma.operation.update({
          where: { id: op.id },
          data: {
            note: `${op.note || ''} [${archiveMarker}]`
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Месячный сброс выполнен для пользователя',
        userId,
        archivedOperations: monthOperations.length,
        netBalance,
        totalIncome,
        totalExpense
      });
    }

    // Иначе выполняем полный сброс (перенаправляем на GET)
    const url = new URL(request.url);
    const getRequest = new NextRequest(url, {
      method: 'GET',
      headers: { authorization: `Bearer ${secret}` }
    });

    return await GET(getRequest);

  } catch (error) {
    console.error('❌ Ошибка при ручном запуске месячного сброса:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}