'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'

interface InsightCardProps {
  title: string
  value: string
  icon: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}

const InsightCard = memo(({ title, value, icon, trend, description }: InsightCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-300'
      case 'down':
        return 'text-rose-300'
      default:
        return 'text-amber-300'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '📊'
    }
  }

  const getTrendGradient = () => {
    switch (trend) {
      case 'up':
        return 'from-emerald-500/15 to-green-500/10 border-emerald-400/20'
      case 'down':
        return 'from-rose-500/15 to-red-500/10 border-rose-400/20'
      default:
        return 'from-amber-500/15 to-orange-500/10 border-amber-400/20'
    }
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 0.999,
        y: 1
      }}
      whileTap={{ 
        scale: 0.998,
        y: 2
      }}
      className="ultra-premium-card p-6 cursor-pointer group h-full min-h-[140px]"
    >
      {/* Premium content glow */}
      <div className="premium-content-glow h-full flex flex-col justify-between">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Premium icon container */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`p-3 rounded-2xl bg-gradient-to-br ${getTrendGradient()} border backdrop-blur-sm`}
            >
              <span className="premium-icon text-2xl">{icon}</span>
            </motion.div>
            
            <div>
              <h4 className="premium-subtitle text-sm mb-1">{title}</h4>
              <div className={`premium-value text-xl font-bold ${getTrendColor()}`} data-value={value}>
                {value}
              </div>
              {description && (
                <p className="premium-subtitle text-xs mt-2 max-w-[150px]">{description}</p>
              )}
            </div>
          </div>
          
          {/* Trend indicator */}
          {trend && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl premium-icon"
            >
              {getTrendIcon()}
            </motion.div>
          )}
        </div>
      </div>

      {/* Luxury ambient lighting */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className={`absolute top-4 right-4 w-24 h-24 rounded-full blur-xl ${
          trend === 'up' ? 'bg-gradient-to-br from-emerald-400/8 to-transparent' :
          trend === 'down' ? 'bg-gradient-to-br from-rose-400/8 to-transparent' :
          'bg-gradient-to-br from-amber-400/8 to-transparent'
        }`} />
      </motion.div>

    </motion.div>
  )
})

InsightCard.displayName = 'InsightCard'

export { InsightCard }