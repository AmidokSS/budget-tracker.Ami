import React, { memo, useMemo, useCallback } from 'react'
import { Shield, Edit, Trash2 } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {limit.category?.name || 'Общий лимит'}
            </h3>
            <p className={`text-sm font-medium ${limitStatus.color}`}>
              {limitStatus.text}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Потрачено</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">
            {formattedCurrent}
          </span>
          <span className="text-sm text-gray-600">
            из {formattedLimit}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Осталось:</span>
            <span className={`text-sm font-medium ${progress >= 100 ? 'text-red-600' : 'text-green-600'}`}>
              {progress >= 100 ? `Превышено на ${formatAmount(limit.currentAmount - limit.limitAmount)}` : remaining}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

LimitCard.displayName = 'LimitCard'

export default LimitCard