'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLimits, useDeleteLimit } from '@/hooks/useApi'
import { GradientPage } from '@/components/GradientPage'
import LimitSidebar from '@/components/LimitSidebar'
import LimitCard from '@/components/LimitCard'
import { LazyVirtualizedLimitList } from '@/components/LazyComponents'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { Limit } from '@/types'

export default function LimitsPage() {
  const { data: limits, isLoading, error } = useLimits()
  const deleteLimit = useDeleteLimit()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedLimit, setSelectedLimit] = useState<Limit | null>(null)

  const openEditLimit = useCallback((limit: Limit) => {
    setSelectedLimit(limit)
    setIsSidebarOpen(true)
  }, [])

  const handleDeleteLimit = useCallback(async (limitId: string) => {
    try {
      await deleteLimit.mutateAsync(limitId)
    } catch (error) {
      console.error('Error deleting limit:', error)
    }
  }, [deleteLimit])

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
          {activeLimits.length > 6 ? (
            <LazyVirtualizedLimitList
              limits={activeLimits}
              onEdit={openEditLimit}
              onDelete={handleDeleteLimit}
              height={600}
              itemHeight={120}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeLimits.map((limit, index) => (
                <LimitCard
                  key={limit.id}
                  limit={limit}
                  index={index}
                  onEdit={openEditLimit}
                  onDelete={handleDeleteLimit}
                />
              ))}
            </div>
          )}
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
