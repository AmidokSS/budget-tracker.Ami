import React, { memo, useMemo, useCallback } from 'react'
import { Shield, Edit, Trash2, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Limit } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'

interface LimitCardProps {
  limit: Limit
  index: number
  onEdit: (_limit: Limit) => void
  onDelete: (_limitId: string) => void
}

const LimitCard = memo(({ limit, index, onEdit, onDelete }: LimitCardProps) => {
  const { formatAmount } = useCurrency()

  // Мемоизируем вычисления прогресса
  const progress = useMemo(() => {
    return limit.limitAmount > 0 ? (limit.currentAmount / limit.limitAmount) * 100 : 0
  }, [limit.currentAmount, limit.limitAmount])

  // Мемоизируем форматированные суммы
  const formattedCurrent = useMemo(() => 
    formatAmount(limit.currentAmount), 
    [limit.currentAmount, formatAmount]
  )
  
  const formattedLimit = useMemo(() => 
    formatAmount(limit.limitAmount), 
    [limit.limitAmount, formatAmount]
  )

  // Мемоизируем оставшуюся сумму
  const remaining = useMemo(() => {
    const remainingAmount = limit.limitAmount - limit.currentAmount
    return formatAmount(Math.max(0, remainingAmount))
  }, [limit.limitAmount, limit.currentAmount, formatAmount])

  // Мемоизируем цвет прогресса
  const progressColor = useMemo(() => {
    if (progress >= 100) return 'from-red-500 to-red-600'
    if (progress >= 80) return 'from-orange-400 to-red-400'
    if (progress >= 60) return 'from-yellow-400 to-orange-400'
    if (progress >= 40) return 'from-green-400 to-yellow-400'
    return 'from-green-400 to-green-500'
  }, [progress])

  // Мемоизируем статус лимита
  const limitStatus = useMemo(() => {
    if (progress >= 100) return { text: 'Превышен', color: 'text-red-600' }
    if (progress >= 80) return { text: 'Близко к лимиту', color: 'text-orange-600' }
    if (progress >= 60) return { text: 'Осторожно', color: 'text-yellow-600' }
    return { text: 'В норме', color: 'text-green-600' }
  }, [progress])

  // Мемоизируем обработчики событий
  const handleEdit = useCallback(() => {
    onEdit(limit)
  }, [limit, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(limit.id)
  }, [limit.id, onDelete])

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
        
        {/* Header with warning styling */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`p-4 rounded-2xl border backdrop-blur-sm ${
              progress >= 100 
                ? 'bg-gradient-to-br from-rose-500/15 to-red-500/10 border-rose-400/20' 
                : progress >= 80 
                ? 'bg-gradient-to-br from-orange-500/15 to-amber-500/10 border-orange-400/20'
                : 'bg-gradient-to-br from-emerald-500/15 to-green-500/10 border-emerald-400/20'
            }`}
          >
            <Shield className={`w-7 h-7 premium-icon ${
              progress >= 100 ? 'text-rose-400' : progress >= 80 ? 'text-orange-400' : 'text-emerald-400'
            }`} />
          </motion.div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
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

        {/* Category and status */}
        <div className="mb-6">
          <h3 className="premium-title text-2xl font-bold mb-3 leading-tight">
            {limit.category?.emoji} {limit.category?.name || 'Общий лимит'}
          </h3>
          
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ultra-premium-card border ${
            progress >= 100 ? 'border-rose-400/20' : progress >= 80 ? 'border-orange-400/20' : 'border-emerald-400/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              progress >= 100 ? 'bg-rose-400' : progress >= 80 ? 'bg-orange-400' : 'bg-emerald-400'
            }`} />
            <span className={`premium-subtitle text-sm ${limitStatus.color}`}>
              {limitStatus.text}
            </span>
          </div>
        </div>

        {/* Premium progress section */}
        <div className="flex-1 flex flex-col justify-end">
          
          {/* Progress bar with warning colors */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <span className="premium-subtitle text-sm">Использовано</span>
              <span className={`text-lg font-bold ${
                progress >= 100 ? 'text-rose-300' : progress >= 80 ? 'text-orange-300' : 'text-emerald-300'
              }`}>
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
                {/* Warning pulse effect for exceeded limits */}
                {progress >= 100 && (
                  <motion.div
                    className="absolute inset-0 bg-rose-400/30 rounded-full"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Amount display with emboss effect */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="premium-subtitle text-sm block mb-1">Потрачено</span>
              <div className={`premium-value text-2xl font-bold ${
                progress >= 100 ? 'text-rose-300' : progress >= 80 ? 'text-orange-300' : 'text-emerald-300'
              }`} data-value={formatAmount(limit.currentAmount)}>
                {formatAmount(limit.currentAmount)}
              </div>
            </div>
            <div>
              <span className="premium-subtitle text-sm block mb-1">Лимит</span>
              <div className="premium-value text-2xl font-bold text-amber-300" data-value={formatAmount(limit.limitAmount)}>
                {formatAmount(limit.limitAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning ambient lighting */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className={`absolute top-6 right-6 w-32 h-32 rounded-full blur-2xl ${
          progress >= 100 
            ? 'bg-gradient-to-br from-rose-400/8 to-transparent' 
            : progress >= 80 
            ? 'bg-gradient-to-br from-orange-400/8 to-transparent'
            : 'bg-gradient-to-br from-emerald-400/8 to-transparent'
        }`} />
      </motion.div>
    </motion.div>
  )
})

LimitCard.displayName = 'LimitCard'

export default LimitCard