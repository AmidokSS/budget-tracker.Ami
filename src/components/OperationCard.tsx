'use client'

import React, { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Clock, 
  Trash2 
} from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { useAnimationConfig, useConditionalAnimation } from '@/hooks/usePerformance'
import { Operation } from '@/types'

interface OperationCardProps {
  operation: Operation
  index: number
  onDelete: (_operationId: string) => void
}

const OperationCard = memo(({ operation, index, onDelete }: OperationCardProps) => {
  const { formatAmount } = useCurrency()
  const { fadeIn, hover } = useAnimationConfig()

  // Мемоизируем вычисления
  const formattedAmount = useMemo(() => formatAmount(operation.amount), [operation.amount, formatAmount])
  
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(operation.createdAt))
  }, [operation.createdAt])

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(operation.createdAt))
  }, [operation.createdAt])

  const isIncome = useMemo(() => operation.type === 'income', [operation.type])

  // Мемоизируем обработчики событий
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(operation.id)
  }, [operation.id, onDelete])

  // Адаптивные анимации на основе производительности устройства
  const cardAnimation = useConditionalAnimation({
    ...fadeIn,
    transition: {
      ...fadeIn.transition,
      delay: index * 0.05, // Stagger эффект
    }
  })

  const hoverAnimation = useConditionalAnimation(hover)

  const iconComponent = useMemo(() => (
    <div className={`p-2 rounded-lg flex-shrink-0 ${
      isIncome ? 'bg-green-500/20' : 'bg-red-500/20'
    }`}>
      {isIncome ? (
        <ArrowUpCircle className="w-5 h-5 text-green-400" />
      ) : (
        <ArrowDownCircle className="w-5 h-5 text-red-400" />
      )}
    </div>
  ), [isIncome])

  const amountComponent = useMemo(() => (
    <p className={`text-lg font-semibold ${
      isIncome ? 'text-green-400' : 'text-red-400'
    }`}>
      {isIncome ? '+' : '-'}{formattedAmount}
    </p>
  ), [isIncome, formattedAmount])

  return (
    <motion.div
      {...cardAnimation}
      whileHover={hoverAnimation}
      className="group relative w-full bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-transparent hover:border-white/20 shadow-lg hover:shadow-xl overflow-hidden"
    >
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Иконка и основная информация */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {iconComponent}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
              {/* Название и категория */}
              <div className="flex flex-col gap-1">
                {operation.note && (
                  <span className="text-white font-medium truncate">
                    {operation.note}
                  </span>
                )}
                <span className="text-sm px-2 py-1 bg-white/10 rounded text-white/70 w-fit">
                  {operation.category?.emoji} {operation.category?.name}
                </span>
              </div>
              
              {/* Сумма - на мобильных отдельно */}
              <div className="sm:hidden">
                {amountComponent}
              </div>
            </div>
            
            {/* Метаинформация */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Сумма и действия - на десктопе */}
        <div className="hidden sm:flex items-center gap-4">
          {amountComponent}
          
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
            title="Удалить операцию"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Кнопка удаления на мобильных */}
        <div className="sm:hidden flex justify-end">
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
            title="Удалить операцию"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
})

OperationCard.displayName = 'OperationCard'

export { OperationCard }
export default OperationCard