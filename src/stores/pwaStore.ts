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
    console.log('PWA: Deferred prompt set:', !!prompt)
  },

  setInstalled: (installed) => set({ isInstalled: installed }),
  setCanInstall: (canInstall) => set({ canInstall }),
  setStandalone: (standalone) => set({ isStandalone: standalone }),

  install: async () => {
    const { deferredPrompt } = get()
    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available')
      return false
    }

    try {
      console.log('PWA: Triggering install prompt')
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      console.log('PWA: User choice:', choiceResult.outcome)
      
      if (choiceResult.outcome === 'accepted') {
        set({ deferredPrompt: null, canInstall: false, isInstalled: true })
        return true
      }
      return false
    } catch (error) {
      console.error('PWA: Install error:', error)
      return false
    }
  },

  initializePWA: () => {
    const store = get()
    
    // Проверяем standalone режим
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true
    store.setStandalone(isStandalone)
    console.log('PWA: Standalone mode:', isStandalone)

    // Проверяем установку через standalone или URL
    const isInstalled = isStandalone || 
                       window.location.search.includes('standalone=true')
    store.setInstalled(isInstalled)
    console.log('PWA: App installed:', isInstalled)

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired')
      e.preventDefault()
      store.setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      console.log('PWA: appinstalled event fired')
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
          console.log('PWA: Development mode - simulating install prompt')
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