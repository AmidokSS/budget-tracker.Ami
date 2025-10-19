'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLimits, useDeleteLimit } from '@/hooks/useApi'
import { GradientPage } from '@/components/GradientPage'
import LimitSidebar from '@/components/LimitSidebar'
import LimitCard from '@/components/LimitCard'
import { LazyVirtualizedLimitList, LazyLimitsStats } from '@/components/LazyComponents'
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

  return (
    <>
      <GradientPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold heading-gold mb-4 drop-shadow-2xl"
          >
            <span className="emoji-color">🛡️</span> Лимиты
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-orange-100/80 drop-shadow-lg"
          >
            Контролируйте свои расходы с помощью премиальных лимитов
          </motion.p>
        </div>

        {/* Мини-статистика лимитов */}
        <LazyLimitsStats limits={activeLimits} />

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



