'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientPageProps {
  children: ReactNode
  gradient?: string
  className?: string
}

export function GradientPage({
  children,
  gradient,
  className,
}: GradientPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={cn(
        'min-h-screen w-full pt-20 md:pt-20', 
        // Только применяем градиент если он передан явно (для обратной совместимости)
        gradient && `bg-gradient-to-br ${gradient}`, 
        className
      )}
    >
      {/* Content */}
      <div className="relative">{children}</div>
    </motion.div>
  )
}
