'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2 } from 'lucide-react'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useApi'
import { Category } from '@/types'

interface CategorySidebarProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  onSuccess?: () => void
}

const emojiOptions = [
  '💰', '🍔', '🚗', '🎁', '🏠', '💳',
  '🎮', '🛍️', '✈️', '🐾', '📱', '💻',
  '🏥', '🎓', '💊', '🎵', '📚', '☕',
  '🎨', '🏋️', '🎯', '🌟', '💡', '🔧'
]

export default function CategorySidebar({ isOpen, onClose, category, onSuccess }: CategorySidebarProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [emoji, setEmoji] = useState('💰')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setName(category.name)
      setType(category.type as 'income' | 'expense')
      setEmoji(category.emoji)
    } else {
      setName('')
      setType('expense')
      setEmoji('💰')
    }
    setShowDeleteConfirm(false)
  }, [category, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          name: name.trim(),
          type,
          emoji,
        })
      } else {
        await createCategory.mutateAsync({
          name: name.trim(),
          type,
          emoji,
        })
      }
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!category || !showDeleteConfirm) return

    setIsSubmitting(true)
    try {
      await deleteCategory.mutateAsync(category.id)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting category:', error)
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
            className="premium-sidebar overflow-hidden fixed right-0 top-0 h-full w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="premium-sidebar-content flex flex-col h-full">
              {/* Header */}
              <div className="premium-sidebar-header p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">
                  {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Название категории
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите название..."
                      className="premium-form-input"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {/* Type */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Тип категории
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.label 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={type === 'income'}
                          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          type === 'income'
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/60 text-green-200 shadow-glow-success backdrop-blur-sm'
                            : 'bg-gradient-to-r from-white/5 to-yellow-500/5 border-yellow-500/20 text-yellow-100/70 hover:border-yellow-400/40 hover:bg-gradient-to-r hover:from-white/10 hover:to-yellow-500/10 backdrop-blur-sm'
                        }`}>
                          <div className="text-center font-semibold drop-shadow-sm">💰 Доход</div>
                        </div>
                      </motion.label>
                      
                      <motion.label 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={type === 'expense'}
                          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          type === 'expense'
                            ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/60 text-red-200 shadow-glow-danger backdrop-blur-sm'
                            : 'bg-gradient-to-r from-white/5 to-yellow-500/5 border-yellow-500/20 text-yellow-100/70 hover:border-yellow-400/40 hover:bg-gradient-to-r hover:from-white/10 hover:to-yellow-500/10 backdrop-blur-sm'
                        }`}>
                          <div className="text-center font-semibold drop-shadow-sm">💸 Расход</div>
                        </div>
                      </motion.label>
                    </div>
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
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 glass-card border border-yellow-500/20 rounded-xl backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <motion.span 
                          key={emoji}
                          initial={{ scale: 0.8, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="text-2xl drop-shadow-lg"
                        >
                          {emoji}
                        </motion.span>
                        <div>
                          <div className="text-white font-semibold drop-shadow-sm">
                            {name || 'Название категории'}
                          </div>
                          <div className={`text-sm font-medium drop-shadow-sm ${
                            type === 'income' ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {type === 'income' ? 'Доход' : 'Расход'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="premium-sidebar-header p-6 space-y-4">
                {!showDeleteConfirm ? (
                  <div className="premium-sidebar-buttons">
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 drop-shadow-sm" />
                        Удалить категорию
                      </motion.button>
                    )}
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
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                        className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isSubmitting ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save className="w-3 h-3 drop-shadow-sm" />
                            {isEditing ? 'Сохранить' : 'Создать'}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-yellow-100 font-semibold mb-2 drop-shadow-sm">Удалить категорию навсегда?</p>
                      <p className="text-sm text-yellow-200/70 drop-shadow-sm">
                        Категория &ldquo;{category?.name}&rdquo; будет удалена без возможности восстановления
                      </p>
                    </div>
                    <div className="premium-sidebar-button-row">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50"
                      >
                        Нет
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isSubmitting ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 drop-shadow-sm" />
                            Да, удалить
                          </>
                        )}
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