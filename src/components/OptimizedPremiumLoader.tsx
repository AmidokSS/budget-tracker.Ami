'use client'

import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { useOptimizedAnimation } from '@/hooks/usePerformanceSettings'
import { SkeletonStats, SkeletonUserCard } from './Skeleton'

export function OptimizedPremiumLoader() {
  const { shouldAnimate, getAnimationConfig } = useOptimizedAnimation()
  const pulseAnimation = getAnimationConfig('gentle')

  if (!shouldAnimate) {
    // Статический loader для слабых устройств
    return (
      <div className="container mx-auto px-4 pt-8 max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <div className="h-8 bg-white/10 rounded-lg w-80 mx-auto"></div>
          <div className="h-6 bg-white/5 rounded w-96 mx-auto"></div>
          <p className="text-cyan-200/70">Загрузка...</p>
        </div>
        
        <SkeletonStats />
        
        <div className="max-w-4xl mx-auto">
          <div className="max-w-[900px] mx-auto flex flex-wrap justify-center gap-8 mt-6">
            <SkeletonUserCard />
            <SkeletonUserCard />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-8 max-w-6xl space-y-8">
      {/* Заголовок с анимацией */}
      <div className="text-center">
        <motion.div
          className="relative mx-auto w-20 h-20 mb-6"
          animate={{ 
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400/50"
            animate={{
              scale: [1, 1.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold heading-gold mb-2 drop-shadow-2xl font-serif"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ ...pulseAnimation, repeat: Infinity }}
        >
          <span className="emoji-color">💰</span> Семейный бюджет
        </motion.h1>
        
        <motion.p
          className="text-lg text-cyan-100/80 mt-2 drop-shadow-lg font-sans"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ ...pulseAnimation, repeat: Infinity, delay: 0.2 }}
        >
          Загрузка премиальных данных...
        </motion.p>
        
        <motion.div
          className="flex items-center justify-center space-x-2 text-sm text-cyan-200/70 mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ ...pulseAnimation, repeat: Infinity, delay: 0.4 }}
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
          />
          <span>Подготовка финансовой аналитики</span>
        </motion.div>
      </div>

      {/* Анимированные скелетоны */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...pulseAnimation, delay: 0.3 }}
      >
        <SkeletonStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...pulseAnimation, delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="max-w-[900px] mx-auto flex flex-wrap justify-center gap-8 mt-6">
          <SkeletonUserCard />
          <SkeletonUserCard />
        </div>
      </motion.div>
    </div>
  )
}