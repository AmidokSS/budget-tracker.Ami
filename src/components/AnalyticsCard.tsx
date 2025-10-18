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
  
  const getValueColors = () => {
    switch (type) {
      case 'positive':
        return 'text-emerald-300'
      case 'negative':
        return 'text-rose-300'
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

  const getIconGradient = () => {
    switch (type) {
      case 'positive':
        return 'from-emerald-400 to-green-300'
      case 'negative':
        return 'from-rose-400 to-red-300'
      default:
        return 'from-amber-400 to-orange-300'
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
      title={isCurrency && isMobile ? formatCurrency(value) : undefined}
      className="ultra-premium-card h-full min-h-[180px] p-8 cursor-pointer group"
    >
      {/* Ambient content glow */}
      <div className="premium-content-glow h-full flex flex-col justify-between relative z-10">
        
        {/* Header с иконкой и статус-индикатором */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`text-4xl p-4 rounded-2xl bg-gradient-to-br ${
              type === 'positive' ? 'from-emerald-500/15 to-green-500/10' :
              type === 'negative' ? 'from-rose-500/15 to-red-500/10' :
              'from-amber-500/15 to-orange-500/10'
            } border border-amber-400/20 backdrop-blur-sm`}
          >
            <span className="premium-icon text-3xl">{icon}</span>
          </motion.div>
          
          {/* Статус-индикатор с pulse эффектом */}
          <motion.div 
            className={`w-3 h-3 rounded-full ${
              type === 'positive' ? 'bg-emerald-400' : 
              type === 'negative' ? 'bg-rose-400' : 
              'bg-amber-400'
            } shadow-lg`}
            animate={{ 
              boxShadow: [
                `0 0 0 0 ${type === 'positive' ? 'rgba(52, 211, 153, 0.4)' : 
                          type === 'negative' ? 'rgba(251, 113, 133, 0.4)' : 
                          'rgba(251, 191, 36, 0.4)'}`,
                `0 0 0 8px ${type === 'positive' ? 'rgba(52, 211, 153, 0)' : 
                           type === 'negative' ? 'rgba(251, 113, 133, 0)' : 
                           'rgba(251, 191, 36, 0)'}`
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Заголовок */}
        <div className="mb-4">
          <h3 className="premium-subtitle text-sm uppercase tracking-wider font-medium">
            {title}
          </h3>
        </div>
        
        {/* Главное значение с emboss эффектом */}
        <div className="mt-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`premium-value text-4xl xl:text-5xl font-bold tracking-tight ${getValueColors()}`}
            data-value={formatValue(Math.abs(value))}
          >
            <CountUp
              end={Math.abs(value)}
              duration={2.5}
              formattingFn={formatValue}
              prefix={value < 0 ? '-' : ''}
              preserveValue
            />
          </motion.div>
        </div>
      </div>

      {/* Внутренний металлический блеск при hover */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-4 left-4 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-tl from-amber-400/5 to-transparent rounded-full blur-2xl" />
      </motion.div>

    </motion.div>
  )
}