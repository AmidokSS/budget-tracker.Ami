'use client'

import { motion } from 'framer-motion'
import { GradientPage } from '@/components/GradientPage'
import { useSettings } from '@/hooks/useSettings'
import CurrencySelector from '@/components/CurrencySelector'
import { Type, Zap, Settings, Palette, Globe, Info, Crown, Shield, Star } from 'lucide-react'

export default function SettingsPage() {
  const { settings, isLoading, updateSetting } = useSettings()

  const fontSizeOptions: Array<{value: 'small' | 'medium' | 'large', label: string, class: string, icon: string}> = [
    { value: 'small', label: 'Компактный', class: 'text-sm', icon: '🔍' },
    { value: 'medium', label: 'Комфортный', class: 'text-base', icon: '👁️' },
    { value: 'large', label: 'Крупный', class: 'text-lg', icon: '📖' }
  ]

  const animationOptions: Array<{value: 'full' | 'fast' | 'disabled', label: string, description: string, icon: string}> = [
    { value: 'full', label: 'Максимальная роскошь', description: 'Полный спектр премиальных анимаций', icon: '✨' },
    { value: 'fast', label: 'Элегантная скорость', description: 'Быстрые, но стильные переходы', icon: '⚡' },
    { value: 'disabled', label: 'Минималистичная мощь', description: 'Фокус на функциональности', icon: '🎯' }
  ]

  if (isLoading) {
    return (
      <GradientPage>
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex items-center justify-center h-64">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ultra-premium-card p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center"
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.div>
              <div className="premium-subtitle">Загрузка эксклюзивных настроек...</div>
            </motion.div>
          </div>
        </div>
      </GradientPage>
    )
  }

  return (
    <GradientPage>
      <div className="max-w-6xl mx-auto section-padding space-y-8">
        
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 border border-amber-400/25 backdrop-blur-sm relative">
              <Crown className="w-12 h-12 text-amber-400" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1.6],
                  opacity: [0.4, 0.2, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 border border-amber-400/30 rounded-3xl"
              />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold heading-gold mb-4 drop-shadow-2xl">
            Элитные настройки
          </h1>
          <p className="premium-subtitle text-lg max-w-2xl mx-auto">
            Персонализируйте ваш премиальный опыт управления финансами
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Профиль статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.1,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -4
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/15 border border-blue-400/25 backdrop-blur-sm relative"
                >
                  <Shield className="w-6 h-6 text-blue-400" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-blue-400/25 rounded-2xl blur-sm"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-blue-400/60 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Безопасность</p>
                <div className="premium-value text-2xl font-bold text-blue-300">
                  VIP
                </div>
              </div>
            </div>
          </motion.div>

          {/* Производительность */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -4
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -12 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative"
                >
                  <Zap className="w-6 h-6 text-emerald-400" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0.1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border border-emerald-400/30 rounded-2xl"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.7, 0],
                    x: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-emerald-400/50 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Производительность</p>
                <div className="premium-value text-2xl font-bold text-emerald-300">
                  Турбо
                </div>
              </div>
            </div>
          </motion.div>

          {/* Персонализация */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 1.02,
              y: -4
            }}
            className="ultra-premium-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/15 border border-purple-400/25 backdrop-blur-sm relative"
                >
                  <Star className="w-6 h-6 text-purple-400" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1.6],
                      opacity: [0.4, 0.2, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border border-purple-400/30 rounded-2xl"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [1, 1.4, 1]
                  }}
                  transition={{ 
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-purple-400/50 rounded-full blur-sm"
                />
              </div>
              
              <div>
                <p className="premium-subtitle text-sm mb-2">Настройки</p>
                <div className="premium-value text-2xl font-bold text-purple-300">
                  Премиум
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Font Size Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="ultra-premium-card p-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/15 border border-amber-400/25 backdrop-blur-sm"
              >
                <Type className="w-6 h-6 text-amber-400" />
              </motion.div>
              <div>
                <h2 className="premium-title text-2xl font-bold">Размер интерфейса</h2>
                <p className="premium-subtitle">Выберите оптимальный размер для вашего комфорта</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontSizeOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetting({ fontSize: option.value })}
                  className={`p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    settings.fontSize === option.value
                      ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/20 border-2 border-amber-400/50 shadow-lg shadow-amber-500/25'
                      : 'bg-gradient-to-br from-white/5 to-white/1 border-2 border-white/10 hover:border-amber-400/30 hover:bg-white/10'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">{option.icon}</div>
                    <div className={`font-semibold mb-2 ${settings.fontSize === option.value ? 'text-amber-200' : 'text-white'}`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${option.class} ${settings.fontSize === option.value ? 'text-amber-300/80' : 'text-white/60'}`}>
                      Пример текста
                    </div>
                  </div>
                  
                  {settings.fontSize === option.value && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-amber-900">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ultra-premium-card p-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm"
              >
                <Globe className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <div>
                <h2 className="premium-title text-2xl font-bold">Валютные курсы</h2>
                <p className="premium-subtitle">Настройте отображение валют для глобального управления финансами</p>
              </div>
            </div>
            
            <CurrencySelector />
          </div>
        </motion.div>

        {/* Animation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="ultra-premium-card p-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -8 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/15 border border-purple-400/25 backdrop-blur-sm"
              >
                <Palette className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div>
                <h2 className="premium-title text-2xl font-bold">Эффекты интерфейса</h2>
                <p className="premium-subtitle">Настройте уровень визуальных эффектов по вашему вкусу</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {animationOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetting({ animations: option.value })}
                  className={`w-full p-6 rounded-2xl transition-all duration-300 text-left relative overflow-hidden group ${
                    settings.animations === option.value
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25'
                      : 'bg-gradient-to-br from-white/5 to-white/1 border-2 border-white/10 hover:border-purple-400/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div className="flex-1">
                      <div className={`font-semibold mb-1 ${settings.animations === option.value ? 'text-purple-200' : 'text-white'}`}>
                        {option.label}
                      </div>
                      <div className={`text-sm ${settings.animations === option.value ? 'text-purple-300/80' : 'text-white/60'}`}>
                        {option.description}
                      </div>
                    </div>
                    
                    {settings.animations === option.value && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                      >
                        <span className="text-sm text-purple-900">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Information Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="ultra-premium-card p-8 relative overflow-hidden"
        >
          <div className="premium-content-glow">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 border border-amber-400/25 backdrop-blur-sm"
              >
                <Info className="w-6 h-6 text-amber-400" />
              </motion.div>
              <div>
                <h2 className="premium-title text-2xl font-bold">Системная информация</h2>
                <p className="premium-subtitle">Техническая информация о платформе</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                  <span className="premium-subtitle">Основная валюта: польский злотый (PLN)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                  <span className="premium-subtitle">Все операции сохраняются в złoty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                  <span className="premium-subtitle">Курсы валют обновляются каждые 12 часов</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                  <span className="premium-subtitle">Настройки сохраняются локально</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                  <span className="premium-subtitle">Данные защищены шифрованием</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                  <span className="premium-subtitle">Автоматическое резервное копирование</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </GradientPage>
  )
}
