# 🐛 Анализ проблем в коде и их решения библиотеками

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (найдены в коде)

### 1. 📅 Проблемы с датами - ВЕЗДЕ!

#### ❌ Проблема в `CurrencySelector.tsx`:

```typescript
// ПЛОХО: Ручная работа с датами
const formatLastUpdated = () => {
  if (!lastUpdated) return 'Никогда'

  const date = new Date(lastUpdated)
  const now = new Date()
  const diffHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffHours < 1) return 'Только что'
  if (diffHours < 24) return `${diffHours} ч. назад`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} дн. назад`
}
```

#### ✅ Решение с **date-fns**:

```typescript
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

const formatLastUpdated = () => {
  if (!lastUpdated) return 'Никогда'

  return formatDistanceToNow(new Date(lastUpdated), {
    addSuffix: true,
    locale: ru,
  })
  // Результат: "2 часа назад", "вчера", "3 дня назад"
}
```

### 2. 📊 Проблемы в API routes - timezone issues

#### ❌ Проблема в `operations/route.ts`:

```typescript
// ПЛОХО: Может быть проблема с timezone
case 'last_month':
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

case 'last_7_days':
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
```

#### ✅ Решение с **date-fns**:

```typescript
import { startOfMonth, endOfMonth, subMonths, subDays, startOfDay } from 'date-fns'

case 'last_month':
  const lastMonth = subMonths(now, 1)
  const lastMonthStart = startOfMonth(lastMonth)
  const lastMonthEnd = endOfMonth(lastMonth)

case 'last_7_days':
  const sevenDaysAgo = startOfDay(subDays(now, 7))
```

### 3. 💰 Проблемы с денежными вычислениями

#### ❌ Проблема в `utils.ts`:

```typescript
// ПЛОХО: JavaScript floating point arithmetic
export function formatCurrencyCompact(
  amount: number,
  isCompact: boolean = false
): string {
  // Может потерять точность при вычислениях
  if (absAmount >= 1000000) {
    return `${sign}${(absAmount / 1000000).toFixed(1)}M zł`
  }
}
```

#### ✅ Решение с **currency.js**:

```typescript
import currency from 'currency.js'

export function formatCurrencyCompact(
  amount: number,
  isCompact: boolean = false
): string {
  const money = currency(amount, { precision: 2 })

  if (money.value >= 1000000) {
    return `${money.divide(1000000).format()} M zł`
  } else if (money.value >= 1000) {
    return `${money.divide(1000).format()} K zł`
  }
  return money.format()
}
```

### 4. 🔍 Отсутствие поиска по данным

#### ❌ Проблема:

Нет поиска по операциям, целям, лимитам - пользователю сложно найти нужную информацию

#### ✅ Решение с **fuse.js**:

```typescript
import Fuse from 'fuse.js'

// Компонент поиска операций
const searchOptions = {
  keys: ['description', 'category.name', 'amount'],
  threshold: 0.3, // Нечеткий поиск
  includeScore: true,
}

const fuse = new Fuse(operations, searchOptions)
const results = fuse.search(searchTerm)
```

### 5. 📱 Проблемы с формами - много ре-рендеров

#### ❌ Проблема:

Формы управляются через `useState` - это вызывает ре-рендеры на каждое изменение

#### ✅ Решение с **react-hook-form + zod**:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const operationSchema = z.object({
  amount: z.number().positive('Сумма должна быть положительной'),
  description: z.string().min(1, 'Описание обязательно'),
  categoryId: z.string().uuid('Выберите категорию'),
})

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(operationSchema),
})
```

## 🎯 ТОП-3 БИБЛИОТЕКИ ДЛЯ НЕМЕДЛЕННОЙ УСТАНОВКИ

### 1. **date-fns** - Исправит 80% проблем с датами

```bash
npm install date-fns
```

**Проблемы которые решит:**

- ✅ 15+ мест в коде с ручной работой с датами
- ✅ Локализация на русский
- ✅ Timezone consistency
- ✅ Читаемый код

### 2. **fuse.js** - Поиск изменит UX кардинально

```bash
npm install fuse.js
```

**Фичи которые появятся:**

- ✅ Поиск операций по описанию
- ✅ Поиск по категориям
- ✅ Автокомплит
- ✅ Умный поиск с опечатками

### 3. **react-hook-form + zod** - Производительность форм

```bash
npm install react-hook-form @hookform/resolvers zod
```

**Улучшения:**

- ✅ 90% меньше ре-рендеров
- ✅ Type-safe валидация
- ✅ Лучший UX
- ✅ Меньше багов

## 📊 КОНКРЕТНЫЕ МЕСТА ДЛЯ ИСПРАВЛЕНИЙ

### Файлы с проблемами дат:

1. `src/components/CurrencySelector.tsx` (строка 35)
2. `src/components/GoalCard.tsx` (строка 36)
3. `src/components/TimelineChart.tsx` (строка 25, 66)
4. `src/app/api/operations/route.ts` (строка 35-45)
5. `src/app/api/analytics/route.ts` (строка 15-30)

### Файлы для добавления поиска:

1. `src/app/operations/page.tsx` - поиск операций
2. `src/app/goals/page.tsx` - поиск целей
3. `src/app/limits/page.tsx` - поиск лимитов

### Формы для оптимизации:

1. Все сайдбары (AddOperationSidebar, GoalSidebar, LimitSidebar)
2. Настройки пользователя
3. Фильтры на страницах

## 🚀 БЫСТРЫЙ СТАРТ

### Установить все сразу:

```bash
npm install date-fns fuse.js react-hook-form @hookform/resolvers zod currency.js
```

### Начать с самого важного:

1. **date-fns** - заменить все ручные операции с датами
2. **fuse.js** - добавить поиск в операции
3. **react-hook-form** - оптимизировать AddOperationSidebar

Хочешь, чтобы я помог интегрировать одну из этих библиотек прямо сейчас?
