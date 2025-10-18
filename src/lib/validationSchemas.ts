import { z } from 'zod'

// Схема для создания/редактирования операции
export const operationSchema = z.object({
  amount: z.number().positive('Сумма должна быть положительной'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  type: z.enum(['income', 'expense'], {
    message: 'Выберите тип операции'
  }),
  note: z.string().optional(),
  userId: z.string().min(1, 'Выберите пользователя'),
})

// Схема для создания/редактирования цели
export const goalSchema = z.object({
  title: z.string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов'),
  targetAmount: z.number()
    .positive('Целевая сумма должна быть положительной')
    .max(1000000000, 'Слишком большая сумма'),
  deadline: z.string().optional(),
  emoji: z.string().optional(),
})

// Схема для пополнения цели
export const fundGoalSchema = z.object({
  addAmount: z.number()
    .positive('Сумма пополнения должна быть положительной')
    .max(1000000000, 'Слишком большая сумма'),
})

// Схема для создания/редактирования лимита
export const limitSchema = z.object({
  limitAmount: z.number()
    .positive('Сумма лимита должна быть положительной')
    .max(1000000000, 'Слишком большая сумма'),
})

// Схема для создания/редактирования категории
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Название обязательно')
    .max(50, 'Название не должно превышать 50 символов'),
  emoji: z.string()
    .min(1, 'Выберите иконку')
    .max(10, 'Слишком длинная иконка'),
  type: z.enum(['income', 'expense'], {
    message: 'Выберите тип категории'
  }),
})

// Схема для настроек пользователя
export const userSettingsSchema = z.object({
  name: z.string()
    .min(1, 'Имя обязательно')
    .max(100, 'Имя не должно превышать 100 символов'),
  currency: z.enum(['PLN', 'USD', 'EUR', 'UAH'], {
    message: 'Выберите валюту'
  }),
})

// Типы для использования в компонентах
export type OperationFormData = z.infer<typeof operationSchema>
export type GoalFormData = z.infer<typeof goalSchema>
export type FundGoalFormData = z.infer<typeof fundGoalSchema>
export type LimitFormData = z.infer<typeof limitSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>

// Функции для трансформации данных формы
export const transformAmountFromString = (value: string): number => {
  const cleaned = value.replace(',', '.')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export const transformAmountToString = (value: number): string => {
  return value.toString().replace('.', ',')
}

// Схемы с трансформацией для строковых полей (для использования с input type="text")
export const operationFormSchema = z.object({
  amount: z.string()
    .min(1, 'Введите сумму')
    .transform(transformAmountFromString)
    .pipe(z.number().positive('Сумма должна быть положительной')),
  categoryId: z.string().min(1, 'Выберите категорию'),
  type: z.enum(['income', 'expense'], {
    message: 'Выберите тип операции'
  }),
  note: z.string().optional(),
  userId: z.string().min(1, 'Выберите пользователя'),
})

export const goalFormSchema = z.object({
  title: z.string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов'),
  targetAmount: z.string()
    .min(1, 'Введите целевую сумму')
    .transform(transformAmountFromString)
    .pipe(z.number().positive('Целевая сумма должна быть положительной')),
  deadline: z.string().optional(),
  emoji: z.string().optional(),
})

export const fundGoalFormSchema = z.object({
  addAmount: z.string()
    .min(1, 'Введите сумму пополнения')
    .transform(transformAmountFromString)
    .pipe(z.number().positive('Сумма пополнения должна быть положительной')),
})

export const limitFormSchema = z.object({
  limitAmount: z.string()
    .min(1, 'Введите сумму лимита')
    .transform(transformAmountFromString)
    .pipe(z.number().positive('Сумма лимита должна быть положительной')),
})

// Типы для форм со строковыми полями
export type OperationFormFields = z.input<typeof operationFormSchema>
export type GoalFormFields = z.input<typeof goalFormSchema>
export type FundGoalFormFields = z.input<typeof fundGoalFormSchema>
export type LimitFormFields = z.input<typeof limitFormSchema>