'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAnalytics, useUsers } from '@/hooks/useApi'
import { useCurrency } from '@/hooks/useCurrency'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { GradientPage } from '@/components/GradientPage'
import { AnalyticsCard } from '@/components/AnalyticsCard'
import { InsightCard } from '@/components/InsightCard'
import { 
  LazyCategoryChart,
  LazyTimelineChart,
  LazyLimitsSection,
  LazyGoalsSection
} from '@/components/LazyComponents'

const PERIOD_OPTIONS = [
  { value: 'last_7_days', label: 'Неделя' },
  { value: 'current_month', label: 'Месяц' },
  { value: 'current_year', label: 'Год' },
  { value: 'all', label: 'Всё время' }
]

export default function AnalyticsPage() {
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_month')
  const isMobile = useIsMobile()

  const { data: users, isLoading: usersLoading } = useUsers()
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(selectedUser, selectedPeriod)
  const { formatAmount, formatCurrencyCompact } = useCurrency()

  if (analyticsLoading || usersLoading) {
    return (
      <GradientPage>
        <div className="max-w-7xl mx-auto section-padding">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-8"
          >
            📊 Аналитика
          </motion.h1>
          
          <div className="flex items-center justify-center h-64">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white/70">Загрузка данных...</p>
            </motion.div>
          </div>
        </div>
      </GradientPage>
    )
  }

  if (!analytics) {
    return (
      <GradientPage>
        <div className="max-w-7xl mx-auto section-padding">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-8"
          >
            📊 Аналитика
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base section-padding text-center"
          >
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-white mb-2">Нет данных</h3>
            <p className="text-slate-400">Пока нет операций для анализа</p>
          </motion.div>
        </div>
      </GradientPage>
    )
  }

  return (
    <GradientPage>
      <div className="max-w-7xl mx-auto section-padding container-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white"
          >
            📊 Аналитика
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">Пользователь:</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 
                          text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                          transition-all duration-200 hover:bg-slate-700/50"
              >
                <option value="all">Все</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id} className="bg-slate-800 text-white">
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">Период:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 
                          text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                          transition-all duration-200 hover:bg-slate-700/50"
              >
                {PERIOD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </motion.div>

        {/* Карточки быстрой статистики */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <AnalyticsCard
            title="Общий баланс"
            value={analytics.summary.balance}
            icon="💰"
            type={analytics.summary.balance >= 0 ? 'positive' : 'negative'}
            isCurrency
          />
          <AnalyticsCard
            title="Общий доход"
            value={analytics.summary.totalIncome}
            icon="📈"
            type="positive"
            isCurrency
          />
          <AnalyticsCard
            title="Общий расход"
            value={analytics.summary.totalExpense}
            icon="📉"
            type="negative"
            isCurrency
          />
          <AnalyticsCard
            title="Средний расход в день"
            value={analytics.summary.avgDailyExpense}
            icon="📅"
            type="neutral"
            isCurrency
          />
          <AnalyticsCard
            title="Выполнено целей"
            value={analytics.goals.completionRate}
            icon="🎯"
            type="positive"
            isPercentage
          />
        </motion.div>

        {/* Основные графики */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Круговая диаграмма расходов */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LazyCategoryChart data={analytics.categoryDistribution} />
          </motion.div>

          {/* Линейный график динамики */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LazyTimelineChart data={analytics.timeline} />
          </motion.div>
        </div>

        {/* Лимиты и цели */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Лимиты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LazyLimitsSection limits={analytics.limits} />
          </motion.div>

          {/* Цели */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LazyGoalsSection goals={analytics.goals} insights={analytics.insights} />
          </motion.div>
        </div>

        {/* Топ категории */}
        {analytics.topCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">🏆 Топ категории расходов</h3>
            <div className="space-y-3">
              {analytics.topCategories.map((category) => (
                <div key={category.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                                                   gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg flex-shrink-0">{category.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-medium block truncate">{category.name}</span>
                      <span className="text-sm text-white/60 block">
                        ({category.count} операций)
                      </span>
                    </div>
                  </div>
                  <div 
                    className="text-right flex-shrink-0 cursor-help"
                    title={`${formatAmount(category.amount)} - ${category.percentage.toFixed(1)}%`}
                  >
                    <div className="text-white font-semibold">
                      {isMobile ? 
                        formatCurrencyCompact(category.amount, true) :
                        formatAmount(category.amount)
                      }
                    </div>
                    <div className="text-sm text-white/60">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Дополнительная аналитика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">🔍 Ключевые инсайты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard
              title="Операций всего"
              value={analytics.summary.operationsCount.toString()}
              icon="📊"
              description="За выбранный период"
            />
            
            <InsightCard
              title="Средняя операция"
              value={isMobile ? 
                formatCurrencyCompact(analytics.insights.avgTransactionAmount, true) :
                formatAmount(analytics.insights.avgTransactionAmount)
              }
              icon="💳"
              description="Средняя сумма операции"
            />
            
            <InsightCard
              title="Соотношение доходов"
              value={`${analytics.insights.incomeVsExpenseRatio.toFixed(2)}x`}
              icon="⚖️"
              trend={analytics.insights.incomeVsExpenseRatio >= 1 ? 'up' : 'down'}
              description={analytics.insights.incomeVsExpenseRatio >= 1 ? 'Доходы больше расходов' : 'Дефицит бюджета'}
            />
          </div>
        </motion.div>
      </div>
    </GradientPage>
  )
}
