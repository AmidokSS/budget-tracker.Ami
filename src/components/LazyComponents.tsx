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