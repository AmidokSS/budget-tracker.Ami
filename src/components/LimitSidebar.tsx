'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2 } from 'lucide-react'
import { useUpdateLimit, useDeleteLimit } from '@/hooks/useApi'
import { Limit } from '@/types'

interface LimitSidebarProps {
  isOpen: boolean
  onClose: () => void
  limit?: Limit | null
  onSuccess?: () => void
}

export default function LimitSidebar({ isOpen, onClose, limit, onSuccess }: LimitSidebarProps) {
  const [limitAmount, setLimitAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const updateLimit = useUpdateLimit()
  const deleteLimit = useDeleteLimit()

  useEffect(() => {
    if (limit) {
      setLimitAmount(limit.limitAmount.toString())
    } else {
      setLimitAmount('')
    }
    setShowDeleteConfirm(false)
  }, [limit])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit || !limitAmount) return

    setIsSubmitting(true)
    try {
      await updateLimit.mutateAsync({
        id: limit.id,
        limitAmount: parseFloat(limitAmount),
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating limit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!limit || !showDeleteConfirm) return

    setIsSubmitting(true)
    try {
      await deleteLimit.mutateAsync(limit.id)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting limit:', error)
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setShowDeleteConfirm(false)
      onClose()
    }
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
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">Редактировать лимит</h2>
                  {limit?.category && (
                    <p className="text-sm text-gray-400 mt-1">
                      {limit.category.emoji} {limit.category.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Сумма лимита
                    </label>
                    <input
                      type="number"
                      value={limitAmount}
                      onChange={(e) => setLimitAmount(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
                      placeholder="Введите сумму лимита"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Ежемесячный лимит расходов по категории
                    </p>
                  </div>

                  {limit?.isAutoCreated && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-purple-300 text-sm">
                        <span>🪄</span>
                        <span>Этот лимит был создан автоматически при добавлении категории расходов.</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-blue-300 font-medium mb-2">Как работают лимиты?</h4>
                    <ul className="text-sm text-blue-200/80 space-y-1">
                      <li>• Лимит устанавливается на месяц</li>
                      <li>• При превышении 80% появится предупреждение</li>
                      <li>• При превышении 100% лимит будет выделен красным</li>
                    </ul>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-white/10 p-6 space-y-4">
                {!showDeleteConfirm ? (
                  <div className="space-y-3">
                    {/* Кнопка удаления */}
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить лимит
                    </button>
                    
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
                        type="submit"
                        onClick={handleSave}
                        disabled={isSubmitting || !limitAmount}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Сохранить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-red-300 font-medium">Удалить лимит?</p>
                      <p className="text-sm text-gray-400">Это действие нельзя отменить</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Удалить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}