'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery } from './useMediaQuery'

interface PerformanceSettings {
  // Уровень качества анимаций
  animationQuality: 'high' | 'medium' | 'low'
  // Должны ли анимации быть включены
  enableAnimations: boolean
  // Уменьшить количество частиц
  reduceParticles: boolean
  // Использовать простые переходы
  useSimpleTransitions: boolean
  // Префер пользователя для уменьшения движения
  prefersReducedMotion: boolean
}

export const usePerformanceSettings = (): PerformanceSettings => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    animationQuality: 'high',
    enableAnimations: true,
    reduceParticles: false,
    useSimpleTransitions: false,
    prefersReducedMotion: false
  })

  // Media queries для определения производительности
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isLowEndDevice = useMediaQuery('(max-width: 480px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    // Определяем производительность устройства
    const getDevicePerformance = () => {
      // Проверяем аппаратные характеристики
      const connection = (navigator as any).connection
      const memory = (performance as any).memory
      
      let score = 100 // Базовый счёт
      
      // Уменьшаем за мобильное устройство
      if (isMobile) score -= 20
      if (isLowEndDevice) score -= 30
      
      // Проверяем интернет соединение
      if (connection) {
        if (connection.effectiveType === '2g') score -= 40
        if (connection.effectiveType === '3g') score -= 20
        if (connection.saveData) score -= 30
      }
      
      // Проверяем память (если доступно)
      if (memory && memory.usedJSHeapSize) {
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        if (memoryUsage > 0.8) score -= 30
        if (memoryUsage > 0.6) score -= 15
      }
      
      return score
    }

    const deviceScore = getDevicePerformance()
    
    setSettings({
      animationQuality: deviceScore > 70 ? 'high' : deviceScore > 40 ? 'medium' : 'low',
      enableAnimations: !prefersReducedMotion && deviceScore > 30,
      reduceParticles: deviceScore < 60 || isMobile,
      useSimpleTransitions: deviceScore < 50 || prefersReducedMotion,
      prefersReducedMotion
    })
  }, [isMobile, isLowEndDevice, prefersReducedMotion])

  return settings
}

// Хук для получения оптимизированных настроек анимации
export const useOptimizedAnimation = () => {
  const settings = usePerformanceSettings()
  
  const getAnimationConfig = (animationType: 'gentle' | 'standard' | 'intensive') => {
    if (!settings.enableAnimations || settings.prefersReducedMotion) {
      return {
        duration: 0,
        ease: 'linear' as const,
        delay: 0
      }
    }

    if (settings.useSimpleTransitions) {
      return {
        duration: animationType === 'intensive' ? 0.2 : 0.1,
        ease: 'easeOut' as const,
        delay: 0
      }
    }

    // Настройки для разных уровней качества
    switch (settings.animationQuality) {
      case 'high':
        return {
          duration: animationType === 'intensive' ? 0.8 : animationType === 'standard' ? 0.5 : 0.3,
          ease: 'easeOut' as const,
          delay: animationType === 'intensive' ? 0.1 : 0
        }
      case 'medium':
        return {
          duration: animationType === 'intensive' ? 0.5 : animationType === 'standard' ? 0.3 : 0.2,
          ease: 'easeOut' as const,
          delay: 0
        }
      case 'low':
        return {
          duration: animationType === 'intensive' ? 0.3 : 0.2,
          ease: 'easeOut' as const,
          delay: 0
        }
    }
  }

  const getParticleCount = (baseCount: number): number => {
    if (settings.reduceParticles) {
      return Math.max(1, Math.floor(baseCount * 0.3))
    }
    return baseCount
  }

  return {
    settings,
    getAnimationConfig,
    getParticleCount,
    shouldAnimate: settings.enableAnimations && !settings.prefersReducedMotion
  }
}