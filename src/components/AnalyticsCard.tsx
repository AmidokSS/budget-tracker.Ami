'use client'

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface AnalyticsCardProps {
  title: string
  value: number
  icon: string
  type: 'positive' | 'negative' | 'neutral'
  isCurrency?: boolean
  isPercentage?: boolean
}

export const AnalyticsCard = ({ 
  title, 
  value, 
  icon, 
  type, 
  isCurrency = false, 
  isPercentage = false 
}: AnalyticsCardProps) => {
  const isMobile = useIsMobile()
  
  const getTypeColors = () => {
    switch (type) {
      case 'positive':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'negative':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30'
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
    }
  }

  const getValueColors = () => {
    switch (type) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-white'
    }
  }

  const formatValue = (val: number) => {
    if (isCurrency) {
      return isMobile ? formatCurrencyCompact(val, true) : formatCurrency(val)
    }
    if (isPercentage) {
      return `${val.toFixed(1)}%`
    }
    return val.toLocaleString()
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      whileTap={{ scale: 0.95 }}
      title={isCurrency && isMobile ? formatCurrency(value) : undefined}
      className={`
        relative p-6 rounded-2xl bg-gradient-to-br ${getTypeColors()}
        backdrop-blur-sm border transition-all duration-300
        hover:shadow-xl hover:shadow-white/10
        transform-gpu perspective-1000 cursor-help
      `}
    >
      {/* Светящийся эффект */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent 
                      opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{icon}</span>
          <div className={`w-2 h-2 rounded-full ${
            type === 'positive' ? 'bg-green-400' : 
            type === 'negative' ? 'bg-red-400' : 'bg-blue-400'
          } animate-pulse`} />
        </div>
        
        <h3 className="text-sm text-white/70 mb-2">{title}</h3>
        
        <div className={`text-2xl font-bold ${getValueColors()}`}>
          <CountUp
            end={Math.abs(value)}
            duration={2}
            formattingFn={formatValue}
            prefix={value < 0 ? '-' : ''}
            preserveValue
          />
        </div>
      </div>

      {/* Анимированные частицы */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}