'use client'

import { motion } from 'framer-motion'
import { GradientPage } from '@/components/GradientPage'
import { useSettings } from '@/hooks/useSettings'
import CurrencySelector from '@/components/CurrencySelector'
import { PWAInstaller } from '@/components/PWAInstaller'
import { Type, Zap, Smartphone } from 'lucide-react'

export default function SettingsPage() {
  const { settings, isLoading, updateSetting } = useSettings()

  const fontSizeOptions: Array<{value: 'small' | 'medium' | 'large', label: string, class: string}> = [
    { value: 'small', label: 'Маленький', class: 'text-sm' },
    { value: 'medium', label: 'Средний', class: 'text-base' },
    { value: 'large', label: 'Большой', class: 'text-lg' }
  ]

  const animationOptions: Array<{value: 'full' | 'fast' | 'disabled', label: string, description: string}> = [
    { value: 'full', label: 'Полные', description: 'Все анимации включены' },
    { value: 'fast', label: 'Быстрые', description: 'Сокращённые тайминги' },
    { value: 'disabled', label: 'Отключить', description: 'Без анимаций' }
  ]

  if (isLoading) {
    return (
      <GradientPage>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-white/70">Загрузка настроек...</div>
          </div>
        </div>
      </GradientPage>
    )
  }

  return (
    <GradientPage>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2"> Настройки</h1>
          <p className="text-white/70">Персонализация интерфейса и валютных курсов</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Размер текста</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSetting({ fontSize: option.value })}
                className={
                  settings.fontSize === option.value
                    ? 'p-4 rounded-xl border-2 border-blue-400 bg-blue-500/20 text-white transition-all duration-300'
                    : 'p-4 rounded-xl border-2 border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300'
                }
              >
                <div className={option.class + ' font-medium mb-1'}>
                  {option.label}
                </div>
                <div className="text-xs text-white/50">
                  Пример текста
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* PWA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Мобильное приложение</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Установите Budget Tracker как приложение на ваше устройство для быстрого доступа 
              и работы без подключения к интернету.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <PWAInstaller />
            </div>
            
            <div className="space-y-2 text-xs text-white/50">
              <p>• Работает без интернета после установки</p>
              <p>• Быстрый запуск с рабочего стола</p>
              <p>• Автоматические обновления</p>
              <p>• Полноэкранный режим без браузера</p>
            </div>
          </div>
        </motion.div>

        {/* Валюты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <CurrencySelector />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Анимации интерфейса</h2>
          </div>
          
          <div className="space-y-3">
            {animationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSetting({ animations: option.value })}
                className={
                  settings.animations === option.value
                    ? 'w-full p-4 rounded-xl border-2 border-yellow-400 bg-yellow-500/20 text-white transition-all duration-300 text-left'
                    : 'w-full p-4 rounded-xl border-2 border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300 text-left'
                }
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-white/50">{option.description}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">ℹ Информация</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p> Основная валюта сайта  польский злотый (PLN)</p>
            <p> Все операции, лимиты и цели сохраняются в złoty</p>
            <p> Курсы валют обновляются каждые 12 часов</p>
            <p> Настройки сохраняются локально в браузере</p>
          </div>
        </motion.div>
      </div>
    </GradientPage>
  )
}
