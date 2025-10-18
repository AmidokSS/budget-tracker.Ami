'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface CategoryData {
  name: string
  emoji: string
  amount: number
  count: number
  percentage: number
}

interface CategoryChartProps {
  data: CategoryData[]
}

const COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#84CC16', '#F97316', '#6366F1', '#14B8A6'
]

export const CategoryChart = ({ data }: CategoryChartProps) => {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{data.emoji}</span>
            <span className="text-white font-medium">{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="text-white">
              Сумма: <span className="font-semibold">{formatCurrency(data.amount)}</span>
            </div>
            <div className="text-white/70">
              Операций: {data.count}
            </div>
            <div className="text-white/70">
              Доля: {data.percentage.toFixed(1)}%
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, emoji, percentage }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percentage < 5) return null // Не показываем эмодзи для маленьких секторов

    return (
      <text 
        x={x} 
        y={y} 
        fontSize="16"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {emoji}
      </text>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="ultra-premium-card p-6 relative overflow-hidden">
        <div className="premium-content-glow">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 8 }}
              className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/15 border border-indigo-400/25 backdrop-blur-sm"
            >
              <span className="text-lg">📊</span>
            </motion.div>
            <h3 className="premium-title text-lg font-bold">Распределение расходов</h3>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="premium-subtitle">Нет данных для отображения</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ultra-premium-card p-6 relative overflow-hidden"
    >
      <div className="premium-content-glow">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 8 }}
            className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/15 border border-indigo-400/25 backdrop-blur-sm"
          >
            <span className="text-lg">📊</span>
          </motion.div>
          <h3 className="premium-title text-lg font-bold">Распределение расходов</h3>
        </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

        {/* Легенда */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 
                         transition-colors duration-200"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm">{item.emoji}</span>
              <span className="text-sm text-white/70 truncate">{item.name}</span>
              <span className="text-sm text-white ml-auto">
                {item.percentage.toFixed(0)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}