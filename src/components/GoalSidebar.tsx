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
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 backdrop-blur-md premium-sidebar-overlay"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="premium-sidebar overflow-hidden fixed right-0 top-0 h-full w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flex контейнер на всю высоту */}
            <div className="premium-sidebar-content flex flex-col h-full">
              {/* Header - фиксированный вверху */}
              <div className="premium-sidebar-header flex-shrink-0">
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">
                    {getTitle()}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 group"
                  >
                    <X className="w-5 h-5 text-yellow-100 group-hover:text-white drop-shadow-sm" />
                  </motion.button>
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
                          <span>{goal.currentAmount.toLocaleString('pl-PL')} zł</span>
                          <span>{goal.targetAmount.toLocaleString('pl-PL')} zł</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {!isFunding && (
                      <>
                        {/* Title */}
                        <div className="premium-form-group">
                          <label className="premium-form-label flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Название цели
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например, Отпуск в Японии..."
                            className="premium-form-input"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        {/* Target Amount */}
                        <div className="premium-form-group">
                          <label className="premium-form-label flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Целевая сумма
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="100000"
                            min="1"
                            step="1"
                            className="premium-form-input"
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        {/* Deadline */}
                        <div className="premium-form-group">
                          <label className="premium-form-label flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Дедлайн (необязательно)
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="premium-form-input"
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Emoji */}
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            Выберите эмодзи
                          </label>
                          <div className="grid grid-cols-4 gap-3">
                            {emojiOptions.map((emojiOption) => (
                              <motion.button
                                key={emojiOption}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setEmoji(emojiOption)}
                                disabled={isSubmitting}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-2xl backdrop-blur-sm ${
                                  emoji === emojiOption
                                    ? 'border-yellow-400/60 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 shadow-glow-primary'
                                    : 'border-yellow-500/20 hover:border-yellow-400/40 bg-gradient-to-r from-white/5 to-yellow-500/5 hover:from-white/10 hover:to-yellow-500/10'
                                }`}
                              >
                                {emojiOption}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="premium-form-group">
                          <label className="premium-form-label">
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
                                  Цель: {targetAmount || '0'} zł
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
                      <div className="premium-form-group">
                        <label className="premium-form-label flex items-center gap-2">
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
                          className="premium-form-input"
                          disabled={isSubmitting}
                          required
                        />
                        
                        {goal && fundAmount && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <div className="text-sm text-green-300">
                              После пополнения: {(goal.currentAmount + parseFloat(fundAmount || '0')).toLocaleString('pl-PL')} zł
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
                        <div className="premium-sidebar-buttons">
                          {goal?.archived ? (
                            <button
                              type="button"
                              onClick={handleUnarchive}
                              disabled={isSubmitting}
                              className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              📤 Разархивировать цель
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleArchive}
                              disabled={isSubmitting}
                              className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              📦 Архивировать цель
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isSubmitting}
                            className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить цель
                          </button>
                        </div>
                      )}
                      
                      {/* Основные кнопки */}
                      <div className="premium-sidebar-button-row">
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={isSubmitting}
                          className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || (isFunding ? !fundAmount || parseFloat(fundAmount) <= 0 : !title.trim() || !targetAmount || parseFloat(targetAmount) <= 0)}
                          className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {isSubmitting ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
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
                      <div className="premium-sidebar-button-row">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isSubmitting}
                          className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50"
                        >
                          Нет
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isSubmitting}
                          className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {isSubmitting ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
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