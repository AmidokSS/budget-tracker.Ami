/**
 * 🚀 Enhanced Lazy Loading Components
 * Улучшенная система ленивой загрузки с code splitting и preloading
 */

'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useDeviceOptimization } from './index-optimized'
import { OptimizedPremiumLoader } from './OptimizedPremiumLoader'

// 🎯 Оптимизированные загрузчики для разных типов контента
export const ChartLoader = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-white/20 rounded w-1/3"></div>
      <div className="h-64 bg-white/10 rounded"></div>
    </div>
  </div>
)

export const StatsLoader = () => (
  <div className="ultra-premium-card p-6 mb-8 animate-pulse">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/20 rounded w-24"></div>
          <div className="h-6 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
)

// 🎨 Анимированный загрузчик для декоративных компонентов
const DecorativeLoader = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-sm rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="w-6 h-6 border border-white/20 border-t-white/40 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </motion.div>
)

// 📋 Загрузчик для сайдбаров
const SidebarLoader = () => (
  <div className="fixed inset-y-0 right-0 w-96 bg-white/5 backdrop-blur-md border-l border-white/10 z-50">
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/2"></div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-20 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

// 🚀 Enhanced динамические компоненты с оптимизациями
export const LazyStarryBackground = dynamic(() => 
  import('./StarryBackground').then(mod => ({ default: mod.StarryBackground })), {
  loading: () => <DecorativeLoader />,
  ssr: false // Отключаем SSR для декоративных компонентов
})

export const LazyFloatingParticles = dynamic(() => 
  import('./FloatingParticles').then(mod => ({ default: mod.FloatingParticles })), {
  loading: () => <DecorativeLoader />,
  ssr: false
})

// 🎯 Условные wrapper компоненты
export const ConditionalStarryBackground = ({ shouldRender = true }: { shouldRender?: boolean }) => {
  const { isMobile } = useDeviceOptimization()
  
  if (!shouldRender || isMobile) return null
  
  return <LazyStarryBackground />
}

export const ConditionalFloatingParticles = ({ shouldRender = true }: { shouldRender?: boolean }) => {
  const { isMobile } = useDeviceOptimization()
  
  if (!shouldRender || isMobile) return null
  
  return <LazyFloatingParticles />
}

// 🚀 Hook для preloading критичных компонентов
export const useComponentPreloader = () => {
  const { deviceType } = useDeviceOptimization()
  
  React.useEffect(() => {
    // Preload через 3 секунды после загрузки страницы
    const preloadTimer = setTimeout(() => {
      if (deviceType === 'desktop') {
        // Preload декоративных компонентов для desktop
        import('./StarryBackground')
        import('./FloatingParticles')
      }
      
      // Preload критичных компонентов
      import('./AddOperationSidebar')
      import('./AdvancedOperationsTable')
    }, 3000)
    
    return () => clearTimeout(preloadTimer)
  }, [deviceType])
  
  const preloadComponent = React.useCallback((componentName: string) => {
    return import(`./${componentName}`)
  }, [])
  
  return { preloadComponent }
}

// 🎭 HOC для добавления lazy loading к компонентам
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  FallbackComponent?: React.ComponentType,
  options: { ssr?: boolean } = { ssr: true }
) {
  return dynamic(importFunc, {
    loading: FallbackComponent ? () => <FallbackComponent /> : undefined,
    ssr: options.ssr
  })
}

// 🎯 Performance wrapper для условного рендеринга
export const PerformanceAwareComponent = ({ 
  children, 
  fallback, 
  condition = true 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  condition?: boolean
}) => {
  const { isMobile, shouldLazyLoad } = useDeviceOptimization()
  
  if (!condition) return <>{fallback}</>
  
  if (isMobile && shouldLazyLoad) {
    return (
      <Suspense fallback={fallback || <OptimizedPremiumLoader />}>
        {children}
      </Suspense>
    )
  }
  
  return <>{children}</>
}