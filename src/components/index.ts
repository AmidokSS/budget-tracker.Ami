/**
 * 📦 Optimized Component Exports
 * Оптимизированные экспорты компонентов для лучшего tree-shaking
 */

import React from 'react';

// 🎯 Основные компоненты (часто используемые) - прямые экспорты
export { GradientPage } from './GradientPage';
export { PageTransition } from './PageTransition';
export { GlassMorphismCard } from './GlassMorphismCard';
export { EmptyState } from './EmptyState';
export { AnalyticsCard } from './AnalyticsCard';
export { AnimatedCurrency } from './AnimatedCurrency';

// 📊 Dashboard компоненты - прямые экспорты
export { CategoryChart } from './CategoryChart';
export { TimelineChart } from './TimelineChart';
export { InsightCard } from './InsightCard';

// 📱 Навигация и интерфейс - прямые экспорты
export { Navbar } from './Navbar';
export { FloatingActionButton } from './FloatingActionButton';

// 🎯 Провайдеры и системные компоненты - прямые экспорты
export { SettingsProvider } from './SettingsProvider';
export { CurrencyInitializer } from './CurrencyInitializer';
export { PWAInstaller } from './PWAInstaller';
export { OptimizedPremiumLoader } from './OptimizedPremiumLoader';

// 🎨 Lazy-загружаемые декоративные компоненты (закомментированы из-за проблем экспорта)
// export const LazyStarryBackground = React.lazy(() => import('./StarryBackground'));
// export const LazyFloatingParticles = React.lazy(() => import('./FloatingParticles'));
// export const LazyParallaxScroll = React.lazy(() => import('./ParallaxScroll'));

// 📋 Lazy-загружаемые сайдбары
export const LazyAddOperationSidebar = React.lazy(() => import('./AddOperationSidebar'));
export const LazyCategorySidebar = React.lazy(() => import('./CategorySidebar'));
export const LazyGoalSidebar = React.lazy(() => import('./GoalSidebar'));
export const LazyLimitSidebar = React.lazy(() => import('./LimitSidebar'));

// 📊 Lazy-загружаемые виртуализированные списки
export const LazyVirtualizedOperationList = React.lazy(() => import('./VirtualizedOperationList'));
export const LazyVirtualizedGoalList = React.lazy(() => import('./VirtualizedGoalList'));
export const LazyVirtualizedLimitList = React.lazy(() => import('./VirtualizedLimitList'));

// 🏋️ Lazy-загружаемые тяжелые компоненты (закомментированы из-за проблем экспорта)
// export const LazyAdvancedOperationsTable = React.lazy(() => import('./AdvancedOperationsTable'));
// export const LazyLottieAnimations = React.lazy(() => import('./LottieAnimations'));
// export const LazyFinancialCalendar = React.lazy(() => import('./FinancialCalendar'));

// 📱 Hook для определения типа устройства
export const useDeviceOptimization = () => {
  const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth < 768) setDeviceType('mobile');
      else if (window.innerWidth < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    shouldLazyLoad: deviceType === 'mobile'
  };
};

// 🔧 Типы для компонентов
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OptimizationLevel = 'high' | 'medium' | 'low';