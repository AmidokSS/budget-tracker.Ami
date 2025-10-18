import React, { memo, useMemo, useCallback } from 'react'
import { Target, Edit, Trash2, Edit3, Clock, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { Goal } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'

interface GoalCardProps {
  goal: Goal
  index: number
  onEdit: (_goal: Goal) => void
  onDelete: (_goalId: string) => void
  onFund?: (_goal: Goal) => void // Добавляем опциональную функцию финансирования
}

const GoalCard = memo(({ goal, index, onEdit, onDelete, onFund: _onFund }: GoalCardProps) => {
  const { formatAmountWhole } = useCurrency()

  // Мемоизируем вычисления прогресса
  const progress = useMemo(() => {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  }, [goal.currentAmount, goal.targetAmount])

  // Мемоизируем форматированные суммы
  const formattedCurrent = useMemo(() => 
    formatAmountWhole(goal.currentAmount), 
    [goal.currentAmount, formatAmountWhole]
  )
  
  const formattedTarget = useMemo(() => 
    formatAmountWhole(goal.targetAmount), 
    [goal.targetAmount, formatAmountWhole]
  )

  // Мемоизируем дату дедлайна
  const deadlineText = useMemo(() => {
    if (!goal.deadline) return 'Без срока'
    
    const deadline = new Date(goal.deadline)
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Просрочено'
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Завтра'
    if (diffDays < 7) return `${diffDays} дн.`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} нед.`
    return `${Math.ceil(diffDays / 30)} мес.`
  }, [goal.deadline])

  // Мемоизируем цвет прогресса
  const progressColor = useMemo(() => {
    if (progress >= 100) return 'from-green-500 to-emerald-500'
    if (progress >= 75) return 'from-green-400 to-green-500'
    if (progress >= 50) return 'from-yellow-400 to-orange-400'
    if (progress >= 25) return 'from-orange-400 to-red-400'
    return 'from-red-400 to-red-500'
  }, [progress])

  // Мемоизируем обработчики событий
  const handleEdit = useCallback(() => {
    onEdit(goal)
  }, [goal, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(goal.id)
  }, [goal.id, onDelete])

  const handleFund = useCallback(() => {
    if (_onFund) {
      _onFund(goal)
    }
  }, [goal, _onFund])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      whileHover={{ 
        scale: 0.999,
        y: 1
      }}
      whileTap={{ 
        scale: 0.998,
        y: 2
      }}
      className="ultra-premium-card p-8 cursor-pointer group h-full min-h-[280px]"
    >
      {/* Premium content glow */}
      <div className="premium-content-glow h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/20 backdrop-blur-sm"
          >
            <span className="premium-icon text-4xl">{goal.emoji}</span>
          </motion.div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFund}
              className="p-2 rounded-xl ultra-premium-card border border-emerald-400/20"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="p-2 rounded-xl ultra-premium-card border border-amber-400/20"
            >
              <Edit3 className="w-4 h-4 premium-icon" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="p-2 rounded-xl ultra-premium-card border border-rose-400/20"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
            </motion.button>
          </div>
        </div>

        {/* Goal title and status */}
        <div className="mb-6">
          <h3 className="premium-title text-2xl font-bold mb-3 leading-tight">
            {goal.title}
          </h3>
          
          {deadlineText && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 premium-icon" />
              <span className="premium-subtitle text-sm">
                до {deadlineText}
              </span>
            </div>
          )}
        </div>

        {/* Premium progress section */}
        <div className="flex-1 flex flex-col justify-end">
          
          {/* Progress bar with luxury styling */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <span className="premium-subtitle text-sm">Прогресс</span>
              <span className="premium-title text-lg font-bold">
                {progress.toFixed(0)}%
              </span>
            </div>
            
            <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-amber-400/20">
              <motion.div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${progressColor} rounded-full shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ 
                  duration: 1.5, 
                  delay: index * 0.2,
                  ease: "easeOut" 
                }}
              >
                {/* Inner glow for progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
              
              {/* Shimmer effect on progress bar */}
              <motion.div
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-32, 200] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              />
            </div>
          </div>

          {/* Amount display with emboss effect */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="premium-subtitle text-sm block mb-1">Накоплено</span>
              <div className="premium-value text-2xl font-bold text-emerald-300" data-value={formatAmountWhole(goal.currentAmount)}>
                {formatAmountWhole(goal.currentAmount)}
              </div>
            </div>
            <div>
              <span className="premium-subtitle text-sm block mb-1">Цель</span>
              <div className="premium-value text-2xl font-bold text-amber-300" data-value={formatAmountWhole(goal.targetAmount)}>
                {formatAmountWhole(goal.targetAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury ambient lighting */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-amber-400/8 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-tl from-emerald-400/6 to-transparent rounded-full blur-xl" />
      </motion.div>

    </motion.div>
  )
})

GoalCard.displayName = 'GoalCard'

export default GoalCard

