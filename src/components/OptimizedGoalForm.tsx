'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Target, Trash2, Wallet } from 'lucide-react'
import { useCreateGoal, useUpdateGoal, useAddToGoal, useDeleteGoal } from '@/hooks/useApi'
import { Goal } from '@/types'
import { z } from 'zod'

// Схемы валидации
const goalFormSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100, 'Слишком длинное название'),
  targetAmount: z.string().min(1, 'Введите целевую сумму'),
  deadline: z.string().optional(),
  emoji: z.string().optional(),
})

const fundFormSchema = z.object({
  addAmount: z.string().min(1, 'Введите сумму пополнения'),
})

type GoalFormFields = z.infer<typeof goalFormSchema>
type FundFormFields = z.infer<typeof fundFormSchema>

interface OptimizedGoalFormProps {
  isOpen: boolean
  onClose: () => void
  goal?: Goal | null
  mode?: 'create' | 'edit' | 'fund'
  onSuccess?: () => void
}

const OptimizedGoalForm = ({ isOpen, onClose, goal, mode = 'create', onSuccess }: OptimizedGoalFormProps) => {
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const addToGoal = useAddToGoal()
  const deleteGoal = useDeleteGoal()

  const isEditing = mode === 'edit'
  const isFunding = mode === 'fund'

  // Основная форма для создания/редактирования цели
  const goalForm = useForm<GoalFormFields>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: goal?.title || '',
      targetAmount: goal?.targetAmount?.toString() || '',
      deadline: goal?.deadline || '',
      emoji: goal?.emoji || '🎯'
    },
    mode: 'onChange'
  })

  // Форма для пополнения цели
  const fundForm = useForm<FundFormFields>({
    resolver: zodResolver(fundFormSchema),
    defaultValues: {
      addAmount: ''
    },
    mode: 'onChange'
  })

  // Обновляем форму при изменении цели
  React.useEffect(() => {
    if (goal && isOpen) {
      goalForm.reset({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        deadline: goal.deadline || '',
        emoji: goal.emoji || '🎯'
      })
      fundForm.reset({ addAmount: '' })
    }
  }, [goal, isOpen, goalForm, fundForm])

  const onGoalSubmit = async (data: GoalFormFields) => {
    try {
      const parsedAmount = parseFloat(data.targetAmount.replace(',', '.'))
      if (isNaN(parsedAmount) || parsedAmount <= 0) return

      if (isEditing && goal) {
        await updateGoal.mutateAsync({
          id: goal.id,
          title: data.title.trim(),
          targetAmount: parsedAmount,
          deadline: data.deadline || undefined,
          emoji: data.emoji
        })
      } else {
        await createGoal.mutateAsync({
          title: data.title.trim(),
          targetAmount: parsedAmount,
          deadline: data.deadline || undefined,
          emoji: data.emoji
        })
      }

      goalForm.reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to save goal:', error)
    }
  }

  const onFundSubmit = async (data: FundFormFields) => {
    if (!goal) return

    try {
      const parsedAmount = parseFloat(data.addAmount.replace(',', '.'))
      if (isNaN(parsedAmount) || parsedAmount <= 0) return

      await addToGoal.mutateAsync({
        id: goal.id,
        addAmount: parsedAmount
      })

      fundForm.reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to fund goal:', error)
    }
  }

  const handleDelete = async () => {
    if (!goal || !window.confirm('Удалить эту цель?')) return

    try {
      await deleteGoal.mutateAsync(goal.id)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to delete goal:', error)
    }
  }

  const remainingAmount = goal ? Math.max(0, goal.targetAmount - goal.currentAmount) : 0
  const progress = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0

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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    {isFunding ? <Wallet className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {isFunding ? 'Пополнить цель' : isEditing ? 'Редактировать цель' : 'Новая цель'}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {isFunding ? 'Добавить средства к цели' : 'Создать финансовую цель'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                    <button
                      onClick={handleDelete}
                      disabled={deleteGoal.isPending}
                      className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Goal Progress (в режиме пополнения) */}
              {isFunding && goal && (
                <div className="mb-6 p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Прогресс</span>
                    <span className="text-cyan-400 text-sm font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Собрано: {goal.currentAmount.toLocaleString()} zł</span>
                    <span className="text-slate-400">Осталось: {remainingAmount.toLocaleString()} zł</span>
                  </div>
                </div>
              )}

              {/* Форма пополнения */}
              {isFunding ? (
                <form onSubmit={fundForm.handleSubmit(onFundSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Сумма пополнения
                    </label>
                    <input
                      {...fundForm.register('addAmount')}
                      type="text"
                      placeholder="0,00"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        fundForm.formState.errors.addAmount
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                      }`}
                    />
                    {fundForm.formState.errors.addAmount && (
                      <p className="mt-1 text-sm text-red-400">{fundForm.formState.errors.addAmount.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={fundForm.formState.isSubmitting || !fundForm.formState.isValid}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                      fundForm.formState.isSubmitting || !fundForm.formState.isValid
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25'
                    }`}
                  >
                    {fundForm.formState.isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Пополнение...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Wallet className="w-4 h-4" />
                        <span>Пополнить цель</span>
                      </div>
                    )}
                  </button>
                </form>
              ) : (
                /* Основная форма */
                <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Название цели
                    </label>
                    <input
                      {...goalForm.register('title')}
                      type="text"
                      placeholder="Например: Отпуск в Италии"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        goalForm.formState.errors.title
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                      }`}
                    />
                    {goalForm.formState.errors.title && (
                      <p className="mt-1 text-sm text-red-400">{goalForm.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Целевая сумма
                    </label>
                    <input
                      {...goalForm.register('targetAmount')}
                      type="text"
                      placeholder="0,00"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        goalForm.formState.errors.targetAmount
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-600/30 focus:border-slate-500 focus:ring-slate-500/20'
                      }`}
                    />
                    {goalForm.formState.errors.targetAmount && (
                      <p className="mt-1 text-sm text-red-400">{goalForm.formState.errors.targetAmount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Крайний срок (необязательно)
                    </label>
                    <input
                      {...goalForm.register('deadline')}
                      type="date"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/30 text-white focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Иконка
                    </label>
                    <input
                      {...goalForm.register('emoji')}
                      type="text"
                      placeholder="🎯"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={goalForm.formState.isSubmitting || !goalForm.formState.isValid}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                      goalForm.formState.isSubmitting || !goalForm.formState.isValid
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25'
                    }`}
                  >
                    {goalForm.formState.isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isEditing ? 'Сохранение...' : 'Создание...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>{isEditing ? 'Сохранить изменения' : 'Создать цель'}</span>
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OptimizedGoalForm