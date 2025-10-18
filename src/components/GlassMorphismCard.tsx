'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassMorphismCardProps {
  children: ReactNode
  className?: string
  gradient?: string
  delay?: number
}

export function GlassMorphismCard({ 
  children, 
  className = '', 
  gradient = 'from-white/10 to-white/5',
  delay = 0 
}: GlassMorphismCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        duration: 0.6
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 30 }
      }}
      className={`
        premium-card
        hover:shadow-glow-primary
        transition-all duration-300
        relative overflow-hidden
        group
        ${className}
      `}
    >
      {/* Премиальное градиентное свечение при ховере */}
      <motion.div
        className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        initial={false}
      />
      
      {/* Анимированная граница */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        initial={false}
      />
      
      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle shine effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
        style={{
          transform: 'skewX(-45deg)',
        }}
      />
    </motion.div>
  )
}