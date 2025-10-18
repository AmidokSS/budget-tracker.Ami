import { create } from 'zustand'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAStore {
  deferredPrompt: BeforeInstallPromptEvent | null
  isInstalled: boolean
  canInstall: boolean
  isStandalone: boolean
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void // eslint-disable-line
  setInstalled: (installed: boolean) => void // eslint-disable-line
  setCanInstall: (canInstall: boolean) => void // eslint-disable-line
  setStandalone: (standalone: boolean) => void // eslint-disable-line
  install: () => Promise<boolean>
  initializePWA: () => () => void
}

export const usePWAStore = create<PWAStore>((set, get) => ({
  deferredPrompt: null,
  isInstalled: false,
  canInstall: false,
  isStandalone: false,

  setDeferredPrompt: (prompt) => {
    set({ deferredPrompt: prompt, canInstall: !!prompt })
    // PWA prompt is ready
  },

  setInstalled: (installed) => set({ isInstalled: installed }),
  setCanInstall: (canInstall) => set({ canInstall }),
  setStandalone: (standalone) => set({ isStandalone: standalone }),

  install: async () => {
    const { deferredPrompt } = get()
    if (!deferredPrompt) {
      // No install prompt available
      return false
    }

    try {
      // Triggering PWA install
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      // User responded to install prompt
      
      if (choiceResult.outcome === 'accepted') {
        set({ deferredPrompt: null, canInstall: false, isInstalled: true })
        return true
      }
      return false
    } catch (error) {
      // PWA install failed
      return false
    }
  },

  initializePWA: () => {
    const store = get()
    
    // Проверяем standalone режим
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true
    store.setStandalone(isStandalone)
    // PWA standalone mode detected

    // Проверяем установку через standalone или URL
    const isInstalled = isStandalone || 
                       window.location.search.includes('standalone=true')
    store.setInstalled(isInstalled)
    // PWA installation status updated

    const handleBeforeInstallPrompt = (e: Event) => {
      // PWA install prompt available
      e.preventDefault()
      store.setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      // PWA successfully installed
      store.setInstalled(true)
      store.setDeferredPrompt(null)
      store.setCanInstall(false)
    }

    // Добавляем слушатели
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Для разработки - симулируем событие через 3 секунды
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        if (!get().deferredPrompt && !isInstalled) {
          // Development: simulating install prompt
          store.setCanInstall(true)
        }
      }, 3000)
    }

    // Cleanup функция
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }
}))