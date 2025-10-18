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
            className="text-3xl font-bold heading-gold mb-8 drop-shadow-lg"
          >
            <span className="emoji-color">📊</span> Премиальная аналитика
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
                className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4 shadow-glow-primary"
              />
              <p className="text-cyan-100/70 drop-shadow-sm">Загрузка премиальных данных...</p>
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
            className="text-3xl font-bold heading-gold mb-8 drop-shadow-lg"
          >
            <span className="emoji-color">📊</span> Премиальная аналитика
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card section-padding text-center border border-cyan-500/30 shadow-glow-primary backdrop-blur-xl"
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
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center relative mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 3, 0, -3, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/15 border border-indigo-400/25 backdrop-blur-sm relative">
              <span className="text-4xl">📊</span>
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1.6],
                  opacity: [0.4, 0.2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 border border-indigo-400/30 rounded-3xl"
              />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold heading-gold mb-4 drop-shadow-2xl">
            Премиальная аналитика
          </h1>
          <p className="premium-subtitle text-lg max-w-2xl mx-auto">
            Глубокий анализ ваших финансовых данных с интеллектуальными инсайтами
          </p>
        </motion.div>

        {/* Premium Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ultra-premium-card p-6 mb-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1">
                <label className="premium-subtitle text-sm block mb-3">Пользователь</label>
                <motion.select
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm 
                            border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                            transition-all duration-300 hover:bg-white/15 cursor-pointer"
                >
                  <option value="all" className="bg-slate-800 text-white">👥 Все пользователи</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id} className="bg-slate-800 text-white">
                      👤 {user.name}
                    </option>
                  ))}
                </motion.select>
              </div>

              <div className="flex-1">
                <label className="premium-subtitle text-sm block mb-3">Период анализа</label>
                <motion.select
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm 
                            border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                            transition-all duration-300 hover:bg-white/15 cursor-pointer"
                >
                  {PERIOD_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      📅 {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Премиальные карточки аналитики */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {/* Общий баланс - адаптивная карточка */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-2xl backdrop-blur-sm ${
                    analytics.summary.balance >= 0 
                      ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25'
                      : 'bg-gradient-to-br from-red-500/20 to-rose-500/15 border border-red-400/25'
                  }`}
                >
                  <span className="text-2xl">💰</span>
                </motion.div>
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-3 h-3 rounded-full ${
                    analytics.summary.balance >= 0 ? 'bg-emerald-400/40' : 'bg-red-400/40'
                  } blur-sm`}
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Общий баланс</p>
                <div className={`premium-value text-2xl font-bold ${
                  analytics.summary.balance >= 0 ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {isMobile ? 
                    formatCurrencyCompact(analytics.summary.balance, true) :
                    formatAmount(analytics.summary.balance)
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Общий доход - с зелёными эффектами */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative"
                >
                  <span className="text-2xl">📈</span>
                  {/* Волны успеха */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1.6],
                      opacity: [0.4, 0.2, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border border-emerald-400/30 rounded-2xl"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    y: [-5, 5, -5],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-6 bg-emerald-400/30 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Общий доход</p>
                <div className="premium-value text-2xl font-bold text-emerald-300">
                  {isMobile ? 
                    formatCurrencyCompact(analytics.summary.totalIncome, true) :
                    formatAmount(analytics.summary.totalIncome)
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Общий расход - с красными предупреждениями */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.4,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/15 border border-red-400/25 backdrop-blur-sm relative"
                >
                  <span className="text-2xl">📉</span>
                  {/* Пульсирующие предупреждения */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-red-400/25 rounded-2xl blur-sm"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-red-400/40 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Общий расход</p>
                <div className="premium-value text-2xl font-bold text-red-300">
                  {isMobile ? 
                    formatCurrencyCompact(analytics.summary.totalExpense, true) :
                    formatAmount(analytics.summary.totalExpense)
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Средний расход/день - с синими индикаторами */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/15 border border-blue-400/25 backdrop-blur-sm relative"
                >
                  <span className="text-2xl">📅</span>
                  {/* Медленное вращение индикатора */}
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 border border-blue-400/20 rounded-2xl"
                    style={{
                      borderTopColor: 'rgba(59, 130, 246, 0.4)'
                    }}
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    x: [0, 10, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-8 h-1 bg-blue-400/30 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Средний расход/день</p>
                <div className="premium-value text-2xl font-bold text-blue-300">
                  {isMobile ? 
                    formatCurrencyCompact(analytics.summary.avgDailyExpense, true) :
                    formatAmount(analytics.summary.avgDailyExpense)
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Выполнено целей - с фиолетовыми достижениями */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.6,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -2
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/15 border border-purple-400/25 backdrop-blur-sm relative"
                >
                  <span className="text-2xl">🎯</span>
                  {/* Концентрические круги достижений */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0.1, 0.4]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border border-purple-400/30 rounded-2xl"
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1.2, 1.6, 1.2],
                      opacity: [0.2, 0.05, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                    className="absolute inset-0 border border-purple-400/20 rounded-2xl"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400/60 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Выполнено целей</p>
                <div className="premium-value text-2xl font-bold text-purple-300">
                  {analytics.goals.completionRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Ambient освещение для целей */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-xl pointer-events-none"
            />
          </motion.div>
        </motion.div>

        {/* Charts Section */}
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

        {/* Analytics Sections */}
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

        {/* Premium Top Categories */}
        {analytics.topCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="ultra-premium-card p-8 relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/15 border border-amber-400/25 backdrop-blur-sm"
                >
                  <span className="text-2xl">🏆</span>
                </motion.div>
                <div>
                  <h3 className="premium-title text-2xl font-bold">Топ категории расходов</h3>
                  <p className="premium-subtitle">Наиболее затратные направления</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {analytics.topCategories.map((category, index) => (
                  <motion.div 
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                               gap-4 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl 
                               border border-white/10 backdrop-blur-sm group hover:border-amber-400/30 
                               transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 
                                   border border-amber-400/20 backdrop-blur-sm flex-shrink-0"
                      >
                        <span className="text-xl">{category.emoji}</span>
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <div className="premium-title text-base font-semibold text-white mb-1 truncate">
                          {category.name}
                        </div>
                        <div className="premium-subtitle text-sm">
                          {category.count} операций
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="premium-value text-lg font-bold text-amber-300">
                          {isMobile ? 
                            formatCurrencyCompact(category.amount, true) :
                            formatAmount(category.amount)
                          }
                        </div>
                        <div className="premium-subtitle text-sm">
                          {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                      
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 
                                   border border-amber-400/20 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-lg font-bold text-amber-400">#{index + 1}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="ultra-premium-card p-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 8 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/15 border border-violet-400/25 backdrop-blur-sm"
              >
                <span className="text-2xl">🔍</span>
              </motion.div>
              <div>
                <h3 className="premium-title text-2xl font-bold">Ключевые инсайты</h3>
                <p className="premium-subtitle">Детальный анализ ваших финансовых показателей</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl p-6 border border-blue-400/20 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <div className="premium-value text-xl font-bold text-blue-300">
                      {analytics.summary.operationsCount}
                    </div>
                    <div className="premium-subtitle text-sm">Операций всего</div>
                  </div>
                </div>
                <div className="premium-subtitle text-xs">За выбранный период</div>
                <motion.div 
                  className="absolute bottom-0 right-0 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-2xl p-6 border border-emerald-400/20 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <div className="premium-value text-xl font-bold text-emerald-300">
                      {isMobile ? 
                        formatCurrencyCompact(analytics.insights.avgTransactionAmount, true) :
                        formatAmount(analytics.insights.avgTransactionAmount)
                      }
                    </div>
                    <div className="premium-subtitle text-sm">Средняя операция</div>
                  </div>
                </div>
                <div className="premium-subtitle text-xs">Средняя сумма операции</div>
                <motion.div 
                  className="absolute bottom-0 right-0 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-gradient-to-br rounded-2xl p-6 border backdrop-blur-sm relative overflow-hidden group ${
                  analytics.insights.incomeVsExpenseRatio >= 1
                    ? 'from-emerald-500/10 to-green-500/5 border-emerald-400/20'
                    : 'from-red-500/10 to-rose-500/5 border-red-400/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl border ${
                    analytics.insights.incomeVsExpenseRatio >= 1
                      ? 'bg-emerald-500/20 border-emerald-400/30'
                      : 'bg-red-500/20 border-red-400/30'
                  }`}>
                    <span className="text-lg">⚖️</span>
                  </div>
                  <div>
                    <div className={`premium-value text-xl font-bold ${
                      analytics.insights.incomeVsExpenseRatio >= 1 ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {analytics.insights.incomeVsExpenseRatio.toFixed(2)}x
                    </div>
                    <div className="premium-subtitle text-sm">Соотношение доходов</div>
                  </div>
                </div>
                <div className="premium-subtitle text-xs">
                  {analytics.insights.incomeVsExpenseRatio >= 1 ? 'Доходы больше расходов' : 'Дефицит бюджета'}
                </div>
                <motion.div 
                  className={`absolute bottom-0 right-0 w-16 h-16 rounded-full blur-xl ${
                    analytics.insights.incomeVsExpenseRatio >= 1 ? 'bg-emerald-400/10' : 'bg-red-400/10'
                  }`}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </GradientPage>
  )
}



