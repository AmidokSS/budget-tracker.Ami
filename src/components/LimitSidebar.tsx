'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2 } from 'lucide-react'
import { useUpdateLimit, useDeleteLimit } from '@/hooks/useApi'
import { Limit } from '@/types'
import { isPositiveAmount } from '@/lib/currencyUtils'

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
    if (limit) setLimitAmount(String(limit.limitAmount)); else setLimitAmount('')
    setShowDeleteConfirm(false)
  }, [limit, isOpen])

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit || !limitAmount) return
    
    // Проверяем сумму лимита с точной валютной арифметикой
    const parsedLimitAmount = parseFloat(limitAmount.replace(',', '.'))
    if (isNaN(parsedLimitAmount) || !isPositiveAmount(parsedLimitAmount)) return
    
    setIsSubmitting(true)
    try {
      await updateLimit.mutateAsync({ id: limit.id, limitAmount: parsedLimitAmount })
      onSuccess?.(); onClose()
    } catch (err) { 
      // Failed to update limit
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!limit || !showDeleteConfirm) return
    setIsSubmitting(true)
    try {
      await deleteLimit.mutateAsync(limit.id)
      onSuccess?.(); onClose()
    } catch (err) { 
      // Failed to delete limit
    } finally { setIsSubmitting(false); setShowDeleteConfirm(false) }
  }

  const handleClose = () => { if (!isSubmitting) { setShowDeleteConfirm(false); onClose() } }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 backdrop-blur-md premium-sidebar-overlay" onClick={handleClose} />
          <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 300, opacity: { duration: 0.2 } }} className="premium-sidebar fixed right-0 top-0 h-full w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <div className="premium-sidebar-content flex flex-col h-full">
              <div className="premium-sidebar-header flex items-center justify-between p-6">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">Редактировать лимит</h2>
                  {limit?.category && (<p className="text-sm text-yellow-200/70 mt-1 drop-shadow-sm">{limit.category.emoji} {limit.category.name}</p>)}
                </div>
                <motion.button whileHover={{ scale: 1.05, rotate: 90 }} whileTap={{ scale: 0.95 }} onClick={handleClose} disabled={isSubmitting} className="p-2 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 group"><X className="h-5 w-5 text-yellow-100 group-hover:text-white drop-shadow-sm" /></motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="premium-form-group">
                    <label className="premium-form-label">Сумма лимита</label>
                    <motion.input whileFocus={{ scale: 1.02 }} type="number" value={limitAmount} onChange={(e)=>setLimitAmount(e.target.value)} step="0.01" min="0" className="premium-form-input" placeholder="Введите сумму лимита" required />
                    <p className="text-xs text-yellow-200/60 mt-1 drop-shadow-sm">Ежемесячный лимит расходов по категории</p>
                  </div>
                </form>
              </div>
              <div className="premium-sidebar-header flex-shrink-0 p-6 space-y-4">
                {!showDeleteConfirm ? (
                  <div className="premium-sidebar-buttons">
                    <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={()=>setShowDeleteConfirm(true)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4 drop-shadow-sm" />Удалить лимит</motion.button>
                    <div className="premium-sidebar-button-row">
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleClose} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Отмена</motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleSave} disabled={isSubmitting || !limitAmount} className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">{isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3 h-3 drop-shadow-sm" />Сохранить</>}</motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-yellow-100 font-semibold mb-2 drop-shadow-sm">Удалить лимит?</p>
                      <p className="text-sm text-yellow-200/70 drop-shadow-sm">Восстановление будет невозможно</p>
                    </div>
                    <div className="premium-sidebar-button-row">
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={()=>setShowDeleteConfirm(false)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Нет</motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleDelete} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">{isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 className="w-3 h-3 drop-shadow-sm" />Да, удалить</>}</motion.button>
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
