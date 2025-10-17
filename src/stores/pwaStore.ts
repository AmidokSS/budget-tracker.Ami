'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  // Состояние установки
  isInstallable: boolean
  isInstalled: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
  
  // Состояние service worker
  isOnline: boolean
  swRegistration: ServiceWorkerRegistration | null
  updateAvailable: boolean
  
  // Действия
  setInstallable: (installable: boolean) => void // eslint-disable-line
  setInstalled: (installed: boolean) => void // eslint-disable-line
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void // eslint-disable-line
  setOnline: (online: boolean) => void // eslint-disable-line
  setSwRegistration: (registration: ServiceWorkerRegistration | null) => void // eslint-disable-line
  setUpdateAvailable: (available: boolean) => void // eslint-disable-line
  
  // Методы установки
  installApp: () => Promise<boolean>
  updateApp: () => Promise<void>
  checkInstallation: () => void
}

export const usePWAStore = create<PWAState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      isInstallable: false,
      isInstalled: false,
      deferredPrompt: null,
      isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
      swRegistration: null,
      updateAvailable: false,
      
      // Сеттеры
      setInstallable: (installable) => set({ isInstallable: installable }),
      setInstalled: (installed) => set({ isInstalled: installed }),
      setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
      setOnline: (online) => set({ isOnline: online }),
      setSwRegistration: (registration) => set({ swRegistration: registration }),
      setUpdateAvailable: (available) => set({ updateAvailable: available }),
      
      // Установка приложения
      installApp: async () => {
        const { deferredPrompt } = get()
        
        if (!deferredPrompt) {
          console.log('No deferred prompt available')
          return false
        }
        
        try {
          // Показываем диалог установки
          await deferredPrompt.prompt()
          
          // Ждем выбор пользователя
          const { outcome } = await deferredPrompt.userChoice
          
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt')
            set({ 
              isInstalled: true, 
              isInstallable: false,
              deferredPrompt: null 
            })
            return true
          } else {
            console.log('User dismissed the install prompt')
            set({ deferredPrompt: null })
            return false
          }
        } catch (error) {
          console.error('Error during installation:', error)
          return false
        }
      },
      
      // Обновление приложения
      updateApp: async () => {
        const { swRegistration } = get()
        
        if (swRegistration?.waiting) {
          // Сообщаем waiting SW что нужно активироваться
          swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
          
          // Перезагружаем страницу после активации
          swRegistration.addEventListener('controlling', () => {
            window.location.reload()
          })
        }
      },
      
      // Проверка состояния установки
      checkInstallation: () => {
        if (typeof window === 'undefined') return
        
        // Проверяем, запущено ли приложение в standalone режиме
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as any).standalone ||
                            document.referrer.includes('android-app://')
        
        if (isStandalone) {
          set({ isInstalled: true, isInstallable: false })
        }
      }
    }),
    {
      name: 'pwa-store',
      partialize: (state) => ({
        isInstalled: state.isInstalled,
        // Не сохраняем deferredPrompt и swRegistration в localStorage
      }),
    }
  )
)

// Хук для инициализации PWA событий
export const usePWAEvents = () => {
  const {
    setInstallable,
    setDeferredPrompt,
    setOnline,
    setSwRegistration,
    setUpdateAvailable,
    checkInstallation
  } = usePWAStore()
  
  if (typeof window === 'undefined') return
  
  // Обработчик beforeinstallprompt
  const handleBeforeInstallPrompt = (e: Event) => {
    console.log('beforeinstallprompt event fired')
    e.preventDefault()
    
    const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
    setDeferredPrompt(beforeInstallPromptEvent)
    setInstallable(true)
  }
  
  // Обработчик appinstalled
  const handleAppInstalled = () => {
    console.log('PWA was installed')
    setInstallable(false)
    setDeferredPrompt(null)
  }
  
  // Обработчики онлайн/оффлайн
  const handleOnline = () => setOnline(true)
  const handleOffline = () => setOnline(false)
  
  // Подписываемся на события
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Проверяем текущее состояние
  checkInstallation()
  
  // Service Worker события
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      setSwRegistration(registration)
      
      // Проверяем обновления
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
            }
          })
        }
      })
    })
  }
  
  // Очистка при размонтировании
  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}