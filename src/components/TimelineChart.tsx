'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface TimelineData {
  date: string
  income: number
  expense: number
}

interface TimelineChartProps {
  data: TimelineData[]
}

export const TimelineChart = ({ data }: TimelineChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4"
        >
          <h4 className="text-white font-medium mb-2">{date}</h4>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-white/70">
                  {entry.dataKey === 'income' ? 'Доход' : 'Расход'}:
                </span>
                <span className="text-sm text-white font-medium">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="text-sm text-white/70">
              Баланс: 
              <span className={`ml-1 font-medium ${
                payload[0].payload.income - payload[0].payload.expense >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {formatCurrency(payload[0].payload.income - payload[0].payload.expense)}
              </span>
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📈 Динамика доходов и расходов</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/70">Нет данных для отображения</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">📈 Динамика доходов и расходов</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Линия доходов */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={3}
              dot={{
                fill: '#10B981',
                strokeWidth: 2,
                stroke: '#ffffff',
                r: 4
              }}
              activeDot={{
                r: 6,
                fill: '#10B981',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              animationDuration={1000}
            />
            
            {/* Линия расходов */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{
                fill: '#EF4444',
                strokeWidth: 2,
                stroke: '#ffffff',
                r: 4
              }}
              activeDot={{
                r: 6,
                fill: '#EF4444',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Легенда */}
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 rounded" />
          <span className="text-sm text-white/70">📈 Доходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500 rounded" />
          <span className="text-sm text-white/70">📉 Расходы</span>
        </div>
      </div>
    </motion.div>
  )
}