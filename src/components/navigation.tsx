'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FolderOpen,
  Target,
  AlertCircle,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Главная',
    href: '/',
    icon: Home,
    color: 'text-indigo-400',
    activeColor: 'text-indigo-300',
    hoverBg: 'hover:bg-indigo-500/10',
  },
  {
    title: 'Категории',
    href: '/categories',
    icon: FolderOpen,
    color: 'text-emerald-400',
    activeColor: 'text-emerald-300',
    hoverBg: 'hover:bg-emerald-500/10',
  },
  {
    title: 'Цели',
    href: '/goals',
    icon: Target,
    color: 'text-purple-400',
    activeColor: 'text-purple-300',
    hoverBg: 'hover:bg-purple-500/10',
  },
  {
    title: 'Лимиты',
    href: '/limits',
    icon: AlertCircle,
    color: 'text-red-400',
    activeColor: 'text-red-300',
    hoverBg: 'hover:bg-red-500/10',
  },
  {
    title: 'Операции',
    href: '/operations',
    icon: CreditCard,
    color: 'text-orange-400',
    activeColor: 'text-orange-300',
    hoverBg: 'hover:bg-orange-500/10',
  },
  {
    title: 'Аналитика',
    href: '/analytics',
    icon: BarChart3,
    color: 'text-indigo-400',
    activeColor: 'text-indigo-300',
    hoverBg: 'hover:bg-indigo-500/10',
  },
  {
    title: 'Настройки',
    href: '/settings',
    icon: Settings,
    color: 'text-slate-400',
    activeColor: 'text-slate-300',
    hoverBg: 'hover:bg-slate-500/10',
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Семейный Бюджет</h1>
            </motion.div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href as any}>
                      <motion.div
                        className={cn(
                          'relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2',
                          isActive 
                            ? 'bg-white/10 backdrop-blur-sm shadow-lg' 
                            : 'hover:bg-white/5',
                          item.hoverBg
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon 
                          className={cn(
                            'h-4 w-4 transition-colors',
                            isActive ? item.activeColor : item.color
                          )} 
                        />
                        <span 
                          className={cn(
                            'text-sm font-medium transition-colors',
                            isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                          )}
                        >
                          {item.title}
                        </span>
                        
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg"
                            layoutId="activeTab"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href as any}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className={cn(
                            'flex flex-col items-center p-4 rounded-xl transition-all duration-200',
                            isActive 
                              ? 'bg-white/10 backdrop-blur-sm shadow-lg' 
                              : 'hover:bg-white/5',
                            item.hoverBg
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon 
                            className={cn(
                              'h-6 w-6 mb-2 transition-colors',
                              isActive ? item.activeColor : item.color
                            )} 
                          />
                          <span 
                            className={cn(
                              'text-sm font-medium transition-colors',
                              isActive ? 'text-white' : 'text-gray-300'
                            )}
                          >
                            {item.title}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
