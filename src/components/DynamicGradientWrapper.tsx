'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface DynamicGradientWrapperProps {
  children: ReactNode
}

export function DynamicGradientWrapper({ children }: DynamicGradientWrapperProps) {
  const pathname = usePathname()

  // Мапа градиентов с полными классами для Tailwind
  const getGradientClasses = (path: string) => {
    switch (path) {
      case '/':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800'
      case '/categories':
        return 'bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700'
      case '/goals':
        return 'bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-800'
      case '/limits':
        return 'bg-gradient-to-br from-amber-900 via-orange-800 to-amber-700'
      case '/operations':
        return 'bg-gradient-to-br from-rose-900 via-red-900 to-rose-800'
      case '/analytics':
        return 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800'
      case '/settings':
        return 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700'
      default:
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800'
    }
  }

  const currentGradientClass = getGradientClasses(pathname)

  return (
    <div className="relative min-h-screen">
      {/* Динамический градиентный фон */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className={`fixed inset-0 ${currentGradientClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut" 
          }}
        />
      </AnimatePresence>
      
      {/* Overlay для лучшей читаемости текста */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-[1]" />
      
      {/* Контент поверх градиента */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  )
}