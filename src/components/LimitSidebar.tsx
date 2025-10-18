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

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement as HTMLElement;
    const body = document.body as HTMLBodyElement;
    const count = Number(root.dataset.sidebarCount || '0') + 1;
    root.dataset.sidebarCount = String(count);
    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevTouch = (body.style as any).touchAction || '';

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    (body.style as any).touchAction = 'none';
    (body.style as any).overscrollBehavior = 'contain';
    root.classList.add('sidebar-open');
    body.classList.add('sidebar-open');

    return () => {
      const current = Number(root.dataset.sidebarCount || '1') - 1;
      root.dataset.sidebarCount = String(Math.max(0, current));
      if (current <= 0) {
        root.style.overflow = prevRootOverflow;
        body.style.overflow = prevBodyOverflow;
        (body.style as any).touchAction = prevTouch;
        (body.style as any).overscrollBehavior = '';
        root.classList.remove('sidebar-open');
        body.classList.remove('sidebar-open');
      }
    };
  }, [isOpen]);
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
            className="premium-sidebar fixed right-0 top-0 h-full w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="premium-sidebar-content flex flex-col h-full">
              {/* Header */}
              <div className="premium-sidebar-header flex items-center justify-between p-6">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">Редактировать лимит</h2>
                  {limit?.category && (
                    <p className="text-sm text-yellow-200/70 mt-1 drop-shadow-sm">
                      {limit.category.emoji} {limit.category.name}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 group"
                >
                  <X className="h-5 w-5 text-yellow-100 group-hover:text-white drop-shadow-sm" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Сумма лимита
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      value={limitAmount}
                      onChange={(e) => setLimitAmount(e.target.value)}
                      step="0.01"
                      min="0"
                      className="premium-form-input"
                      placeholder="Введите сумму лимита"
                      required
                    />
                    <p className="text-xs text-yellow-200/60 mt-1 drop-shadow-sm">
                      Ежемесячный лимит расходов по категории
                    </p>
                  </div>

                  {limit?.isAutoCreated && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-2 text-purple-200 text-sm drop-shadow-sm">
                        <span className="text-lg drop-shadow-lg">🪄</span>
                        <span>Этот лимит был создан автоматически при добавлении категории расходов.</span>
                      </div>
                    </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <h4 className="text-yellow-200 font-semibold mb-2 drop-shadow-sm">Как работают лимиты?</h4>
                    <ul className="text-sm text-yellow-100/80 space-y-1 drop-shadow-sm">
                      <li>• Лимит устанавливается на месяц</li>
                      <li>• При превышении 80% появится предупреждение</li>
                      <li>• При превышении 100% лимит будет выделен красным</li>
                    </ul>
                  </motion.div>
                </form>
              </div>

              {/* Footer */}
              <div className="premium-sidebar-header flex-shrink-0 p-6 space-y-4">
                {!showDeleteConfirm ? (
                  <div className="premium-sidebar-buttons">
                    {/* Кнопка удаления */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting}
                      className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 drop-shadow-sm" />
                      Удалить лимит
                    </motion.button>
                    
                    {/* Основные кнопки */}
                    <div className="premium-sidebar-button-row">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50"
                      >
                        Отмена
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        onClick={handleSave}
                        disabled={isSubmitting || !limitAmount}
                        className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <Save className="w-3 h-3 drop-shadow-sm" />
                        )}
                        Сохранить
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-red-200 font-semibold drop-shadow-sm">Удалить лимит?</p>
                      <p className="text-sm text-yellow-200/60 drop-shadow-sm">Это действие нельзя отменить</p>
                    </div>
                    <div className="premium-sidebar-button-row">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50"
                      >
                        Отмена
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="w-3 h-3 drop-shadow-sm" />
                        )}
                        Удалить
                      </motion.button>
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
