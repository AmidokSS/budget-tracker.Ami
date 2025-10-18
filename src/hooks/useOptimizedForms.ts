import { useCallback, useState } from 'react'
import { z } from 'zod'

// Хук для управления состоянием модальных форм
export function useFormModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit' | 'fund'>('create')

  const openCreate = useCallback(() => {
    setMode('create')
    setIsOpen(true)
  }, [])

  const openEdit = useCallback(() => {
    setMode('edit')
    setIsOpen(true)
  }, [])

  const openFund = useCallback(() => {
    setMode('fund')
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    mode,
    openCreate,
    openEdit,
    openFund,
    close,
  }
}

// Утилиты для работы с формами
export const formUtils = {
  // Функция для парсинга денежных сумм из строки
  parseAmount: (value: string): number => {
    const cleaned = value.replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  },

  // Функция для валидации положительных сумм
  validatePositiveAmount: (value: string): boolean => {
    const parsed = formUtils.parseAmount(value)
    return parsed > 0
  },

  // Функция для форматирования суммы обратно в строку
  formatAmount: (value: number): string => {
    return value.toString().replace('.', ',')
  },
}

// Предустановленные схемы валидации
export const formSchemas = {
  operation: z.object({
    amount: z.string().min(1, 'Введите сумму'),
    categoryId: z.string().min(1, 'Выберите категорию'),
    type: z.enum(['income', 'expense']),
    note: z.string().optional(),
    userId: z.string().min(1, 'Выберите пользователя'),
  }),
  
  goal: z.object({
    title: z.string().min(1, 'Название обязательно').max(100, 'Слишком длинное название'),
    targetAmount: z.string().min(1, 'Введите целевую сумму'),
    deadline: z.string().optional(),
    emoji: z.string().optional(),
  }),
  
  fundGoal: z.object({
    addAmount: z.string().min(1, 'Введите сумму пополнения'),
  }),
  
  limit: z.object({
    limitAmount: z.string().min(1, 'Введите сумму лимита'),
  }),
  
  category: z.object({
    name: z.string().min(1, 'Название обязательно').max(50, 'Слишком длинное название'),
    emoji: z.string().min(1, 'Выберите иконку'),
    type: z.enum(['income', 'expense']),
  }),
}

// Типы для TypeScript
export type OperationFormData = z.infer<typeof formSchemas.operation>
export type GoalFormData = z.infer<typeof formSchemas.goal>
export type FundGoalFormData = z.infer<typeof formSchemas.fundGoal>
export type LimitFormData = z.infer<typeof formSchemas.limit>
export type CategoryFormData = z.infer<typeof formSchemas.category>