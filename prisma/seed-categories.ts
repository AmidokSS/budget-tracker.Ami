import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏷️ Создание базовых категорий...')

  // Категории доходов
  const incomeCategories = [
    { name: 'Зарплата', emoji: '💼', type: 'income' },
    { name: 'Фриланс', emoji: '💻', type: 'income' },
    { name: 'Инвестиции', emoji: '📈', type: 'income' },
    { name: 'Подарки', emoji: '🎁', type: 'income' },
    { name: 'Прочие доходы', emoji: '💰', type: 'income' },
  ]

  // Категории расходов
  const expenseCategories = [
    { name: 'Продукты', emoji: '🛒', type: 'expense' },
    { name: 'Транспорт', emoji: '🚗', type: 'expense' },
    { name: 'Жилье', emoji: '🏠', type: 'expense' },
    { name: 'Здоровье', emoji: '⚕️', type: 'expense' },
    { name: 'Развлечения', emoji: '🎮', type: 'expense' },
    { name: 'Одежда', emoji: '👕', type: 'expense' },
    { name: 'Образование', emoji: '📚', type: 'expense' },
    { name: 'Кафе и рестораны', emoji: '🍽️', type: 'expense' },
    { name: 'Спорт', emoji: '⚽', type: 'expense' },
    { name: 'Прочие расходы', emoji: '💸', type: 'expense' },
  ]

  const allCategories = [...incomeCategories, ...expenseCategories]

  // Создаем категории
  for (const category of allCategories) {
    // Проверяем, существует ли уже категория с таким именем и типом
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        type: category.type
      }
    })

    if (!existing) {
      await prisma.category.create({
        data: category
      })
    }
  }

  console.log(`✅ Создано ${allCategories.length} базовых категорий`)
  console.log(`📊 Доходы: ${incomeCategories.length} категорий`)
  console.log(`💸 Расходы: ${expenseCategories.length} категорий`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка создания категорий:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })