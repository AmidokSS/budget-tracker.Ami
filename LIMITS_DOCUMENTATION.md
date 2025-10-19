# Функционал лимитов с периодичностью

## Обзор

Система лимитов была расширена для поддержки различных периодов сброса: ежемесячно и еженедельно.

## Ключевые особенности

### 1. Периоды лимитов

- **Ежемесячно** - лимит сбрасывается 1 числа каждого месяца
- **Еженедельно** - лимит сбрасывается каждый понедельник

### 2. Автоматический сброс

- Система автоматически сбрасывает лимиты при наступлении нового периода
- Сброс происходит каждый день в 00:00 UTC через cron job
- При сбросе `currentAmount` становится 0, а `lastResetAt` обновляется

### 3. Уведомления о сбросе

- При изменении периода пользователь предупреждается о сбросе текущей суммы
- В интерфейсе отображается информация о следующем сбросе
- Показывается количество дней до следующего сброса

## Структура базы данных

### Обновления модели Limit

```prisma
model Limit {
  id            String   @id @default(cuid())
  categoryId    String
  limitAmount   Float
  currentAmount Float    @default(0)
  active        Boolean  @default(true)
  isAutoCreated Boolean  @default(false)
  period        String   @default("monthly") // "monthly" | "weekly"
  lastResetAt   DateTime @default(now())
  createdAt     DateTime @default(now())
  category      Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}
```

## API endpoints

### POST /api/limits

Создание лимита с поддержкой периода:

```json
{
  "categoryId": "string",
  "limitAmount": number,
  "period": "monthly" | "weekly" // опционально, по умолчанию "monthly"
}
```

### PUT /api/limits

Обновление лимита:

```json
{
  "id": "string",
  "limitAmount": number,
  "period": "monthly" | "weekly" // опционально, при изменении сбрасывает currentAmount
}
```

### POST /api/cron/reset-limits

Автоматический сброс лимитов (вызывается cron job):

- Требует авторизации через `Authorization: Bearer ${CRON_SECRET}`
- Проверяет все активные лимиты
- Сбрасывает те, для которых наступил новый период

## Утилиты

### limitUtils.ts

- `shouldResetLimit(limit)` - проверяет, нужно ли сбросить лимит
- `getNextResetDate(limit)` - возвращает дату следующего сброса
- `getDaysUntilReset(limit)` - количество дней до сброса
- `getPeriodLabel(period)` - человекочитаемое название периода
- `isLimitExceeded(limit)` - проверяет, превышен ли лимит

## Компоненты

### LimitSidebar

- Добавлен выбор периода (месячный/недельный)
- Отображение информации о следующем сбросе
- Предупреждение при изменении периода

### LimitCard

- Отображение текущего периода
- Показ дней до следующего сброса
- Визуальные индикаторы состояния лимита

## Настройка cron job

### Vercel

Cron job настраивается в `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-limits",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Переменные окружения

```bash
CRON_SECRET="your_secret_key_for_cron_jobs"
```

## Логика сброса

### Ежемесячные лимиты

- Сбрасываются 1 числа каждого месяца
- Сравнение: `currentMonth > lastResetMonth`

### Еженедельные лимиты

- Сбрасываются каждый понедельник
- Сравнение начала недель: `currentWeekStart > lastResetWeekStart`

## Миграция существующих данных

При обновлении:

1. Все существующие лимиты получают `period = "monthly"`
2. `lastResetAt` устанавливается в дату создания лимита
3. Функциональность остается совместимой с предыдущими версиями

## Примеры использования

### Создание недельного лимита

```typescript
const weeklyLimit = await api.createLimit({
  categoryId: 'category_id',
  limitAmount: 500,
  period: 'weekly',
})
```

### Обновление периода

```typescript
const updatedLimit = await api.updateLimit({
  id: 'limit_id',
  limitAmount: 1000,
  period: 'monthly', // изменение с weekly на monthly сбросит currentAmount
})
```

### Проверка необходимости сброса

```typescript
import { shouldResetLimit } from '@/lib/limitUtils'

if (shouldResetLimit(limit)) {
  // Лимит нужно сбросить
  console.log('Limit should be reset')
}
```
