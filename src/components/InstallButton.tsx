'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Check, Loader2 } from 'lucide-react'
import { usePWAStore } from '@/stores/pwaStore'

interface InstallButtonProps {
  variant?: 'default' | 'compact'
  className?: string
}

export const InstallButton: React.FC<InstallButtonProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { 
    isInstallable, 
    isInstalled, 
    installApp,
    checkInstallation 
  } = usePWAStore()
  
  const [isInstalling, setIsInstalling] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  useEffect(() => {
    // Проверяем состояние установки при монтировании
    checkInstallation()
  }, [checkInstallation])
  
  const handleInstall = async () => {
    if (isInstalling || isInstalled) return
    
    setIsInstalling(true)
    
    try {
      const success = await installApp()
      
      if (success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }
  
  // Не показываем кнопку если приложение уже установлено или недоступно для установки
  if (isInstalled || !isInstallable) {
    return null
  }
  
  const buttonContent = () => {
    if (showSuccess) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-green-500" />
          <span>Установлено!</span>
        </motion.div>
      )
    }
    
    if (isInstalling) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Установка...</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        <span>{variant === 'compact' ? 'Установить' : '📲 Установить приложение'}</span>
      </div>
    )
  }
  
  const baseClasses = `
    group relative overflow-hidden
    bg-gradient-to-r from-blue-500 to-purple-500 
    hover:from-blue-600 hover:to-purple-600
    text-white font-medium
    border-0 rounded-xl
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-lg hover:shadow-xl
    transform hover:scale-[1.02] active:scale-[0.98]
  `
  
  const sizeClasses = variant === 'compact' 
    ? 'px-4 py-2 text-sm'
    : 'px-6 py-3 text-base'
  
  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleInstall}
        disabled={isInstalling || showSuccess}
        className={`${baseClasses} ${sizeClasses} ${className}`}
      >
        {/* Анимированный фон */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        
        {/* Эффект блеска */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Контент */}
        <span className="relative z-10">
          {buttonContent()}
        </span>
      </motion.button>
    </AnimatePresence>
  )
}

// Компонент для отображения статуса PWA
export const PWAStatus: React.FC = () => {
  const { isOnline, updateAvailable, updateApp } = usePWAStore()
  const [isUpdating, setIsUpdating] = useState(false)
  
  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateApp()
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }
  
  return (
    <div className="space-y-2">
      {/* Статус сети */}
      <div className="flex items-center gap-2 text-sm">
        <div 
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-gray-600 dark:text-gray-400">
          {isOnline ? 'Онлайн' : 'Оффлайн'}
        </span>
      </div>
      
      {/* Кнопка обновления */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.button
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex items-center gap-2 px-3 py-2 text-sm
                     bg-blue-100 dark:bg-blue-900/30 
                     text-blue-700 dark:text-blue-300
                     rounded-lg border border-blue-200 dark:border-blue-700
                     hover:bg-blue-200 dark:hover:bg-blue-900/50
                     transition-colors duration-200
                     disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isUpdating ? 'Обновление...' : 'Обновить приложение'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}