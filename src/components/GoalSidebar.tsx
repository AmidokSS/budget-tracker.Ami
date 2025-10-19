'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2 } from 'lucide-react'
import { useCreateGoal, useUpdateGoal, useAddToGoal, useWithdrawFromGoal, useDeleteGoal } from '@/hooks/useApi'
import { Goal } from '@/types'
import { createCurrency, isPositiveAmount } from '@/lib/currencyUtils'
import { useCurrency } from '@/hooks/useCurrency'

interface GoalSidebarProps {
  isOpen: boolean
  onClose: () => void
  goal?: Goal | null
  mode?: 'create' | 'edit' | 'fund' | 'withdraw'
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
  const [deadline, setDeadline] = useState<string>('')
  const [emoji, setEmoji] = useState('💰')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [fundAmount, setFundAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const addToGoal = useAddToGoal()
  const withdrawFromGoal = useWithdrawFromGoal()
  const deleteGoal = useDeleteGoal()
  
  const { formatAmount } = useCurrency()

  const isEditing = !!goal && mode !== 'fund' && mode !== 'withdraw'
  const isFunding = mode === 'fund'
  const isWithdrawing = mode === 'withdraw'

  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setTargetAmount(String(goal.targetAmount))
      setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : '')
      setEmoji(goal.emoji)
      setPriority(goal.priority || 'medium')
    } else {
      setTitle('')
      setTargetAmount('')
      setDeadline('')
      setEmoji('💰')
      setPriority('medium')
    }
    setShowDeleteConfirm(false)
    setIsSubmitting(false)
    setFundAmount('')
  }, [goal, mode, isOpen])

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
    if (isSubmitting) return

    if (isFunding) {
      if (!fundAmount || !goal) return
      
      // Проверяем сумму с точной валютной арифметикой
      const parsedAmount = parseFloat(fundAmount.replace(',', '.'))
      if (isNaN(parsedAmount) || !isPositiveAmount(parsedAmount)) return
      
      setIsSubmitting(true)
      try {
        await addToGoal.mutateAsync({ id: goal.id, addAmount: parsedAmount })
        onSuccess?.(); onClose()
      } catch (err) {
        // Failed to fund goal
      } finally { setIsSubmitting(false) }
      return
    }

    if (isWithdrawing) {
      if (!fundAmount || !goal) return
      
      // Проверяем сумму с точной валютной арифметикой
      const parsedAmount = parseFloat(fundAmount.replace(',', '.'))
      if (isNaN(parsedAmount) || !isPositiveAmount(parsedAmount)) return
      
      // Проверяем, что сумма не превышает накопленную
      if (parsedAmount > goal.currentAmount) return
      
      setIsSubmitting(true)
      try {
        await withdrawFromGoal.mutateAsync({ id: goal.id, withdrawAmount: parsedAmount })
        onSuccess?.(); onClose()
      } catch (err) {
        // Failed to withdraw from goal
      } finally { setIsSubmitting(false) }
      return
    }

    if (!title.trim() || !targetAmount) return
    
    // Проверяем целевую сумму с точной валютной арифметикой
    const parsedTargetAmount = parseFloat(targetAmount.replace(',', '.'))
    if (isNaN(parsedTargetAmount) || !isPositiveAmount(parsedTargetAmount)) return
    
    setIsSubmitting(true)
    try {
      if (isEditing && goal) {
        await updateGoal.mutateAsync({ id: goal.id, title: title.trim(), targetAmount: parsedTargetAmount, deadline: deadline || undefined, emoji, priority })
      } else {
        await createGoal.mutateAsync({ title: title.trim(), targetAmount: parsedTargetAmount, deadline: deadline || undefined, emoji, priority })
      }
      onSuccess?.(); onClose()
    } catch (err) {
      // Failed to save goal
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!goal || !showDeleteConfirm) return
    setIsSubmitting(true)
    try {
      await deleteGoal.mutateAsync(goal.id)
      onSuccess?.(); onClose()
    } catch (err) {
      // Failed to delete goal
    } finally { setIsSubmitting(false); setShowDeleteConfirm(false) }
  }

  const handleClose = () => {
    if (!isSubmitting) { setShowDeleteConfirm(false); onClose() }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 backdrop-blur-md premium-sidebar-overlay"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, opacity: { duration: 0.2 } }}
            className="premium-sidebar overflow-hidden fixed right-0 top-0 h-full w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="premium-sidebar-content flex flex-col h-full">
              <div className="premium-sidebar-header p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-sm">
                  {isFunding ? 'Пополнить цель' : isWithdrawing ? 'Снять средства' : (isEditing ? 'Редактировать цель' : 'Создать цель')}
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

              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {!isFunding && !isWithdrawing && (
                    <>
                      <div>
                        <label className="premium-form-label">Название цели</label>
                        <input className="premium-form-input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Например, Подушка безопасности" required />
                      </div>
                      <div>
                        <label className="premium-form-label">Сумма</label>
                        <input type="number" className="premium-form-input" value={targetAmount} onChange={(e)=>setTargetAmount(e.target.value)} min="0" step="0.01" required />
                      </div>
                      <div>
                        <label className="premium-form-label">Дедлайн (необязательно)</label>
                        <input type="date" className="premium-form-input" value={deadline} onChange={(e)=>setDeadline(e.target.value)} />
                      </div>
                      <div>
                        <label className="premium-form-label">Эмодзи</label>
                        <div className="grid grid-cols-8 gap-2">
                          {emojiOptions.map((em)=> (
                            <button key={em} type="button" onClick={()=>setEmoji(em)} className={`p-2 rounded-lg border ${emoji===em?'border-amber-400/60 bg-white/10':'border-white/10 hover:bg-white/5'}`}>
                              <span className="text-xl">{em}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="premium-form-label">Приоритет</label>
                        <select className="premium-form-input" value={priority} onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}>
                          <option value="high">🔥 Высокий</option>
                          <option value="medium">⚖️ Средний</option>
                          <option value="low">🕐 Низкий</option>
                        </select>
                      </div>
                    </>
                  )}

                  {isFunding && (
                    <div>
                      <label className="premium-form-label">Сумма пополнения</label>
                      <input type="number" className="premium-form-input" value={fundAmount} onChange={(e)=>setFundAmount(e.target.value)} min="0" step="0.01" required />
                    </div>
                  )}

                  {isWithdrawing && goal && (
                    <div>
                      <label className="premium-form-label">Сумма для снятия</label>
                      <input 
                        type="number" 
                        className="premium-form-input" 
                        value={fundAmount} 
                        onChange={(e)=>setFundAmount(e.target.value)} 
                        min="0" 
                        max={goal.currentAmount}
                        step="0.01" 
                        required 
                        placeholder={`Доступно: ${formatAmount(goal.currentAmount)}`}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Доступно для снятия: {formatAmount(goal.currentAmount)}
                      </div>
                    </div>
                  )}

                  <div className="premium-sidebar-buttons">
                    {isEditing && !isFunding && (
                      <motion.button type="button" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={()=>setShowDeleteConfirm(true)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact premium-sidebar-button-full disabled:opacity-50 flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> Удалить цель
                      </motion.button>
                    )}
                    <div className="premium-sidebar-button-row">
                      <motion.button type="button" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleClose} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Отмена</motion.button>
                      <motion.button type="submit" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-primary premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">
                        {isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3 h-3" />{isFunding? 'Пополнить' : isWithdrawing ? 'Снять' : (isEditing? 'Сохранить' : 'Создать')}</>}
                      </motion.button>
                    </div>
                  </div>
                </form>

                {showDeleteConfirm && (
                  <div className="p-6">
                    <div className="text-center mb-3">
                      <p className="text-yellow-100 font-semibold mb-2">Удалить цель навсегда?</p>
                      <p className="text-sm text-yellow-200/70">Цель будет удалена без возможности восстановления</p>
                    </div>
                    <div className="premium-sidebar-button-row">
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={()=>setShowDeleteConfirm(false)} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-secondary premium-sidebar-button-compact disabled:opacity-50">Нет</motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleDelete} disabled={isSubmitting} className="premium-sidebar-button premium-sidebar-button-danger premium-sidebar-button-compact disabled:opacity-50 flex items-center justify-center gap-1">
                        {isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 className="w-3 h-3" />Да, удалить</>}
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
