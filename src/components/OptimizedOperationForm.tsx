'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Wallet, Plus, Minus } from 'lucide-react'
import { useCreateOperation, useCategories, useUsers } from '@/hooks/useApi'
import { z } from 'zod'

// Простая схема валидации для формы
const formSchema = z.object({
  amount: z.string().min(1, 'Введите сумму'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  type: z.enum(['income', 'expense']),
  note: z.string().optional(),
  userId: z.string().min(1, 'Выберите пользователя'),
})

type OperationFormFields = z.infer<typeof formSchema>

interface OptimizedOperationFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const OptimizedOperationForm = ({ isOpen, onClose, onSuccess }: OptimizedOperationFormProps) => {
  const createOperation = useCreateOperation()
  const { data: categories = [] } = useCategories()
  const { data: users = [] } = useUsers()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid }
  } = useForm<OperationFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      type: 'expense',
      note: '',
      categoryId: '',
      userId: users[0]?.id || ''
    },
    mode: 'onChange' // Валидация при изменении для лучшего UX
  })

  const operationType = watch('type')
  const selectedUserId = watch('userId')

  // Установка первого пользователя по умолчанию
  React.useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setValue('userId', users[0].id)
    }
  }, [users, selectedUserId, setValue])

  const filteredCategories = categories.filter(cat => cat.type === operationType)

  const onSubmit = async (data: OperationFormFields) => {
    try {
      // Преобразуем строку в число
      const parsedAmount = parseFloat(data.amount.replace(',', '.'))
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return
      }

      await createOperation.mutateAsync({
        amount: parsedAmount,
        categoryId: data.categoryId,
        type: data.type,
        note: data.note || undefined,
        userId: data.userId,
      })

      reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to create operation:', error)
    }
  }

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setValue('type', newType)
    setValue('categoryId', '') // Сброс категории при смене типа
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-l border-slate-700/50 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Новая операция</h2>
                    <p className="text-sm text-slate-400">Добавить доход или расход</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Тип операции
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('income')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        operationType === 'income'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-600/30 bg-slate-700/30 text-slate-400 hover:border-slate-500/50'
                      }`}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Доход</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange('expense')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        operationType === 'expense'
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-slate-600/30 bg-slate-700/30 text-slate-400 hover:border-slate-500/50'
                      }`}
                    >
                      <Minus className="w-5 h-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Расход</span>
                    </button>
                  </div>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Сумма
                  </label>
                  <input
                    {...register('amount')}
                    type="text"
                    placeholder="0,00"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.amount
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                    }`}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Категория
                  </label>
                  <select
                    {...register('categoryId')}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.categoryId
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                    }`}
                  >
                    <option value="">Выберите категорию</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-400">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* User Selection */}
                {users.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Пользователь
                    </label>
                    <select
                      {...register('userId')}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.userId
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                      }`}
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {errors.userId && (
                      <p className="mt-1 text-sm text-red-400">{errors.userId.message}</p>
                    )}
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Заметка (необязательно)
                  </label>
                  <textarea
                    {...register('note')}
                    rows={3}
                    placeholder="Дополнительная информация..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                      isSubmitting || !isValid
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : operationType === 'income'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-red-500/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Сохранение...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>
                          {operationType === 'income' ? 'Добавить доход' : 'Добавить расход'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OptimizedOperationForm