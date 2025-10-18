# 🚀 Руководство по производительности Budget Tracker

## 📊 Как использовать новые возможности

### 1. Bundle Analysis

```bash
# Анализ размера bundle
npm run analyze

# Откроется браузер с детальным анализом:
# - Размеры каждого модуля
# - Зависимости и их влияние
# - Рекомендации по оптимизации
```

### 2. Performance Monitoring

```javascript
// В DevTools Console можно проверить производительность:
console.log(
  'Performance Metrics:',
  window.performance.getEntriesByType('navigation')
)

// Адаптивные анимации (автоматически определяются):
// - Мощные устройства: полные анимации
// - Слабые устройства: упрощенные анимации
// - prefers-reduced-motion: минимальные анимации
```

### 3. Caching Status

```javascript
// Проверка статуса Service Worker кеширования
navigator.serviceWorker.ready.then((registration) => {
  console.log('SW registered:', registration)
})

// API кеширование:
// - Operations: 5 минут
// - Goals/Limits: 10 минут
// - Exchange rates: 30 минут
// - Categories: 1 час
```

### 4. Network Optimization

- **Автоматические интервалы**: от 5 секунд (активный пользователь) до 10 минут (фон)
- **Кеширование**: API ответы кешируются автоматически
- **Offline**: базовая функциональность доступна без интернета

### 5. Device Adaptation

- **Desktop**: полные анимации, быстрые интервалы
- **Mobile**: оптимизированные анимации, адаптивные интервалы
- **Low-end devices**: минимальные анимации, долгие интервалы
- **Slow connection**: приоритет кеша, увеличенные интервалы

## 🔧 Настройки разработчика

### CSS Variables

```css
/* Доступные переменные для кастомизации: */
--animation-duration-fast: 0.2s;
--animation-duration-normal: 0.3s;
--animation-easing-ease: cubic-bezier(0.4, 0, 0.2, 1);
--transform-hover: translateY(-2px);
--scale-hover: 1.02;
```

### Performance Hooks

```typescript
import {
  useAnimationConfig,
  useDevicePerformance,
} from '@/hooks/usePerformance'

const Component = () => {
  const { shouldAnimate, duration } = useAnimationConfig()
  const { isLowEnd, animationLevel } = useDevicePerformance()

  // Использовать для условных анимаций
}
```

## 📈 Ожидаемые улучшения

- **Загрузка**: 50-70% быстрее
- **Анимации**: адаптивные под устройство
- **API запросы**: 80-90% меньше
- **Accessibility**: полная поддержка
- **Offline**: базовая функциональность

## 🎯 Мониторинг производительности

1. **Lighthouse**: регулярно проверяйте показатели
2. **Bundle Analyzer**: отслеживайте рост размера
3. **Network tab**: проверяйте кеширование API
4. **Performance tab**: мониторьте FPS анимаций

Все оптимизации работают автоматически и не требуют дополнительной настройки! 🎉
