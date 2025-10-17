'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  useDevicePerformance, 
  useAnimationConfig, 
  useConditionalAnimation 
} from '@/hooks/usePerformance'

export const PerformanceDemo: React.FC = () => {
  const performance = useDevicePerformance()
  const { fadeIn, slideIn, hover, stagger } = useAnimationConfig()

  const adaptiveFadeIn = useConditionalAnimation(fadeIn)
  const adaptiveSlideIn = useConditionalAnimation(slideIn)
  const adaptiveHover = useConditionalAnimation(hover)

  const demoItems = [
    { id: 1, title: 'Адаптивная карточка 1', color: 'bg-blue-500/20' },
    { id: 2, title: 'Адаптивная карточка 2', color: 'bg-green-500/20' },
    { id: 3, title: 'Адаптивная карточка 3', color: 'bg-purple-500/20' },
    { id: 4, title: 'Адаптивная карточка 4', color: 'bg-red-500/20' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Информация о производительности */}
      <div className="bg-white/5 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Информация о производительности устройства</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Память устройства:</strong> {performance.deviceMemory || 'Неизвестно'} GB
          </div>
          <div>
            <strong>Ядра процессора:</strong> {performance.hardwareConcurrency}
          </div>
          <div>
            <strong>Тип соединения:</strong> {performance.connectionType || 'Неизвестно'}
          </div>
          <div>
            <strong>Низкопроизводительное устройство:</strong> {performance.isLowEnd ? 'Да' : 'Нет'}
          </div>
          <div>
            <strong>Уровень анимации:</strong> {performance.animationLevel}
          </div>
          <div>
            <strong>Уменьшенное движение:</strong> {performance.shouldReduceMotion ? 'Включено' : 'Выключено'}
          </div>
          <div>
            <strong>Предпочтительный FPS:</strong> {performance.preferredFrameRate}
          </div>
        </div>
      </div>

      {/* Демонстрация адаптивных анимаций */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Демонстрация адаптивных анимаций</h3>
        
        {/* Fade-in анимация */}
        <motion.div
          {...adaptiveFadeIn}
          className="bg-white/5 rounded-lg p-4"
        >
          <h4 className="font-medium mb-2">Fade-in анимация</h4>
          <p className="text-sm text-white/70">
            Эта карточка появляется с fade-in эффектом, оптимизированным под ваше устройство
          </p>
        </motion.div>

        {/* Slide-in анимация */}
        <motion.div
          {...adaptiveSlideIn}
          className="bg-white/5 rounded-lg p-4"
        >
          <h4 className="font-medium mb-2">Slide-in анимация</h4>
          <p className="text-sm text-white/70">
            Эта карточка въезжает сбоку с оптимизированной скоростью
          </p>
        </motion.div>

        {/* Hover эффекты */}
        <motion.div
          whileHover={adaptiveHover}
          className="bg-white/5 rounded-lg p-4 cursor-pointer"
        >
          <h4 className="font-medium mb-2">Hover эффект</h4>
          <p className="text-sm text-white/70">
            Наведите курсор или коснитесь этой карточки для hover эффекта
          </p>
        </motion.div>

        {/* Stagger анимация */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: stagger
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {demoItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={adaptiveFadeIn}
              whileHover={adaptiveHover}
              className={`${item.color} rounded-lg p-4 cursor-pointer`}
            >
              <h5 className="font-medium">{item.title}</h5>
              <p className="text-xs text-white/60 mt-1">
                Карточка #{item.id} с задержкой {index * 50}ms
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Производительность в реальном времени */}
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Настройки производительности в реальном времени</h3>
        <div className="text-sm space-y-2">
          <div>
            <strong>Активность пользователя:</strong>{' '}
            <span className={performance.shouldReduceMotion ? 'text-yellow-400' : 'text-green-400'}>
              {performance.shouldReduceMotion ? 'Анимации отключены/уменьшены' : 'Полные анимации активны'}
            </span>
          </div>
          <div>
            <strong>Статус оптимизации:</strong>{' '}
            <span className={performance.isLowEnd ? 'text-orange-400' : 'text-green-400'}>
              {performance.isLowEnd ? 'Режим экономии ресурсов' : 'Полная производительность'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceDemo