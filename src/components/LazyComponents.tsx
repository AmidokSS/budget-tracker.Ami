'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Компоненты загрузки для разных типов контента
export const ChartLoader = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-white/20 rounded w-1/3"></div>
      <div className="h-64 bg-white/10 rounded"></div>
    </div>
  </div>
)

export const StatsLoader = () => (
  <div className="ultra-premium-card p-6 mb-8 animate-pulse">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-6 bg-white/20 rounded w-32"></div>
          <div className="h-4 bg-white/10 rounded w-48"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-600/30 bg-white/5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                <div className="h-3 bg-white/10 rounded w-16"></div>
              </div>
              <div className="h-8 bg-white/20 rounded w-20"></div>
              <div className="h-3 bg-white/10 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const MonthlyDashboardLoader = () => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse">
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-400/40 rounded"></div>
          <div className="h-6 bg-white/20 rounded w-32"></div>
        </div>
        <div className="h-10 bg-purple-500/20 rounded-xl w-40"></div>
      </div>
      
      {/* Главный баланс */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10">
        <div className="text-center space-y-2">
          <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
          <div className="h-8 bg-white/30 rounded w-32 mx-auto"></div>
        </div>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/20 rounded-xl p-4">
          <div className="space-y-2">
            <div className="h-4 bg-green-300/40 rounded w-16"></div>
            <div className="h-6 bg-green-400/60 rounded w-20"></div>
          </div>
        </div>
        <div className="bg-red-500/20 rounded-xl p-4">
          <div className="space-y-2">
            <div className="h-4 bg-red-300/40 rounded w-16"></div>
            <div className="h-6 bg-red-400/60 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const CardLoader = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse">
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-2 bg-white/10 rounded w-full"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-white/20 rounded w-1/4"></div>
        <div className="h-4 bg-white/20 rounded w-1/4"></div>
      </div>
    </div>
  </div>
)

export const GridLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }, (_, i) => (
      <CardLoader key={i} />
    ))}
  </div>
)

export const ListLoader = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-3 bg-white/10 rounded w-1/3"></div>
          </div>
          <div className="h-6 bg-white/20 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
)

// Ленивая загрузка наших виртуализированных компонентов
export const LazyVirtualizedOperationList = dynamic(() => import('@/components/VirtualizedOperationList'), {
  loading: () => <ListLoader />,
  ssr: false
})

export const LazyVirtualizedGoalList = dynamic(() => import('@/components/VirtualizedGoalList'), {
  loading: () => <GridLoader />,
  ssr: false
})

export const LazyVirtualizedLimitList = dynamic(() => import('@/components/VirtualizedLimitList'), {
  loading: () => <GridLoader />,
  ssr: false
})

export const LazyMonthlyDashboard = dynamic(() => import('@/components/MonthlyDashboard'), {
  loading: () => <MonthlyDashboardLoader />,
  ssr: false
})

// Ленивые компоненты для аналитики
export const LazyCategoryChart = dynamic(
  () => import('@/components/CategoryChart').then(mod => ({ default: mod.CategoryChart })),
  {
    loading: () => <ChartLoader />,
    ssr: false
  }
)

export const LazyTimelineChart = dynamic(
  () => import('@/components/TimelineChart').then(mod => ({ default: mod.TimelineChart })),
  {
    loading: () => <ChartLoader />,
    ssr: false
  }
)

export const LazyLimitsStats = dynamic(
  () => import('@/components/LimitsStats'),
  {
    loading: () => <StatsLoader />,
    ssr: false
  }
)

export const LazyLimitsSection = dynamic(
  () => import('@/components/LimitsSection').then(mod => ({ default: mod.LimitsSection })),
  {
    loading: () => <GridLoader />,
    ssr: false
  }
)

export const LazyGoalsSection = dynamic(
  () => import('@/components/GoalsSection').then(mod => ({ default: mod.GoalsSection })),
  {
    loading: () => <GridLoader />,
    ssr: false
  }
)

// Обертка с Suspense для дополнительной безопасности
export const LazyComponent = ({ 
  children, 
  fallback = <div className="animate-pulse bg-white/10 rounded h-32" /> 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
)