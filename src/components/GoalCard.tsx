import React, { memo, useMemo, useCallback } from 'react'
import { Target, Edit, Trash2 } from 'lucide-react'
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
  const { formatAmount } = useCurrency()

  // Мемоизируем вычисления прогресса
  const progress = useMemo(() => {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  }, [goal.currentAmount, goal.targetAmount])

  // Мемоизируем форматированные суммы
  const formattedCurrent = useMemo(() => 
    formatAmount(goal.currentAmount), 
    [goal.currentAmount, formatAmount]
  )
  
  const formattedTarget = useMemo(() => 
    formatAmount(goal.targetAmount), 
    [goal.targetAmount, formatAmount]
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
            <p className="text-sm text-gray-600">до {deadlineText}</p>
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
          <span className="text-gray-600">Прогресс</span>
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
            из {formattedTarget}
          </span>
        </div>
      </div>
    </motion.div>
  )
})

GoalCard.displayName = 'GoalCard'

export default GoalCard