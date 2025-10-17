'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Plus, DollarSign, Calendar, Target } from 'lucide-react'
import { useCreateGoal, useUpdateGoal, useAddToGoal, useDeleteGoal } from '@/hooks/useApi'
import { Goal } from '@/types'

interface GoalSidebarProps {
  isOpen: boolean
  onClose: () => void
  goal?: Goal | null
  mode?: 'create' | 'edit' | 'fund'
  onSuccess?: () => void
}

const emojiOptions = [
  '💰', '🏠', '✈️', '📱', '🚗', '🎁',
  '🎮', '📚', '💻', '🎯', '💍', '🏖️',
  '🎸', '📷', '🏋️', '🎨', '🍕', '☕',
  '🌟', '💡', '🔧', '🎵', '🏆', '💖'
]

export default function GoalSidebar({ isOpen, onClose, goal, mode = 'create', onSuccess }: GoalSidebarProps) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [emoji, setEmoji] = useState('💰')
  const [fundAmount, setFundAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const addToGoal = useAddToGoal()
  const deleteGoal = useDeleteGoal()

  const isEditing = mode === 'edit'
  const isFunding = mode === 'fund'

  useEffect(() => {
    if (goal && (isEditing || isFunding)) {
      setTitle(goal.title)
      setTargetAmount(goal.targetAmount.toString())
      setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '')
      setEmoji(goal.emoji)
    } else {
      setTitle('')
      setTargetAmount('')
      setDeadline('')
      setEmoji('💰')
    }
    setFundAmount('')
    setShowDeleteConfirm(false)
  }, [goal, mode, isOpen, isEditing, isFunding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (isFunding) {
      if (!fundAmount || parseFloat(fundAmount) <= 0) return
      
      setIsSubmitting(true)
      try {
        await addToGoal.mutateAsync({
          id: goal!.id,
          addAmount: parseFloat(fundAmount),
        })
        
        onSuccess?.()
        onClose()
      } catch (error) {
        console.error('Error funding goal:', error)
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    if (!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0) return

    setIsSubmitting(true)
    try {
      if (isEditing && goal) {
        await updateGoal.mutateAsync({
          id: goal.id,
          title: title.trim(),
          targetAmount: parseFloat(targetAmount),
          deadline: deadline || undefined,
          emoji,
        })
      } else {
        await createGoal.mutateAsync({
          title: title.trim(),
          targetAmount: parseFloat(targetAmount),
          deadline: deadline || undefined,
          emoji,
        })
      }
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!goal || !showDeleteConfirm) return

    setIsSubmitting(true)
    try {
      await deleteGoal.mutateAsync(goal.id)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting goal:', error)
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleArchive = async () => {
    if (!goal) return

    setIsSubmitting(true)
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        archived: true,
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error archiving goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnarchive = async () => {
    if (!goal) return

    setIsSubmitting(true)
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        archived: false,
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error unarchiving goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'fund': return 'Пополнить цель'
      case 'edit': 
        if (goal?.archived) {
          return 'Управление архивной целью'
        }
        return 'Редактировать цель'
      default: return 'Создать цель'
    }
  }

  const progress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flex контейнер на всю высоту */}
            <div className="flex flex-col h-full">
              {/* Header - фиксированный вверху */}
              <div className="flex-shrink-0 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-semibold text-white">
                    {getTitle()}
                  </h2>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content - прокручиваемая область */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6 pb-8">
                  {/* Progress for funding mode */}
                  {isFunding && goal && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.emoji}</span>
                        <div>
                          <h3 className="text-white font-semibold">{goal.title}</h3>
                          <p className="text-white/60">
                            {Math.round(progress)}% от цели
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-white/60">
                          <span>{goal.currentAmount.toLocaleString('ru-RU')} ₽</span>
                          <span>{goal.targetAmount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isFunding && (
                      <>
                        {/* Title */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Название цели
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например, Отпуск в Японии..."
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        {/* Target Amount */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Целевая сумма
                          </label>
                          <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="100000"
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        {/* Deadline */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Дедлайн (необязательно)
                          </label>
                          <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Emoji */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/90">
                            Выберите эмодзи
                          </label>
                          <div className="grid grid-cols-4 gap-3">
                            {emojiOptions.map((emojiOption) => (
                              <button
                                key={emojiOption}
                                type="button"
                                onClick={() => setEmoji(emojiOption)}
                                disabled={isSubmitting}
                                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-2xl ${
                                  emoji === emojiOption
                                    ? 'border-blue-400 bg-blue-500/20 shadow-lg'
                                    : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                                }`}
                              >
                                {emojiOption}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/90">
                            Предпросмотр
                          </label>
                          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{emoji}</span>
                              <div>
                                <div className="text-white font-medium">
                                  {title || 'Название цели'}
                                </div>
                                <div className="text-sm text-white/60">
                                  Цель: {targetAmount || '0'} ₽
                                </div>
                                {deadline && (
                                  <div className="text-sm text-blue-400">
                                    До {new Date(deadline).toLocaleDateString('ru-RU')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Fund amount for funding mode */}
                    {isFunding && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Сумма пополнения
                        </label>
                        <input
                          type="number"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          placeholder="Введите сумму..."
                          min="1"
                          step="1"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                          disabled={isSubmitting}
                          required
                        />
                        
                        {goal && fundAmount && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <div className="text-sm text-green-300">
                              После пополнения: {(goal.currentAmount + parseFloat(fundAmount || '0')).toLocaleString('ru-RU')} ₽
                            </div>
                            <div className="text-xs text-green-400">
                              Прогресс: {Math.round(((goal.currentAmount + parseFloat(fundAmount || '0')) / goal.targetAmount) * 100)}%
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Footer - фиксированные кнопки с тенью */}
              <div className="flex-shrink-0 relative">
                {/* Градиент для плавного перехода */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-slate-900/20 pointer-events-none"></div>
                
                <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/10 p-6 space-y-4">
                  {!showDeleteConfirm ? (
                    <div className="space-y-3">
                      {/* Дополнительные кнопки для редактирования */}
                      {isEditing && (
                        <div className="flex gap-3">
                          {goal?.archived ? (
                            <button
                              type="button"
                              onClick={handleUnarchive}
                              disabled={isSubmitting}
                              className="flex-1 px-4 py-3 bg-green-600/80 hover:bg-green-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                            >
                              📤 Разархивировать
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleArchive}
                              disabled={isSubmitting}
                              className="flex-1 px-4 py-3 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                            >
                              📦 Архивировать
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить
                          </button>
                        </div>
                      )}
                      
                      {/* Основные кнопки */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || (isFunding ? !fundAmount || parseFloat(fundAmount) <= 0 : !title.trim() || !targetAmount || parseFloat(targetAmount) <= 0)}
                          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {isFunding ? 'Пополнить' : isEditing ? 'Сохранить' : 'Создать'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-white/90 mb-2 font-medium">Удалить цель навсегда?</p>
                        <p className="text-sm text-white/60">
                          Цель &ldquo;{goal?.title}&rdquo; будет удалена без возможности восстановления
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
                        >
                          Нет
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Да, удалить
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}