'use client'

import React, { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Clock, 
  Trash2,
  User
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
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99, y: 1 }}
      className="group relative w-full ultra-premium-card transition-all duration-400 cursor-pointer"
    >
      {/* Premium content glow */}
      <div className="premium-content-glow">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          
          {/* Enhanced icon with luxury styling */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`p-3 sm:p-4 rounded-2xl flex-shrink-0 border relative ${
              isIncome 
                ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/15 border-emerald-400/25' 
                : 'bg-gradient-to-br from-rose-500/20 to-red-500/15 border-rose-400/25'
            } backdrop-blur-sm`}
          >
            {isIncome ? (
              <ArrowUpCircle className="w-6 h-6 sm:w-8 sm:h-8 premium-icon text-emerald-300" />
            ) : (
              <ArrowDownCircle className="w-6 h-6 sm:w-8 sm:h-8 premium-icon text-rose-300" />
            )}
            
            {/* Subtle animation ring */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 border rounded-2xl ${
                isIncome ? 'border-emerald-400/20' : 'border-rose-400/20'
              }`}
            />
          </motion.div>
          
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              
              {/* Left side - info */}
              <div className="flex-1 min-w-0">
                
                {/* Category and note */}
                <div className="mb-3">
                  {/* Category block - icon and name together */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -1 }}
                    className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl backdrop-blur-sm mb-2"
                  >
                    <motion.span 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="text-xl sm:text-2xl"
                    >
                      {operation.category?.emoji || '💰'}
                    </motion.span>
                    <span className="premium-subtitle text-sm sm:text-base font-medium text-white/90">
                      {operation.category?.name || 'Без категории'}
                    </span>
                  </motion.div>
                  
                  {/* Note/Title */}
                  {operation.note && operation.note !== operation.category?.name && (
                    <h3 className="premium-title text-base sm:text-lg font-semibold">
                      {operation.note}
                    </h3>
                  )}
                </div>

                {/* User and metadata - Mobile Layout */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-6 sm:gap-y-2">
                  {/* User info */}
                  {operation.user && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-lg sm:rounded-xl border border-blue-400/25 backdrop-blur-sm"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-blue-400/40 flex items-center justify-center backdrop-blur-sm shadow-lg"
                      >
                        <span className="text-xs sm:text-sm text-blue-200 font-bold tracking-wide">
                          {operation.user.name.charAt(0).toUpperCase()}
                        </span>
                      </motion.div>
                      <div className="flex flex-col">
                        <span className="premium-subtitle text-xs sm:text-sm font-semibold text-blue-200">
                          {operation.user.name}
                        </span>
                        <span className="text-xs text-blue-300/60 hidden sm:block">
                          Автор операции
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Date and time - Mobile compact */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 premium-icon opacity-60" />
                      <span className="premium-subtitle text-xs sm:text-sm opacity-80">
                        {formattedDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 premium-icon opacity-60" />
                      <span className="premium-subtitle text-xs sm:text-sm opacity-80">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - amount and actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                
                {/* Amount with enhanced styling */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-right"
                >
                  <div className={`premium-value text-xl sm:text-2xl font-bold tracking-tight ${
                    isIncome ? 'text-emerald-300' : 'text-rose-300'
                  }`}>
                    {isIncome ? '+' : '-'}{formattedAmount}
                  </div>
                </motion.div>

                {/* Delete button */}
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="opacity-60 group-hover:opacity-100 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 hover:shadow-glow-danger border border-red-500/25"
                  title="Удалить операцию"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

OperationCard.displayName = 'OperationCard'

export { OperationCard }
export default OperationCard