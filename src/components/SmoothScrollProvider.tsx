'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Проверяем только клиентскую сторону
    if (typeof window === 'undefined') return

    // Детектим мобильные устройства более точно
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 1024 
      || 'ontouchstart' in window

    if (isMobile) return // Не используем на мобильных устройствах

    // Инициализируем Lenis с более консервативными настройками
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.7, // Уменьшим чувствительность
      touchMultiplier: 0, // Полностью отключаем touch
      infinite: false,
      autoResize: true,
    })

    lenisRef.current = lenis

    // Сохраняем в глобальный объект для хука
    ;(window as any).lenis = lenis

    let animationId: number

    // Функция анимации с проверкой
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)
      }
      animationId = requestAnimationFrame(raf)
    }

    animationId = requestAnimationFrame(raf)

    // Очистка при размонтировании
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      ;(window as any).lenis = null
    }
  }, [])

  return <>{children}</>
}

// Хук для программного скролла
export function useSmoothScroll() {
  const scrollTo = (target: string | HTMLElement | number, options?: { 
    offset?: number
    duration?: number
    easing?: (t: number) => number
  }) => {
    // Получаем экземпляр Lenis из глобального объекта (если он там есть)
    const lenis = (window as any).lenis
    
    if (!lenis) {
      // Fallback на стандартный скролл если Lenis недоступен
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (typeof target === 'string') {
        const element = document.querySelector(target)
        element?.scrollIntoView({ behavior: 'smooth' })
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    // Используем Lenis для плавного скролла
    if (typeof target === 'number') {
      lenis.scrollTo(target + (options?.offset || 0), {
        duration: options?.duration,
        easing: options?.easing
      })
    } else if (typeof target === 'string') {
      lenis.scrollTo(target, {
        offset: options?.offset,
        duration: options?.duration,
        easing: options?.easing
      })
    } else if (target instanceof HTMLElement) {
      lenis.scrollTo(target, {
        offset: options?.offset,
        duration: options?.duration,
        easing: options?.easing
      })
    }
  }

  return { scrollTo }
}