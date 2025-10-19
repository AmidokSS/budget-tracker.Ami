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
  '🎮', '🛍️', '🚬', '🐾', '📱', '💻',
  '🏥', '🎓', '💊', '🎵', '⛽', '☕',
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

  useEffect(() => {
    if (!isOpen) return
    const root = document.documentElement
    const body = document.body
    const count = Number(root.dataset.sidebarCount || '0') + 1
    root.dataset.sidebarCount = String(count)
    const prevRootOverflow = root.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevTouch = (body.style as any).touchAction || ''
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    ;(body.style as any).touchAction = 'none'
    ;(body.style as any).overscrollBehavior = 'contain'
    root.classList.add('sidebar-open')
    body.classList.add('sidebar-open')
    return () => {
      const current = Number(root.dataset.sidebarCount || '1') - 1
      root.dataset.sidebarCount = String(Math.max(0, current))
      if (current <= 0) {
        root.style.overflow = prevRootOverflow
        body.style.overflow = prevBodyOverflow
        ;(body.style as any).touchAction = prevTouch
        ;(body.style as any).overscrollBehavior = ''
        root.classList.remove('sidebar-open')
        body.classList.remove('sidebar-open')
      }
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({ id: category.id, name: name.trim(), type, emoji })
      } else {
        await createCategory.mutateAsync({ name: name.trim(), type, emoji })
      }
      onSuccess?.(); onClose()
    } catch (err) {
      // Failed to save category
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!category || !showDeleteConfirm) return
    setIsSubmitting(true)
    try {
      await deleteCategory.mutateAsync(category.id)
      onSuccess?.(); onClose()
    } catch (err) {
      // Failed to delete category
    } finally { setIsSubmitting(false); setShowDeleteConfirm(false) }
  }

  const handleClose = () => {
    if (!isSubmitting) { setShowDeleteConfirm(false); onClose() }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 backdrop-blur-md premium-sidebar-overlay" onClick={handleClose} />
          <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 300, opacity: { duration: 0.2 } }} className="premium-sidebar overflow-hidden fixed right-0 top-0 h-full w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <div className="premium-sidebar-content flex flex-col h-full">
              <div className="premium-sidebar-header p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">{isEditing ? 'Редактировать категорию' : 'Создать категорию'}</h2>
                <motion.button whileHover={{ scale: 1.05, rotate: 90 }} whileTap={{ scale: 0.95 }} onClick={handleClose} disabled={isSubmitting} className="p-2 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 group">
                  <X className="w-5 h-5 text-yellow-100 group-hover:text-white drop-shadow-sm" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="premium-form-label">Название</label>
                    <input className="premium-form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Название категории" required />
                  </div>
                  <div>
                    <label className="premium-form-label">Тип</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-4 rounded-xl border-2 cursor-pointer ${type==='income'?'border-green-400/60 bg-gradient-to-r from-green-500/20 to-emerald-500/20':'border-white/20 bg-white/5'}`}>
                        <input type="radio" name="ctype" className="sr-only" checked={type==='income'} onChange={()=>setType('income')} />
                        <div className="text-center font-semibold">💰 Доход</div>
                      </label>
                      <label className={`p-4 rounded-xl border-2 cursor-pointer ${type==='expense'?'border-red-400/60 bg-gradient-to-r from-red-500/20 to-rose-500/20':'border-white/20 bg-white/5'}`}>
                        <input type="radio" name="ctype" className="sr-only" checked={type==='expense'} onChange={()=>setType('expense')} />
                        <div className="text-center font-semibold">💸 Расход</div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="premium-form-label">Эмодзи</label>
                    <div className="grid grid-cols-8 gap-2">
                      {emojiOptions.map((e)=> (
                        <button key={e} type="button" onClick={()=>setEmoji(e)} className={`p-2 rounded-lg border ${emoji===e?'border-amber-400/60 bg-white/10':'border-white/10 hover:bg-white/5'}`}><span className="text-xl">{e}</span></button>
                      ))}
                    </div>
                  </div>
                  <div className="premium-sidebar-buttons">
                    {isEditing && (
                      <motion.button type="button" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={()=>setShowDeleteConfirm(true)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Удалить категорию</motion.button>
                    )}
                    <div className="premium-sidebar-button-row">
                      <motion.button type="button" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleClose} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Отмена</motion.button>
                      <motion.button type="submit" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting || !name.trim()} className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">{isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3 h-3" />{isEditing?'Сохранить':'Создать'}</>}</motion.button>
                    </div>
                  </div>
                </form>
                {showDeleteConfirm && (
                  <div className="p-6">
                    <div className="text-center mb-3">
                      <p className="text-yellow-100 font-semibold mb-2">Удалить категорию навсегда?</p>
                      <p className="text-sm text-yellow-200/70">Категория будет удалена без возможности восстановления</p>
                    </div>
                    <div className="premium-sidebar-button-row">
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={()=>setShowDeleteConfirm(false)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Нет</motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={async()=>{ await handleDelete() }} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">{isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 className="w-3 h-3" />Да, удалить</>}</motion.button>
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
