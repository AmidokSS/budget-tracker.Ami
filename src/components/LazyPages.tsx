'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { GradientPage } from '@/components/GradientPage'

// Компонент загрузки
const PageLoader = () => (
  <GradientPage>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white/70">Загрузка...</p>
      </div>
    </div>
  </GradientPage>
)

// Lazy загрузка страниц с оптимизацией
const LazyAnalyticsPage = dynamic(() => import('@/app/analytics/page'), {
  loading: PageLoader,
  ssr: false // Отключаем SSR для лучшей производительности
})

const LazyGoalsPage = dynamic(() => import('@/app/goals/page'), {
  loading: PageLoader,
  ssr: false
})

const LazyLimitsPage = dynamic(() => import('@/app/limits/page'), {
  loading: PageLoader,
  ssr: false
})

const LazyCategoriesPage = dynamic(() => import('@/app/categories/page'), {
  loading: PageLoader,
  ssr: false
})

const LazySettingsPage = dynamic(() => import('@/app/settings/page'), {
  loading: PageLoader,
  ssr: false
})

// Экспорт ленивых компонентов с Suspense границами
export const AnalyticsPageLazy = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyAnalyticsPage />
  </Suspense>
)

export const GoalsPageLazy = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyGoalsPage />
  </Suspense>
)

export const LimitsPageLazy = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyLimitsPage />
  </Suspense>
)

export const CategoriesPageLazy = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyCategoriesPage />
  </Suspense>
)

export const SettingsPageLazy = () => (
  <Suspense fallback={<PageLoader />}>
    <LazySettingsPage />
  </Suspense>
)