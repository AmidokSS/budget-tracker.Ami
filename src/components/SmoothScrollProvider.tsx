'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализируем Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Функция анимации
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Очистка при размонтировании
    return () => {
      lenis.destroy()
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