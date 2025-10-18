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

        {/* Премиальная статистика лимитов */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Всего лимитов - с голубым акцентом */}
          <motion.div 
            whileHover={{ 
              scale: 0.999,
              y: 1
            }}
            whileTap={{ 
              scale: 0.998,
              y: 2
            }}
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="premium-title text-lg font-bold mb-2">Всего лимитов</h3>
                  <div className="premium-value text-3xl font-bold text-blue-300" data-value={activeLimits.length}>
                    {activeLimits.length}
                  </div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/15 border border-blue-400/25 backdrop-blur-sm relative"
                >
                  <Shield className="w-8 h-8 premium-icon text-blue-300" />
                  {/* Защитный щит эффект */}
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
                    className="absolute inset-0 border-2 border-blue-400/30 rounded-3xl" 
                  />
                </motion.div>
              </div>
              
              {/* Статусная полоса */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                />
              </div>
            </div>

            {/* Ambient свечение */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-xl pointer-events-none"
            />
          </motion.div>

          {/* Превышенные лимиты - с красным акцентом */}
          <motion.div 
            whileHover={{ 
              scale: 0.999,
              y: 1
            }}
            whileTap={{ 
              scale: 0.998,
              y: 2
            }}
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="premium-title text-lg font-bold mb-2">Превышено</h3>
                  <div className="premium-value text-3xl font-bold text-red-300" data-value={exceededLimits.length}>
                    {exceededLimits.length}
                  </div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/15 border border-red-400/25 backdrop-blur-sm relative"
                >
                  <AlertTriangle className="w-8 h-8 premium-icon text-red-300" />
                  {/* Пульсирующее предупреждение */}
                  {exceededLimits.length > 0 && (
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.2, 0.6]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-red-400/25 rounded-3xl blur-sm" 
                    />
                  )}
                </motion.div>
              </div>
              
              {/* Статусная полоса с предупреждением */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: exceededLimits.length > 0 ? "100%" : "0%"
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-400 to-rose-400 rounded-full"
                />
              </div>
            </div>

            {/* Мигающее предупреждение */}
            {exceededLimits.length > 0 && (
              <motion.div 
                animate={{ 
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-red-400/15 to-transparent rounded-full blur-xl pointer-events-none"
              />
            )}
          </motion.div>

          {/* Лимиты в норме - с зелёным акцентом */}
          <motion.div 
            whileHover={{ 
              scale: 0.999,
              y: 1
            }}
            whileTap={{ 
              scale: 0.998,
              y: 2
            }}
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="premium-title text-lg font-bold mb-2">В норме</h3>
                  <div className="premium-value text-3xl font-bold text-emerald-300" data-value={safeLimits.length}>
                    {safeLimits.length}
                  </div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative"
                >
                  <CheckCircle className="w-8 h-8 premium-icon text-emerald-300" />
                  {/* Успешное свечение */}
                  {safeLimits.length > 0 && (
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.1, 0.4]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-emerald-400/15 rounded-3xl blur-sm" 
                    />
                  )}
                </motion.div>
              </div>
              
              {/* Статусная полоса успеха */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: safeLimits.length > 0 ? "100%" : "0%"
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                />
              </div>
            </div>

            {/* Мягкое зелёное свечение */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/8 to-transparent rounded-full blur-xl pointer-events-none"
            />
          </motion.div>
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



