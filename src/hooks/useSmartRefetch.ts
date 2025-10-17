'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseSmartRefetchOptions {
  baseInterval?: number // Базовый интервал в миллисекундах (по умолчанию 15000 = 15 сек)
  activeInterval?: number // Интервал при активности (по умолчанию 5000 = 5 сек)
  inactiveInterval?: number // Интервал при неактивности (по умолчанию 60000 = 1 мин)
  backgroundInterval?: number // Интервал когда вкладка неактивна (по умолчанию 300000 = 5 мин)
  enabled?: boolean // Включить/выключить обновления
}

interface SmartRefetchState {
  isVisible: boolean
  isActive: boolean
  currentInterval: number
  lastActivity: number
}

export const useSmartRefetch = (options: UseSmartRefetchOptions = {}) => {
  const {
    baseInterval = 15000,
    activeInterval = 5000,
    inactiveInterval = 60000,
    backgroundInterval = 300000,
    enabled = true
  } = options

  const [state, setState] = useState<SmartRefetchState>({
    isVisible: true,
    isActive: true,
    currentInterval: baseInterval,
    lastActivity: Date.now()
  })

  const activityTimeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef(Date.now())

  // Обновляем время последней активности
  const updateActivity = useCallback(() => {
    const now = Date.now()
    lastActivityRef.current = now
    
    setState(prev => ({
      ...prev,
      isActive: true,
      lastActivity: now
    }))

    // Сбрасываем таймер неактивности
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }

    // Устанавливаем новый таймер (30 секунд без активности = неактивен)
    activityTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isActive: false
      }))
    }, 30000)
  }, [])

  // Обработчики событий активности
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      updateActivity()
    }

    // Throttle событий активности
    let throttleTimeout: NodeJS.Timeout | null = null
    const throttledHandleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleActivity()
          throttleTimeout = null
        }, 1000) // Обновляем активность максимум раз в секунду
      }
    }

    events.forEach(event => {
      document.addEventListener(event, throttledHandleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandleActivity)
      })
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout)
      }
    }
  }, [updateActivity])

  // Отслеживание видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden
      setState(prev => ({
        ...prev,
        isVisible
      }))

      // При возвращении на страницу обновляем активность
      if (isVisible) {
        updateActivity()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateActivity])

  // Вычисляем текущий интервал
  useEffect(() => {
    let newInterval: number

    if (!enabled) {
      newInterval = 0 // Отключаем обновления
    } else if (!state.isVisible) {
      newInterval = backgroundInterval // Страница неактивна
    } else if (state.isActive) {
      newInterval = activeInterval // Пользователь активен
    } else {
      newInterval = inactiveInterval // Пользователь неактивен
    }

    setState(prev => ({
      ...prev,
      currentInterval: newInterval
    }))
  }, [state.isVisible, state.isActive, enabled, activeInterval, inactiveInterval, backgroundInterval])

  // Дополнительные утилиты
  const getRefetchInterval = useCallback(() => {
    return state.currentInterval
  }, [state.currentInterval])

  const isRefetchEnabled = useCallback(() => {
    return enabled && state.currentInterval > 0
  }, [enabled, state.currentInterval])

  const forceActive = useCallback(() => {
    updateActivity()
  }, [updateActivity])

  return {
    ...state,
    getRefetchInterval,
    isRefetchEnabled,
    forceActive,
    // Для отладки
    debug: {
      baseInterval,
      activeInterval,
      inactiveInterval,
      backgroundInterval,
      timeSinceLastActivity: Date.now() - state.lastActivity
    }
  }
}

// Хук для интеграции с React Query
export const useSmartQueryOptions = (options: UseSmartRefetchOptions = {}) => {
  const smartRefetch = useSmartRefetch(options)

  const refetchInterval = smartRefetch.isRefetchEnabled() ? smartRefetch.currentInterval : false
  // refetchIntervalInBackground должен быть boolean
  const refetchIntervalInBackground = smartRefetch.isVisible

  return {
    refetchInterval: refetchInterval as number | false,
    refetchIntervalInBackground: refetchIntervalInBackground,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // Дополнительные опции для производительности
    staleTime: smartRefetch.isActive ? 0 : 30000, // Кэш дольше когда неактивен
    gcTime: smartRefetch.isVisible ? 300000 : 600000, // Заменили cacheTime на gcTime (новая версия React Query)
    retry: smartRefetch.isVisible ? 3 : 1, // Меньше ретраев когда страница скрыта
  }
}