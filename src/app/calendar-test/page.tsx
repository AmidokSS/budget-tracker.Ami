'use client'

import { useState } from 'react'
import { FinancialCalendar } from '@/components/FinancialCalendar'
import { GradientPage } from '@/components/GradientPage'
import { motion } from 'framer-motion'
import { useOperations, useGoals } from '@/hooks/useApi'

export default function CalendarTestPage() {
  const { data: operations = [] } = useOperations()
  const { data: goals = [] } = useGoals()

  return (
    <GradientPage>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            🗓️ Финансовый календарь
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            Визуализация ваших финансовых операций и целей в удобном календарном формате.
            Все операции и дедлайны целей отображаются с цветовой индикацией приоритетов.
          </p>
        </motion.div>

        <FinancialCalendar 
          operations={operations} 
          goals={goals}
        />

        {/* Информация о плавном скролле */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">✨ Плавный скролл</h2>
          <p className="text-white/70 mb-4">
            На этой странице активирован плавный скролл с помощью библиотеки Lenis. 
            Попробуйте прокрутить страницу - движения стали более плавными и естественными!
          </p>
          
          {/* Демо-контент для тестирования скролла */}
          <div className="space-y-8 mt-8">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Секция {i + 1}
                </h3>
                <p className="text-white/60">
                  Этот контент добавлен для демонстрации плавного скролла. 
                  Прокрутите страницу вверх и вниз, чтобы почувствовать разницу 
                  в качестве анимации скролла по сравнению с обычным поведением браузера.
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </GradientPage>
  )
}