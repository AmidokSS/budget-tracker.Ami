'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLimits } from '@/hooks/useApi'
import { formatCurrency } from '@/lib/utils'
import { GradientPage } from '@/components/GradientPage'
import LimitSidebar from '@/components/LimitSidebar'
import { Shield, AlertTriangle, CheckCircle, Edit3 } from 'lucide-react'
import { Limit } from '@/types'

export default function LimitsPage() {
  const { data: limits, isLoading, error } = useLimits()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedLimit, setSelectedLimit] = useState<Limit | null>(null)

  const openEditLimit = (limit: Limit) => {
    setSelectedLimit(limit)
    setIsSidebarOpen(true)
  }

  if (isLoading) {
    return (
      <GradientPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </GradientPage>
    )
  }

  if (error) {
    return (
      <GradientPage>
        <div className="text-center text-red-400">
          Ошибка загрузки лимитов
        </div>
      </GradientPage>
    )
  }

  const activeLimits = limits || []
  const exceededLimits = activeLimits.filter(limit => limit.currentAmount > limit.limitAmount)

  const safeLimits = activeLimits.filter(limit => {
    const percentage = (limit.currentAmount / limit.limitAmount) * 100
    return percentage < 80
  })

  const getUsagePercentage = (current: number, limit: number) => {
    return limit > 0 ? Math.min((current / limit) * 100, 100) : 0
  }

  const getStatusInfo = (current: number, limit: number) => {
    const percentage = getUsagePercentage(current, limit)
    if (percentage >= 100) return { color: 'red', icon: AlertTriangle, label: 'Превышен' }
    if (percentage >= 80) return { color: 'yellow', icon: AlertTriangle, label: 'Внимание' }
    return { color: 'green', icon: CheckCircle, label: 'В норме' }
  }

  return (
    <>
      <GradientPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-pink-100 to-red-200 bg-clip-text text-transparent mb-4"
          >
            Лимиты
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300"
          >
            Контролируйте свои расходы с помощью лимитов
          </motion.p>
        </div>

        {/* Статистика лимитов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Всего лимитов</h3>
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{activeLimits.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Превышено</h3>
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">{exceededLimits.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">В норме</h3>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{safeLimits.length}</p>
          </div>
        </motion.div>

        {/* Список лимитов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLimits.map((limit, index) => {
              const percentage = getUsagePercentage(limit.currentAmount, limit.limitAmount)
              const status = getStatusInfo(limit.currentAmount, limit.limitAmount)
              const remaining = limit.limitAmount - limit.currentAmount
              
              return (
                <motion.div
                  key={limit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 hover:bg-white/15 group ${
                    status.color === 'red' ? 'border-red-500/50' :
                    status.color === 'yellow' ? 'border-yellow-500/50' : 'border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {limit.category && (
                        <div className="text-2xl flex-shrink-0">
                          {limit.category.emoji}
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {limit.category?.name || 'Общий лимит'}
                        </h3>
                        {limit.isAutoCreated && (
                          <p className="text-sm text-purple-300 mt-1">
                            🪄 создан автоматически
                          </p>
                        )}
                        <p className="text-sm text-gray-400">Месячный лимит</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <status.icon className={`h-5 w-5 ${
                        status.color === 'red' ? 'text-red-400' :
                        status.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <button 
                        onClick={() => openEditLimit(limit)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30"
                        title="Редактировать лимит"
                      >
                        <Edit3 className="h-4 w-4 text-blue-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Использовано:</span>
                        <span className={`font-medium ${
                          status.color === 'red' ? 'text-red-400' :
                          status.color === 'yellow' ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            status.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            status.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Потрачено</p>
                        <p className={`font-semibold ${
                          status.color === 'red' ? 'text-red-400' : 'text-white'
                        }`}>
                          {formatCurrency(limit.currentAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Лимит</p>
                        <p className="text-white font-semibold">{formatCurrency(limit.limitAmount)}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-1">
                        {remaining >= 0 ? 'Остался лимит' : 'Превышение'}
                      </p>
                      <p className={`font-semibold ${
                        remaining >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(Math.abs(remaining))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Пустое состояние */}
        {(!limits || limits.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="mb-6 mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <Shield className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Пока нет лимитов</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Установите лимиты на категории расходов для лучшего контроля бюджета
            </p>
          </motion.div>
        )}
      </div>
    </GradientPage>

    {/* Limit Sidebar */}
    <LimitSidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      limit={selectedLimit}
      onSuccess={() => {
        setIsSidebarOpen(false)
        setSelectedLimit(null)
      }}
    />
  </>
)
}
