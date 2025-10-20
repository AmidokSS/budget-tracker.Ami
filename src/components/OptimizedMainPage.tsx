/**
 * 🎯 Optimized Main Page Component
 * Мемоизированный компонент главной страницы с адаптивными анимациями
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useOptimizedAnimation } from '@/hooks/usePerformanceSettings'
import { useDeviceOptimization } from '@/components/index-optimized'
import { GradientPage } from '@/components/GradientPage'
import { FloatingParticles } from '@/components/FloatingParticles'
import { StarryBackground } from '@/components/StarryBackground'
import { OptimizedPremiumLoader } from '@/components/OptimizedPremiumLoader'

// 🔄 Мемоизированные подкомпоненты
const UserStatsCard = React.memo(({ stats }: { stats: any }) => (
  <div className="ultra-premium-card bg-white/10 border-white/20 backdrop-blur-md p-6">
    <h3 className="text-xl text-white mb-4">📊 Статистика</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-white/80">Операции</p>
        <p className="text-2xl font-bold text-white">{stats.operations}</p>
      </div>
      <div>
        <p className="text-white/80">Категории</p>
        <p className="text-2xl font-bold text-white">{stats.categories}</p>
      </div>
    </div>
  </div>
))
UserStatsCard.displayName = 'UserStatsCard'

const PremiumFeatureCard = React.memo(({ feature }: { feature: any }) => (
  <motion.div
    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-white/20"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{feature.icon}</span>
      <h3 className="text-white font-semibold">{feature.title}</h3>
    </div>
    <p className="text-white/80 text-sm">{feature.description}</p>
  </motion.div>
))
PremiumFeatureCard.displayName = 'PremiumFeatureCard'

const StatsCard = React.memo(({ title, value, subtitle, icon }: { 
  title: string, 
  value: number, 
  subtitle: string, 
  icon: string 
}) => (
  <div className="ultra-premium-card bg-white/10 border-white/20 backdrop-blur-md p-6">
    <h3 className="text-xl text-white mb-4">{icon} {title}</h3>
    <p className="text-3xl font-bold text-green-400">{value}</p>
    <p className="text-white/60">{subtitle}</p>
  </div>
))
StatsCard.displayName = 'StatsCard'

// 🎯 Основной компонент (мемоизированный)
const OptimizedMainPage = React.memo(() => {
  const { shouldAnimate, getAnimationConfig } = useOptimizedAnimation()
  const { isMobile, shouldLazyLoad } = useDeviceOptimization()
  
  // 📊 Оптимизированные запросы данных
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        operations: Math.floor(Math.random() * 100),
        categories: Math.floor(Math.random() * 20),
        goals: Math.floor(Math.random() * 10),
        limits: Math.floor(Math.random() * 15)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false
  })

  // 🎨 Премиум функции
  const premiumFeatures = React.useMemo(() => [
    {
      icon: '📊',
      title: 'Продвинутая аналитика',
      description: 'Глубокие инсайты и прогнозы'
    },
    {
      icon: '🎯',
      title: 'Умные цели',
      description: 'ИИ-помощник для планирования'
    },
    {
      icon: '🔔',
      title: 'Уведомления',
      description: 'Персонализированные напоминания'
    }
  ], [])

  // ⚡ Анимационные конфигурации
  const containerVariants = React.useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldAnimate ? 0.6 : 0.1,
        staggerChildren: shouldAnimate ? 0.1 : 0
      }
    }
  }), [shouldAnimate])

  const itemVariants = React.useMemo(() => ({
    hidden: { y: shouldAnimate ? 30 : 0, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: shouldAnimate ? 0.4 : 0.1 }
    }
  }), [shouldAnimate])

  if (statsLoading) {
    return <OptimizedPremiumLoader />
  }

  return (
    <GradientPage gradient="bg-gradient-to-br from-violet-600 via-purple-700 to-blue-800">
      {/* 🎨 Декоративные элементы (условный рендеринг) */}
      {!isMobile && shouldAnimate && (
        <>
          <StarryBackground />
          <FloatingParticles />
        </>
      )}

      <motion.div
        className="min-h-screen p-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 🏠 Заголовок */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            💰 Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Tracker</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Управляйте финансами с премиум-дизайном и инновационными возможностями
          </p>
        </motion.div>

        {/* 📊 Статистика */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          <UserStatsCard stats={userStats} />
          
          <StatsCard 
            title="Цели"
            value={userStats?.goals || 0}
            subtitle="активных"
            icon="🎯"
          />

          <StatsCard 
            title="Лимиты"
            value={userStats?.limits || 0}
            subtitle="установлено"
            icon="🚨"
          />

          <div className="ultra-premium-card bg-white/10 border-white/20 backdrop-blur-md p-6">
            <h3 className="text-xl text-white mb-4">⭐ Premium</h3>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold inline-block">
              Активен
            </div>
          </div>
        </motion.div>

        {/* 🎨 Премиум функции */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            ✨ Премиум возможности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <PremiumFeatureCard key={index} feature={feature} />
            ))}
          </div>
        </motion.div>

        {/* 🚀 Действия */}
        <motion.div 
          className="text-center space-y-4"
          variants={itemVariants}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <button className="premium-button bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
              📊 Аналитика
            </button>
            <button className="premium-button bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
              📱 Операции
            </button>
            <button className="premium-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
              🎯 Цели
            </button>
          </div>
        </motion.div>
      </motion.div>
    </GradientPage>
  )
})

OptimizedMainPage.displayName = 'OptimizedMainPage'

export default OptimizedMainPage