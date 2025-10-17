'use client'

import { useEffect, useState } from 'react'
import { usePWAStore } from '@/stores/pwaStore'
import { motion } from 'framer-motion'
import { Download, Smartphone, Check } from 'lucide-react'

export function PWAInstaller() {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    install,
    initializePWA
  } = usePWAStore()

  const [isInstalling, setIsInstalling] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const cleanup = initializePWA()
    return cleanup
  }, [initializePWA])

  const handleInstall = async () => {
    if (canInstall && !isInstalling) {
      setIsInstalling(true)
      const success = await install()
      setIsInstalling(false)
      
      if (success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    }
  }

  // Информация для отладки
  const debugInfo = {
    installable: canInstall,
    installed: isInstalled,
    hasPrompt: !!usePWAStore.getState().deferredPrompt,
    standalone: isStandalone,
    userAgent: typeof window !== 'undefined' ? 
      (navigator.userAgent.includes('Chrome') ? 'Chrome' : 
       navigator.userAgent.includes('Firefox') ? 'Firefox' : 
       navigator.userAgent.includes('Safari') ? 'Safari' : 'Other') : 'Unknown'
  }

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">PWA Debug Info:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Installable:</span>
            <span className={debugInfo.installable ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.installable ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Installed:</span>
            <span className={debugInfo.installed ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.installed ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Has Prompt:</span>
            <span className={debugInfo.hasPrompt ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.hasPrompt ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Standalone:</span>
            <span className={debugInfo.standalone ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.standalone ? '✅' : '❌'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>User Agent:</span>
            <span className="text-blue-400">{debugInfo.userAgent} ✅</span>
          </div>
        </div>
      </div>

      {/* Install Button */}
      {!isInstalled && (
        <motion.button
          onClick={handleInstall}
          disabled={!canInstall || isInstalling}
          role="button"
          aria-label={canInstall ? 'Установить приложение' : 'Установка недоступна'}
          className={`
            w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium
            transition-all duration-300 transform hover:scale-105
            ${canInstall && !isInstalling
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={{ scale: canInstall ? 1.02 : 1 }}
          whileTap={{ scale: canInstall ? 0.98 : 1 }}
        >
          {showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Установлено!
            </>
          ) : isInstalling ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download className="w-5 h-5" />
              </motion.div>
              Установка...
            </>
          ) : canInstall ? (
            <>
              <Download className="w-5 h-5" />
              🎯 Установить приложение
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5" />
              {isInstalled ? 'Уже установлено' : 'Недоступно для установки'}
            </>
          )}
        </motion.button>
      )}

      {/* Success Message */}
      {isInstalled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5" />
            <span className="font-medium">Приложение установлено!</span>
          </div>
          <p className="text-sm text-green-300/80 mt-1">
            Теперь вы можете запускать Budget Tracker с рабочего стола.
          </p>
        </motion.div>
      )}

      {/* Benefits */}
      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Работает без интернета после установки</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Быстрый запуск с рабочего стола</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Автоматические обновления</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Полноэкранный режим без браузера</span>
        </div>
      </div>
    </div>
  )
}