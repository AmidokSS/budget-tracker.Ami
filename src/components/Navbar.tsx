'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { 
  Home, 
  FolderOpen, 
  Target, 
  AlertCircle, 
  CreditCard, 
  BarChart3, 
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { 
    name: 'Главная', 
    href: '/', 
    icon: Home,
    gradient: 'from-indigo-500 to-purple-600'
  },
  { 
    name: 'Категории', 
    href: '/categories', 
    icon: FolderOpen,
    gradient: 'from-emerald-500 to-green-600'
  },
  { 
    name: 'Цели', 
    href: '/goals', 
    icon: Target,
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    name: 'Лимиты', 
    href: '/limits', 
    icon: AlertCircle,
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    name: 'Операции', 
    href: '/operations', 
    icon: CreditCard,
    gradient: 'from-rose-500 to-red-600'
  },
  { 
    name: 'Аналитика', 
    href: '/analytics', 
    icon: BarChart3,
    gradient: 'from-slate-500 to-indigo-600'
  },
  { 
    name: 'Настройки', 
    href: '/settings', 
    icon: Settings,
    gradient: 'from-gray-500 to-slate-600'
  },
]

export function Navbar() {
  const pathname = usePathname()
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)

  // Точное центрирование активной вкладки в пределах контейнера
  useEffect(() => {
    const centerActiveTab = (behavior: ScrollBehavior = 'smooth') => {
      const container = mobileNavRef.current
      if (!container) return

      // Проверяем overflow и добавляем атрибут для fade-эффектов
      const hasOverflow = container.scrollWidth > container.clientWidth
      if (hasOverflow) {
        container.setAttribute('data-overflowing', 'true')
      } else {
        container.removeAttribute('data-overflowing')
      }

      let activeEl = container.querySelector(
        '[data-active-mobile-tab="true"]'
      ) as HTMLElement | null

      // Fallback: определяем активный по window.location.pathname
      if (!activeEl && typeof window !== 'undefined') {
        const current = window.location.pathname
        activeEl = container.querySelector(
          `[data-mobile-tab="true"][data-href="${current}"]`
        ) as HTMLElement | null
      }

      if (activeEl) {
        const targetCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2
        const newLeft = targetCenter - container.clientWidth / 2
        container.scrollTo({ left: newLeft, behavior })
      }
    }

    // Сначала мгновенно выставляем позицию, затем плавно подтверждаем
    requestAnimationFrame(() => centerActiveTab('auto'))
    const timer = setTimeout(() => centerActiveTab('smooth'), 120)

    return () => clearTimeout(timer)
  }, [pathname])

  // Дополнительное центрирование при загрузке и изменении размера
  useEffect(() => {
    const handleCenteringOnLoad = () => {
      const container = mobileNavRef.current
      if (!container) return
      const activeEl = (container.querySelector(
        '[data-active-mobile-tab="true"]'
      ) as HTMLElement) || activeTabRef.current
      if (activeEl) {
        const targetCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2
        const newLeft = targetCenter - container.clientWidth / 2
        container.scrollTo({ left: newLeft, behavior: 'auto' })
      }
    }

    window.addEventListener('resize', handleCenteringOnLoad)
    // Центрируем при первой загрузке с увеличенной задержкой
    setTimeout(handleCenteringOnLoad, 200)

    return () => window.removeEventListener('resize', handleCenteringOnLoad)
  }, [])

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 hidden md:block',
          'bg-slate-900/60 backdrop-blur-xl shadow-lg border-b border-slate-700/50'
        )}
      >
        <nav className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-center">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                  >
                    <motion.div
                      className={cn(
                        'relative px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 group',
                        isActive
                          ? 'text-white shadow-2xl'
                          : 'text-slate-400 hover:text-slate-100 hover:scale-105'
                      )}
                      whileHover={{ scale: isActive ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active gradient background with glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDesktopTab"
                          className={cn(
                            'absolute inset-0 rounded-2xl bg-gradient-to-r shadow-lg',
                            item.gradient
                          )}
                          style={{
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 8px 32px rgba(0, 0, 0, 0.12)'
                          }}
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover glow effect */}
                      {!isActive && (
                        <motion.div
                          className={cn(
                            'absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-20',
                            item.gradient
                          )}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      <Icon className={cn(
                        'h-5 w-5 relative z-10 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      )} />
                      <span className={cn(
                        'text-sm font-medium relative z-10 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      )}>
                        {item.name}
                      </span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/30 shadow-2xl"
      >
        <div 
          ref={mobileNavRef}
          className="overflow-x-auto scrollbar-hide py-2 mobile-nav-container"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex items-center gap-2 min-w-max px-4">
            {/* Spacers to allow centering first/last items */}
            <div className="flex-shrink-0" aria-hidden style={{ width: '40vw' }} />
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                >
                  <motion.div
                    data-mobile-tab="true"
                    data-href={item.href}
                    data-active-mobile-tab={isActive ? 'true' : undefined}
                    ref={isActive ? activeTabRef : null}
                    className="flex flex-col items-center space-y-1 px-4 py-3 group relative mobile-nav-item flex-shrink-0 min-w-[80px] rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active background circle with glow */}
                    {isActive && (
                      <motion.div
                        layoutId="activeMobileTab"
                        className={cn(
                          'absolute inset-0 rounded-xl bg-gradient-to-r',
                          item.gradient
                        )}
                        style={{
                          boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
                        }}
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <Icon className={cn(
                      'h-5 w-5 relative z-10 transition-colors',
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-400 group-hover:text-slate-200'
                    )} />
                    <span className={cn(
                      'text-xs font-medium relative z-10 transition-colors text-center',
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-400 group-hover:text-slate-200'
                    )}>
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
            <div className="flex-shrink-0" aria-hidden style={{ width: '40vw' }} />
          </div>
        </div>
      </motion.div>
    </>
  )
}
