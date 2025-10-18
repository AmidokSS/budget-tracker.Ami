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
    color: 'primary'
  },
  { 
    name: 'Категории', 
    href: '/categories', 
    icon: FolderOpen,
    color: 'success'
  },
  { 
    name: 'Цели', 
    href: '/goals', 
    icon: Target,
    color: 'primary'
  },
  { 
    name: 'Лимиты', 
    href: '/limits', 
    icon: AlertCircle,
    color: 'warning'
  },
  { 
    name: 'Операции', 
    href: '/operations', 
    icon: CreditCard,
    color: 'danger'
  },
  { 
    name: 'Аналитика', 
    href: '/analytics', 
    icon: BarChart3,
    color: 'primary'
  },
    {
    name: 'Настройки', 
    href: '/settings', 
    icon: Settings,
    color: 'success'
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
      {/* Desktop Navigation - Супер Премиум */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="nav-glass sticky top-0 hidden md:block overflow-hidden"
      >
        {/* Анимированные частицы в хедере */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: '50%',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <nav className="container mx-auto px-6 relative z-10">
          <div className="flex h-24 items-center justify-center">
            
            {/* Премиум логотип слева */}
            <motion.div 
              className="absolute left-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-xl font-bold text-white tracking-wide font-serif">
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    Budget
                  </span>
                  <span className="text-white/90 ml-1">Tracker</span>
                </h1>
                <p className="text-xs text-white/50 font-mono tracking-wider font-semibold">
                  PREMIUM EDITION
                </p>
              </motion.div>
            </motion.div>

            {/* Центральная навигация */}
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                      className={cn(
                        'relative px-6 py-4 rounded-2xl transition-all duration-500 flex items-center space-x-3 group cursor-pointer overflow-hidden',
                        'font-sans font-medium',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      )}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98, y: 1 }}
                    >
                      {/* Активное состояние с premium эффектами */}
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeDesktopTab"
                            className="
                              absolute inset-0 rounded-2xl
                              bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-amber-600/25
                              border border-amber-400/30
                              shadow-[inset_0_1px_0_rgba(255,183,77,0.4),0_0_25px_rgba(255,183,77,0.15)]
                            "
                            initial={false}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                          
                          {/* Внутреннее свечение для активной вкладки */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/5 to-amber-400/10 rounded-2xl"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </>
                      )}

                      {/* Hover эффект для неактивных */}
                      {!isActive && (
                        <motion.div
                          className="
                            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                            bg-gradient-to-br from-white/5 to-white/2
                            border border-white/10
                            transition-opacity duration-300
                          "
                        />
                      )}

                      {/* Иконка с анимацией */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: isActive ? [0, -5, 5, 0] : 0 
                        }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10"
                      >
                        <Icon className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isActive 
                            ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(255,183,77,0.6)]' 
                            : 'text-slate-400 group-hover:text-white group-hover:drop-shadow-lg'
                        )} />
                      </motion.div>

                      {/* Текст */}
                      <span className={cn(
                        'text-sm relative z-10 transition-all duration-300 tracking-wide',
                        isActive 
                          ? 'text-white font-medium drop-shadow-lg' 
                          : 'text-slate-400 group-hover:text-white font-normal'
                      )}>
                        {item.name}
                      </span>

                      {/* Shimmer эффект при активности */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: [-100, 200] }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation - Супер Премиум */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="nav-glass fixed bottom-0 left-0 right-0 md:hidden safe-area-bottom overflow-hidden"
      >
        {/* Анимированные частицы в мобильной навигации */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: '20%',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.6, 0.2],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div 
          ref={mobileNavRef}
          className="overflow-x-auto scrollbar-hide py-4 mobile-nav-container relative z-10"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex items-center gap-3 min-w-max px-4">
            {/* Spacers to allow centering first/last items */}
            <div className="flex-shrink-0" aria-hidden style={{ width: '30vw' }} />
            {navItems.map((item, index) => {
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className={cn(
                      "flex flex-col items-center space-y-2 px-4 py-3 group relative mobile-nav-item flex-shrink-0 min-w-[85px] rounded-2xl transition-all duration-500 overflow-hidden font-sans",
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                  >
                    {/* Active background с премиум эффектами */}
                    {isActive && (
                      <>
                        <motion.div
                          layoutId="activeMobileTab"
                          className="
                            absolute inset-0 rounded-2xl
                            bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-amber-600/25
                            border border-amber-400/30
                            shadow-[inset_0_1px_0_rgba(255,183,77,0.4),0_0_20px_rgba(255,183,77,0.1)]
                          "
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                        
                        {/* Пульсирующее свечение */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/5 to-amber-400/10 rounded-2xl"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </>
                    )}

                    {/* Hover эффект */}
                    {!isActive && (
                      <motion.div
                        className="
                          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                          bg-gradient-to-br from-white/8 to-white/3
                          border border-white/10
                          transition-opacity duration-300
                        "
                      />
                    )}

                    {/* Иконка с анимацией */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: isActive ? [0, -3, 3, 0] : 0 
                      }}
                      transition={{ duration: 0.4 }}
                      className="relative z-10"
                    >
                      <Icon className={cn(
                        'h-5 w-5 transition-all duration-300',
                        isActive 
                          ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(255,183,77,0.5)]' 
                          : 'text-slate-400 group-hover:text-white group-hover:drop-shadow-lg'
                      )} />
                    </motion.div>

                    {/* Текст */}
                    <span className={cn(
                      'text-xs relative z-10 transition-all duration-300 text-center font-medium tracking-wide',
                      isActive 
                        ? 'text-white font-semibold drop-shadow-lg' 
                        : 'text-slate-400 group-hover:text-white'
                    )}>
                      {item.name}
                    </span>

                    {/* Shimmer эффект для активных элементов */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        animate={{ x: [-50, 150] }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
            <div className="flex-shrink-0" aria-hidden style={{ width: '30vw' }} />
          </div>
        </div>
      </motion.div>
    </>
  )
}




