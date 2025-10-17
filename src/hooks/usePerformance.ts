'use client'

import React, { useState, useEffect, useMemo } from 'react'

interface PerformanceMetrics {
  deviceMemory: number | null
  hardwareConcurrency: number
  connectionType: string | null
  isLowEnd: boolean
  animationLevel: 'none' | 'reduced' | 'normal' | 'enhanced'
  shouldReduceMotion: boolean
  preferredFrameRate: number
}

// Детектор производительности устройства
export const useDevicePerformance = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    deviceMemory: null,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    connectionType: null,
    isLowEnd: false,
    animationLevel: 'normal',
    shouldReduceMotion: false,
    preferredFrameRate: 60
  })

  useEffect(() => {
    const detectPerformance = () => {
      // @ts-ignore - navigator.deviceMemory может не существовать
      const deviceMemory = navigator.deviceMemory || null
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      
      // @ts-ignore - navigator.connection может не существовать
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const connectionType = connection?.effectiveType || null

      // Определяем медленные устройства
      const isLowMemory = deviceMemory && deviceMemory <= 2
      const isSlowCPU = hardwareConcurrency <= 2
      const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g'
      
      const isLowEnd = isLowMemory || isSlowCPU || isSlowConnection

      // Проверяем настройки системы для уменьшения движения
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Определяем уровень анимации
      let animationLevel: 'none' | 'reduced' | 'normal' | 'enhanced' = 'normal'
      let preferredFrameRate = 60

      if (prefersReducedMotion) {
        animationLevel = 'none'
        preferredFrameRate = 30
      } else if (isLowEnd) {
        animationLevel = 'reduced'
        preferredFrameRate = 30
      } else if (deviceMemory && deviceMemory >= 8 && hardwareConcurrency >= 8) {
        animationLevel = 'enhanced'
        preferredFrameRate = 60
      }

      setMetrics({
        deviceMemory,
        hardwareConcurrency,
        connectionType,
        isLowEnd,
        animationLevel,
        shouldReduceMotion: prefersReducedMotion || isLowEnd,
        preferredFrameRate
      })
    }

    detectPerformance()

    // Слушаем изменения предпочтений пользователя
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => detectPerformance()
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback для старых браузеров
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return metrics
}

// Хук для получения оптимизированных настроек анимации
export const useAnimationConfig = () => {
  const performance = useDevicePerformance()

  return useMemo(() => {
    const config = {
      // Framer Motion конфигурация
      transition: {
        type: 'tween',
        duration: performance.shouldReduceMotion ? 0.1 : 0.3,
        ease: performance.isLowEnd ? 'linear' : 'easeInOut',
      },
      
      // Настройки для различных типов анимации
      spring: performance.shouldReduceMotion ? {
        type: 'tween',
        duration: 0.1,
      } : performance.isLowEnd ? {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      } : {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },

      // Настройки для hover эффектов
      hover: performance.shouldReduceMotion ? {} : {
        scale: performance.isLowEnd ? 1.02 : 1.05,
        transition: {
          type: 'tween',
          duration: performance.isLowEnd ? 0.1 : 0.2,
        }
      },

      // Настройки для появления элементов
      fadeIn: performance.shouldReduceMotion ? {
        opacity: 1,
      } : {
        initial: { opacity: 0, y: performance.isLowEnd ? 10 : 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: performance.isLowEnd ? 0.2 : 0.4,
          ease: performance.isLowEnd ? 'linear' : 'easeOut',
        }
      },

      // Настройки для слайд анимаций
      slideIn: performance.shouldReduceMotion ? {
        x: 0,
      } : {
        initial: { x: performance.isLowEnd ? -20 : -50, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: performance.isLowEnd ? 20 : 50, opacity: 0 },
        transition: {
          type: 'tween',
          duration: performance.isLowEnd ? 0.2 : 0.3,
        }
      },

      // Настройки для стagger анимаций
      stagger: {
        delayChildren: performance.shouldReduceMotion ? 0 : (performance.isLowEnd ? 0.05 : 0.1),
        staggerChildren: performance.shouldReduceMotion ? 0 : (performance.isLowEnd ? 0.02 : 0.05),
      },

      // Глобальные флаги
      disableAnimations: performance.shouldReduceMotion,
      reduceMotion: performance.isLowEnd,
      enableComplexAnimations: performance.animationLevel === 'enhanced',
      frameRate: performance.preferredFrameRate,
    }

    return config
  }, [performance])
}

// Хук для условного применения анимаций
export const useConditionalAnimation = (animationProps: any, fallbackProps?: any) => {
  const { disableAnimations } = useAnimationConfig()
  
  return useMemo(() => {
    if (disableAnimations) {
      return fallbackProps || {}
    }
    return animationProps
  }, [animationProps, fallbackProps, disableAnimations])
}

// Хук для оптимизации обновлений анимации
export const useAnimationFrame = (callback: () => void, deps: any[] = []) => {
  const { frameRate } = useAnimationConfig()
  
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const interval = 1000 / frameRate // Интервал между кадрами

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        callback()
        lastTime = currentTime
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps, frameRate])
}

// Компонент-провайдер для настроек производительности
export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const performance = useDevicePerformance()
  
  useEffect(() => {
    // Устанавливаем CSS переменные для глобального использования
    const root = document.documentElement
    
    root.style.setProperty('--animation-duration', 
      performance.shouldReduceMotion ? '0.1s' : (performance.isLowEnd ? '0.2s' : '0.3s')
    )
    
    root.style.setProperty('--animation-easing', 
      performance.isLowEnd ? 'linear' : 'cubic-bezier(0.4, 0, 0.2, 1)'
    )
    
    root.style.setProperty('--animation-delay', 
      performance.shouldReduceMotion ? '0s' : (performance.isLowEnd ? '0.02s' : '0.05s')
    )

    // Добавляем класс для CSS медиа-запросов
    if (performance.shouldReduceMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }

    if (performance.isLowEnd) {
      document.body.classList.add('low-performance')
    } else {
      document.body.classList.remove('low-performance')
    }
  }, [performance])

  return React.createElement(React.Fragment, null, children)
}

export default useDevicePerformance