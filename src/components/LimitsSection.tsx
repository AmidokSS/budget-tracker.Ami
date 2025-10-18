'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface Limit {
  id: string
  categoryName: string
  categoryEmoji: string
  limitAmount: number
  currentAmount: number
  progress: number
  isOverLimit: boolean
  isAutoCreated: boolean
}

interface LimitsSectionProps {
  limits: Limit[]
}

export const LimitsSection = ({ limits }: LimitsSectionProps) => {
  const isMobile = useIsMobile()
  
  const getProgressGradient = (progress: number, isOverLimit: boolean) => {
    if (isOverLimit) return 'from-red-500 to-red-600'
    if (progress >= 90) return 'from-red-400 to-red-500'
    if (progress >= 70) return 'from-yellow-400 to-orange-400'
    return 'from-green-400 to-green-500'
  }

  if (!limits || limits.length === 0) {
    return (
      <div className="ultra-premium-card p-6 relative overflow-hidden">
        <div className="premium-content-glow">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 6 }}
              className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/15 border border-orange-400/25 backdrop-blur-sm"
            >
              <span className="text-lg">🛡️</span>
            </motion.div>
            <h3 className="premium-title text-lg font-bold">Лимиты расходов</h3>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="premium-subtitle">Лимиты не установлены</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ultra-premium-card p-6 relative overflow-hidden"
    >
      <div className="premium-content-glow">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 6 }}
            className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/15 border border-orange-400/25 backdrop-blur-sm"
          >
            <span className="text-lg">🛡️</span>
          </motion.div>
          <h3 className="premium-title text-lg font-bold">Лимиты расходов</h3>
        </div>
      
      <div className="space-y-4">
        {limits.map((limit, index) => (
          <motion.div
            key={limit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative p-4 rounded-xl bg-white/5 border border-white/10
              hover:bg-white/10 transition-all duration-300
              ${limit.isOverLimit ? 'animate-pulse' : ''}
            `}
          >
            {/* Заголовок категории */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-lg flex-shrink-0">{limit.categoryEmoji}</span>
                <span className="text-white font-medium truncate">{limit.categoryName}</span>
                {limit.isAutoCreated && (
                  <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full flex-shrink-0">
                    Авто
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div 
                  className="text-sm text-white/70 cursor-help"
                  title={`${formatCurrency(limit.currentAmount)} / ${formatCurrency(limit.limitAmount)}`}
                >
                  {isMobile ? (
                    <>
                      {formatCurrencyCompact(limit.currentAmount, true)} / {formatCurrencyCompact(limit.limitAmount, true)}
                    </>
                  ) : (
                    <>
                      {formatCurrency(limit.currentAmount)} / {formatCurrency(limit.limitAmount)}
                    </>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  limit.isOverLimit ? 'text-red-400' : 
                  limit.progress >= 90 ? 'text-red-400' :
                  limit.progress >= 70 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {limit.progress.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="relative">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(limit.progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${getProgressGradient(limit.progress, limit.isOverLimit)} 
                            relative overflow-hidden`}
                >
                  {/* Анимированный блеск */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </motion.div>
              </div>

              {/* Индикатор превышения */}
              {limit.isOverLimit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full 
                           flex items-center justify-center"
                >
                  <span className="text-xs text-white">!</span>
                </motion.div>
              )}
            </div>

            {/* Оставшаяся сумма */}
            <div 
              className="mt-2 text-xs text-white/60 cursor-help"
              title={limit.isOverLimit ? 
                `Превышение: ${formatCurrency(limit.currentAmount - limit.limitAmount)}` :
                `Осталось: ${formatCurrency(limit.limitAmount - limit.currentAmount)}`
              }
            >
              {limit.isOverLimit ? (
                <span className="text-red-400">
                  Превышение: {isMobile ? 
                    formatCurrencyCompact(limit.currentAmount - limit.limitAmount, true) :
                    formatCurrency(limit.currentAmount - limit.limitAmount)
                  }
                </span>
              ) : (
                <span>
                  Осталось: {isMobile ? 
                    formatCurrencyCompact(limit.limitAmount - limit.currentAmount, true) :
                    formatCurrency(limit.limitAmount - limit.currentAmount)
                  }
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

        {/* Статистика по лимитам */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-400">
                {limits.filter(l => l.progress < 70).length}
              </div>
              <div className="text-xs text-white/60">Безопасно</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-400">
                {limits.filter(l => l.progress >= 70 && l.progress < 90).length}
              </div>
              <div className="text-xs text-white/60">Внимание</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-400">
                {limits.filter(l => l.isOverLimit).length}
              </div>
              <div className="text-xs text-white/60">Превышено</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}