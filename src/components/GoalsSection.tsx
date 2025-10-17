'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface Goals {
  total: number
  completed: number
  completionRate: number
  archived: number
}

interface Insights {
  mostExpensiveCategory: {
    name: string
    emoji: string
    amount: number
  } | null
  avgTransactionAmount: number
  incomeVsExpenseRatio: number
}

interface GoalsSectionProps {
  goals: Goals
  insights: Insights
}

export const GoalsSection = ({ goals, insights }: GoalsSectionProps) => {
  const isMobile = useIsMobile()
  
  const getRatioColor = (ratio: number) => {
    if (ratio >= 1.2) return 'text-green-400'
    if (ratio >= 1) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRatioText = (ratio: number) => {
    if (ratio >= 1.2) return 'Отличный баланс'
    if (ratio >= 1) return 'Стабильный баланс'
    return 'Дефицит бюджета'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">🎯 Цели и аналитика</h3>
      
      <div className="space-y-6">
        {/* Статистика целей */}
        <div className="space-y-4">
          <h4 className="text-lg text-white/80">Выполнение целей</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">{goals.completed}</div>
              <div className="text-sm text-white/60">Завершено</div>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">{goals.total - goals.completed}</div>
              <div className="text-sm text-white/60">Активных</div>
            </motion.div>
          </div>

          {/* Прогресс целей */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Общий прогресс</span>
              <span className="text-white font-medium">{goals.completionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goals.completionRate}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Ключевые показатели */}
        <div className="space-y-4">
          <h4 className="text-lg text-white/80">Ключевые показатели</h4>
          
          <div className="space-y-3">
            {/* Соотношение доходы/расходы */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span className="text-white/70">Баланс доходов</span>
              </div>
              <div className="text-right">
                <div className={`font-medium ${getRatioColor(insights.incomeVsExpenseRatio)}`}>
                  {insights.incomeVsExpenseRatio.toFixed(2)}x
                </div>
                <div className="text-xs text-white/50">
                  {getRatioText(insights.incomeVsExpenseRatio)}
                </div>
              </div>
            </motion.div>

            {/* Средняя сумма операции */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              title={formatCurrency(insights.avgTransactionAmount)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <span className="text-white/70">Средняя операция</span>
              </div>
              <div className="text-white font-medium">
                {isMobile ? 
                  formatCurrencyCompact(insights.avgTransactionAmount, true) :
                  formatCurrency(insights.avgTransactionAmount)
                }
              </div>
            </motion.div>

            {/* Самая затратная категория */}
            {insights.mostExpensiveCategory && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                title={`${insights.mostExpensiveCategory.name}: ${formatCurrency(insights.mostExpensiveCategory.amount)}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">{insights.mostExpensiveCategory.emoji}</span>
                  <span className="text-white/70">Топ расходы</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-medium">
                    {isMobile ? 
                      formatCurrencyCompact(insights.mostExpensiveCategory.amount, true) :
                      formatCurrency(insights.mostExpensiveCategory.amount)
                    }
                  </div>
                  <div className="text-xs text-white/50 truncate max-w-[120px]">
                    {insights.mostExpensiveCategory.name}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Архивированные цели */}
        {goals.archived > 0 && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Архивированные цели</span>
              <span className="text-white/80">{goals.archived}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}