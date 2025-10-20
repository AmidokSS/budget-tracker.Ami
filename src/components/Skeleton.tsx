'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animate = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded'
  
  const variantClasses = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }
  
  const style = {
    width: width,
    height: height || (variant === 'text' ? '1rem' : undefined)
  }

  const shimmerAnimation = {
    backgroundPosition: ['200% 0', '-200% 0'],
  }

  const Component = animate ? motion.div : 'div'
  const animationProps = animate ? {
    animate: shimmerAnimation,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className} bg-size-200`}
      style={{
        ...style,
        backgroundImage: animate ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' : undefined,
        backgroundSize: animate ? '200% 100%' : undefined
      }}
      {...animationProps}
    />
  )
}

// Готовые компоненты для разных типов контента
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`ultra-premium-card p-6 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="90%" />
      </div>
    </div>
  )
}

export function SkeletonUserCard({ className = '' }: { className?: string }) {
  return (
    <div className={`
      relative overflow-hidden w-full md:w-[calc(50%-1rem)] min-h-[320px]
      bg-gradient-to-br from-slate-900/95 via-indigo-900/90 to-purple-900/95
      backdrop-blur-2xl rounded-[2rem] 
      border border-white/10
      shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
      ${className}
    `}>
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Верхняя часть */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton variant="circular" width={64} height={64} />
          <div className="space-y-2">
            <Skeleton width={120} height={24} />
            <Skeleton width={100} height={16} />
          </div>
        </div>

        {/* Средняя часть - баланс */}
        <div className="flex-1 flex flex-col justify-center text-center mb-8">
          <Skeleton width={200} height={48} className="mx-auto mb-2" />
          <Skeleton width={100} height={16} className="mx-auto" />
        </div>

        {/* Нижняя часть - доходы и расходы */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-emerald-500/10 rounded-2xl p-4">
            <Skeleton width={60} height={16} className="mb-2" />
            <Skeleton width={80} height={20} />
          </div>
          <div className="bg-rose-500/10 rounded-2xl p-4">
            <Skeleton width={60} height={16} className="mb-2" />
            <Skeleton width={80} height={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonStats({ className = '' }: { className?: string }) {
  return (
    <div className={`ultra-premium-card p-10 relative overflow-hidden ${className}`}>
      <div className="premium-content-glow">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <Skeleton width={300} height={32} className="mx-auto mb-4" />
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <Skeleton variant="circular" width={96} height={96} />
              </div>
              <Skeleton width={120} height={20} className="mx-auto" />
              <Skeleton width={150} height={32} className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}