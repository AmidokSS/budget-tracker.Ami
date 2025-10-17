import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Создание базовых пользователей...')

  // Создаем пользователя Артур
  const artur = await prisma.user.upsert({
    where: { name: 'Артур' },
    update: {},
    create: {
      name: 'Артур',
    },
  })

  // Создаем пользователя Валерия
  const valeria = await prisma.user.upsert({
    where: { name: 'Валерия' },
    update: {},
    create: {
      name: 'Валерия',
    },
  })

  console.log('✅ Базовые пользователи созданы:', { artur, valeria })
}

main()
  .catch((e) => {
    console.error('❌ Ошибка создания пользователей:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })