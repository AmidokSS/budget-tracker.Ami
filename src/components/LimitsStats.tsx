'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Limit } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'
import { 
  getLimitProgress, 
  isLimitExceeded, 
  getRemainingAmount,
  getDaysUntilReset,
  getPeriodLabel 
} from '@/lib/limitUtils'

interface LimitsStatsProps {
  limits: Limit[]
}

export default function LimitsStats({ limits }: LimitsStatsProps) {
  const { formatAmountWhole } = useCurrency()

  // Мемоизируем вычисления статистики
  const stats = useMemo(() => {
    if (!limits || limits.length === 0) {
      return {
        totalLimitAmount: 0,
        totalCurrentAmount: 0,
        totalRemainingAmount: 0,
        averageUsage: 0,
        exceededCount: 0,
        nearLimitCount: 0,
        safeCount: 0,
        nextResetDays: null,
        monthlyLimits: 0,
        weeklyLimits: 0
      }
    }

    const totalLimitAmount = limits.reduce((sum, limit) => sum + limit.limitAmount, 0)
    const totalCurrentAmount = limits.reduce((sum, limit) => sum + limit.currentAmount, 0)
    const totalRemainingAmount = limits.reduce((sum, limit) => sum + getRemainingAmount(limit), 0)
    
    const averageUsage = totalLimitAmount > 0 ? (totalCurrentAmount / totalLimitAmount) * 100 : 0
    
    // Категоризация лимитов по состоянию
    const exceededCount = limits.filter(limit => isLimitExceeded(limit)).length
    const nearLimitCount = limits.filter(limit => {
      const progress = getLimitProgress(limit)
      return progress >= 80 && progress < 100
    }).length
    const safeCount = limits.filter(limit => getLimitProgress(limit) < 80).length
    
    // Ближайший сброс
    const nextResetDays = Math.min(...limits.map(limit => getDaysUntilReset(limit)))
    
    // Подсчет по периодам
    const monthlyLimits = limits.filter(limit => limit.period === 'monthly').length
    const weeklyLimits = limits.filter(limit => limit.period === 'weekly').length

    return {
      totalLimitAmount,
      totalCurrentAmount,
      totalRemainingAmount,
      averageUsage,
      exceededCount,
      nearLimitCount,
      safeCount,
      nextResetDays: nextResetDays === Infinity ? null : nextResetDays,
      monthlyLimits,
      weeklyLimits
    }
  }, [limits])

  const getUsageColor = (usage: number) => {
    if (usage >= 100) return 'text-red-400'
    if (usage >= 80) return 'text-orange-400'
    return 'text-emerald-400'
  }

  const getUsageBgColor = (usage: number) => {
    if (usage >= 100) return 'from-red-500/20 to-rose-500/20'
    if (usage >= 80) return 'from-orange-500/20 to-amber-500/20'
    return 'from-emerald-500/20 to-green-500/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.1,
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="ultra-premium-card p-6 mb-8"
    >
      <div className="premium-content-glow">
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-400/20"
          >
            <Target className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold heading-gold">Статистика лимитов</h2>
            <p className="text-sm text-cyan-100/80">Общий обзор ваших финансовых лимитов</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Общая сумма лимитов */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-blue-500/10 to-indigo-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">ЛИМИТЫ</span>
            </div>
            <div className="premium-value text-2xl font-bold text-blue-300 mb-1">
              {formatAmountWhole(stats.totalLimitAmount)}
            </div>
            <p className="text-xs text-slate-400">Общая сумма лимитов</p>
          </motion.div>

          {/* Потрачено */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className={`premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br ${getUsageBgColor(stats.averageUsage)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stats.averageUsage >= 100 ? 'bg-red-500/20' : stats.averageUsage >= 80 ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
                <TrendingDown className={`w-4 h-4 ${getUsageColor(stats.averageUsage)}`} />
              </div>
              <span className="text-xs text-slate-400 font-medium">ПОТРАЧЕНО</span>
            </div>
            <div className={`premium-value text-2xl font-bold mb-1 ${getUsageColor(stats.averageUsage)}`}>
              {formatAmountWhole(stats.totalCurrentAmount)}
            </div>
            <p className="text-xs text-slate-400">
              {stats.averageUsage.toFixed(1)}% от лимитов
            </p>
          </motion.div>

          {/* Остается */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-emerald-500/10 to-green-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">ОСТАЕТСЯ</span>
            </div>
            <div className="premium-value text-2xl font-bold text-emerald-300 mb-1">
              {formatAmountWhole(stats.totalRemainingAmount)}
            </div>
            <p className="text-xs text-slate-400">Доступно для трат</p>
          </motion.div>

          {/* Следующий сброс */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-slate-400 font-medium">СБРОС</span>
            </div>
            <div className="premium-value text-2xl font-bold text-purple-300 mb-1">
              {stats.nextResetDays !== null ? `${stats.nextResetDays}д` : '—'}
            </div>
            <p className="text-xs text-slate-400">До следующего сброса</p>
          </motion.div>
        </div>

        {/* Детальная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Состояние лимитов */}
          <div className="premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/30 to-slate-800/20">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Состояние лимитов
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  Превышены
                </span>
                <span className="text-sm font-medium text-red-400">{stats.exceededCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  Близко к лимиту
                </span>
                <span className="text-sm font-medium text-orange-400">{stats.nearLimitCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  В безопасности
                </span>
                <span className="text-sm font-medium text-emerald-400">{stats.safeCount}</span>
              </div>
            </div>
          </div>

          {/* Периоды лимитов */}
          <div className="premium-stat-card p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/30 to-slate-800/20">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Периоды
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  Ежемесячные
                </span>
                <span className="text-sm font-medium text-blue-400">{stats.monthlyLimits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  Еженедельные
                </span>
                <span className="text-sm font-medium text-purple-400">{stats.weeklyLimits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Всего лимитов
                </span>
                <span className="text-sm font-medium text-white">{limits.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Прогресс-бар общего использования */}
        <div className="mt-6 p-4 rounded-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/20 to-slate-800/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-200">Общее использование лимитов</span>
            <span className={`text-sm font-bold ${getUsageColor(stats.averageUsage)}`}>
              {stats.averageUsage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-amber-400/20">
            <motion.div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                stats.averageUsage >= 100 ? 'from-red-400 to-red-500' :
                stats.averageUsage >= 80 ? 'from-orange-400 to-orange-500' :
                'from-emerald-400 to-emerald-500'
              } rounded-full shadow-lg`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.averageUsage, 100)}%` }}
              transition={{ 
                duration: 1.5, 
                delay: 0.3,
                ease: "easeOut" 
              }}
            >
              {stats.averageUsage >= 100 && (
                <motion.div
                  className="absolute inset-0 bg-rose-400/30 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}