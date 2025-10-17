'use client'

import { motion } from 'framer-motion'

interface InsightCardProps {
  title: string
  value: string
  icon: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}

export const InsightCard = ({ title, value, icon, trend, description }: InsightCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-blue-400'
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

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 2 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 
                 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="text-white/80 text-sm">{title}</h4>
            <div className={`text-lg font-semibold ${getTrendColor()}`}>
              {value}
            </div>
            {description && (
              <p className="text-xs text-white/50 mt-1">{description}</p>
            )}
          </div>
        </div>
        {trend && (
          <span className="text-lg">{getTrendIcon()}</span>
        )}
      </div>
    </motion.div>
  )
}