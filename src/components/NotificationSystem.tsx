'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface NotificationContextType {
  permission: NotificationPermission
  requestPermission: () => Promise<NotificationPermission>
  showNotification: (title: string, options?: NotificationOptions) => void
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications-enabled', false)

  useEffect(() => {
    // Проверяем поддержку уведомлений
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        setNotificationsEnabled(true)
      }
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (!isSupported || permission !== 'granted' || !notificationsEnabled) {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      })

      // Автоматически закрываем через 5 секунд
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        permission,
        requestPermission,
        showNotification,
        isSupported,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// Хук для уведомлений о лимитах
export const useLimitNotifications = () => {
  const { showNotification, permission } = useNotifications()

  const notifyLimitExceeded = (categoryName: string, currentAmount: number, limitAmount: number) => {
    if (permission === 'granted') {
      showNotification('⚠️ Лимит превышен!', {
        body: `Категория "${categoryName}": потрачено ${currentAmount} zł из ${limitAmount} zł`,
        tag: 'limit-exceeded',
        requireInteraction: true,
      })
    }
  }

  const notifyLimitApproaching = (categoryName: string, currentAmount: number, limitAmount: number, percentage: number) => {
    if (permission === 'granted') {
      showNotification('⚠️ Приближение к лимиту', {
        body: `Категория "${categoryName}": использовано ${percentage}% лимита (${currentAmount} из ${limitAmount} zł)`,
        tag: 'limit-approaching',
      })
    }
  }

  return {
    notifyLimitExceeded,
    notifyLimitApproaching,
  }
}

// Хук для уведомлений о целях
export const useGoalNotifications = () => {
  const { showNotification, permission } = useNotifications()

  const notifyGoalCompleted = (goalTitle: string, targetAmount: number) => {
    if (permission === 'granted') {
      showNotification('🎉 Цель достигнута!', {
        body: `"${goalTitle}" - собрано ${targetAmount} zł!`,
        tag: 'goal-completed',
        requireInteraction: true,
      })
    }
  }

  const notifyGoalDeadlineApproaching = (goalTitle: string, daysRemaining: number) => {
    if (permission === 'granted') {
      showNotification('⏰ Приближается дедлайн', {
        body: `Цель "${goalTitle}" - осталось ${daysRemaining} дней`,
        tag: 'goal-deadline',
      })
    }
  }

  const notifyGoalProgress = (goalTitle: string, percentage: number) => {
    if (permission === 'granted' && [25, 50, 75].includes(Math.floor(percentage))) {
      showNotification('📈 Прогресс цели', {
        body: `"${goalTitle}" - выполнено на ${Math.floor(percentage)}%`,
        tag: 'goal-progress',
      })
    }
  }

  return {
    notifyGoalCompleted,
    notifyGoalDeadlineApproaching,
    notifyGoalProgress,
  }
}

// Хук для уведомлений о курсах валют
export const useCurrencyNotifications = () => {
  const { showNotification, permission } = useNotifications()

  const notifyCurrencyRateChange = (fromCurrency: string, toCurrency: string, oldRate: number, newRate: number) => {
    if (permission === 'granted') {
      const change = ((newRate - oldRate) / oldRate) * 100
      const direction = change > 0 ? '📈' : '📉'
      
      showNotification(`${direction} Изменение курса`, {
        body: `${fromCurrency}/${toCurrency}: ${oldRate.toFixed(4)} → ${newRate.toFixed(4)} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`,
        tag: 'currency-change',
      })
    }
  }

  return {
    notifyCurrencyRateChange,
  }
}

// Компонент настроек уведомлений
interface NotificationSettingsProps {
  className?: string
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const { permission, requestPermission, isSupported } = useNotifications()
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications-enabled', false)

  const handleToggleNotifications = async () => {
    if (permission === 'default') {
      const result = await requestPermission()
      if (result === 'granted') {
        setNotificationsEnabled(true)
      }
    } else if (permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled)
    }
  }

  if (!isSupported) {
    return (
      <div className={`p-4 bg-slate-700/50 rounded-lg border border-slate-600/30 ${className}`}>
        <p className="text-slate-400 text-sm">
          Уведомления не поддерживаются в данном браузере
        </p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-slate-700/50 rounded-lg border border-slate-600/30 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Push-уведомления</h3>
          <p className="text-slate-400 text-sm">
            Получайте уведомления о превышении лимитов и достижении целей
          </p>
        </div>
        <button
          onClick={handleToggleNotifications}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            permission === 'granted' && notificationsEnabled
              ? 'bg-indigo-600'
              : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              permission === 'granted' && notificationsEnabled
                ? 'translate-x-5'
                : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {permission === 'denied' && (
        <div className="text-red-400 text-sm">
          <p>Уведомления заблокированы. Разрешите их в настройках браузера.</p>
        </div>
      )}

      {permission === 'granted' && notificationsEnabled && (
        <div className="text-emerald-400 text-sm">
          <p>✅ Уведомления включены и настроены</p>
        </div>
      )}
    </div>
  )
}