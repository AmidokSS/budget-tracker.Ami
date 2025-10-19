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

    // Инициализируем Lenis только на десктопе
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 0, // Отключаем на touch устройствах
    })

    lenisRef.current = lenis

    // Сохраняем в глобальный объект для хука
    ;(window as any).lenis = lenis

    // Функция анимации
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)
      }
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Очистка при размонтировании
    return () => {
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
    if (lenis) {
      lenis.scrollTo(target, options)
    } else {
      // Fallback к обычному скроллу
      if (typeof target === 'string') {
        const element = document.querySelector(target)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return { scrollTo }
}