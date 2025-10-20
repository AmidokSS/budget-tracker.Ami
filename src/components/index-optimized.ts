/**
 * 📦 Optimized Component Exports
 * Оптимизированные экспорты компонентов для лучшего tree-shaking
 */

import React from 'react';

// 🎯 Основные компоненты (часто используемые)
export { GradientPage } from './GradientPage';
export { PageTransition } from './PageTransition';
export { GlassMorphismCard } from './GlassMorphismCard';
export { EmptyState } from './EmptyState';
export { AnalyticsCard } from './AnalyticsCard';
export { AnimatedCurrency } from './AnimatedCurrency';

// 📊 Dashboard компоненты
export { CategoryChart } from './CategoryChart';
export { TimelineChart } from './TimelineChart';
export { InsightCard } from './InsightCard';

// 📱 Навигация и интерфейс
export { Navbar } from './Navbar';
export { FloatingActionButton } from './FloatingActionButton';

// 🎯 Провайдеры и системные компоненты
export { SettingsProvider } from './SettingsProvider';
export { CurrencyInitializer } from './CurrencyInitializer';
export { PWAInstaller } from './PWAInstaller';
export { OptimizedPremiumLoader } from './OptimizedPremiumLoader';

// 🎨 Декоративные компоненты
export { StarryBackground } from './StarryBackground';
export { FloatingParticles } from './FloatingParticles';

// 📋 Формы и сайдбары (закомментированы из-за проблем с именованными экспортами)
// export { AddOperationSidebar } from './AddOperationSidebar';
// export { CategorySidebar } from './CategorySidebar';
// export { GoalSidebar } from './GoalSidebar';
// export { LimitSidebar } from './LimitSidebar';

// 📊 Списки (закомментированы из-за проблем с именованными экспортами)
// export { VirtualizedOperationList } from './VirtualizedOperationList';
// export { VirtualizedGoalList } from './VirtualizedGoalList';
// export { VirtualizedLimitList } from './VirtualizedLimitList';

// 🔧 Типы для компонентов
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OptimizationLevel = 'high' | 'medium' | 'low';

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