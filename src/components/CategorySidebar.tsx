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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90">
                      Название категории
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите название..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90">
                      Тип категории
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={type === 'income'}
                          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <div className={`p-4 rounded-xl border transition-all ${
                          type === 'income'
                            ? 'bg-green-500/20 border-green-400/50 text-green-300 shadow-lg'
                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                        }`}>
                          <div className="text-center font-medium">💰 Доход</div>
                        </div>
                      </label>
                      
                      <label className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={type === 'expense'}
                          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                          className="sr-only"
                          disabled={isSubmitting}
                        />
                        <div className={`p-4 rounded-xl border transition-all ${
                          type === 'expense'
                            ? 'bg-red-500/20 border-red-400/50 text-red-300 shadow-lg'
                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                        }`}>
                          <div className="text-center font-medium">💸 Расход</div>
                        </div>
                      </label>
                    </div>
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
                            {name || 'Название категории'}
                          </div>
                          <div className={`text-sm ${
                            type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {type === 'income' ? 'Доход' : 'Расход'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                {!showDeleteConfirm ? (
                  <div className="flex gap-3">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isSubmitting}
                        className="px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !name.trim()}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {isEditing ? 'Сохранить' : 'Создать'}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-white/90 mb-2">Удалить категорию навсегда?</p>
                      <p className="text-sm text-white/60">
                        Категория &ldquo;{category?.name}&rdquo; будет удалена без возможности восстановления
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
                      >
                        Нет
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}