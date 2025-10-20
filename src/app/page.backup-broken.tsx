'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUsersStatistics } from '@/hooks/useApi'
import { useCurrency } from '@/hooks/useCurrency'
import { AnimatedCurrency } from '@/components/AnimatedCurrency'
import { GradientPage } from '@/components/GradientPage'
import AddOperationSidebar from '@/components/AddOperationSidebar'
import { FloatingParticles } from '@/components/FloatingParticles'
import { GlassMorphismCard } from '@/components/GlassMorphismCard'
import { PremiumLoader } from '@/components/PremiumLoader'
import { LazyMonthlyDashboard } from '@/components/LazyComponents'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  User,
  Heart,
} from 'lucide-react'

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null)
  
  const { data: summaryData, isLoading } = useUsersStatistics()
  const { formatAmount, formatAmountWhole } = useCurrency()

  if (isLoading) {
    return (
      <GradientPage>
        <FloatingParticles />
        <PremiumLoader />
      </GradientPage>
    )
  }

  const totalBalance = summaryData?.total.balance || 0
  const totalIncome = summaryData?.total.income || 0
  const totalExpense = summaryData?.total.expense || 0
  const users = summaryData?.users || []

  const handleUserClick = (user: { id: string; name: string }) => {
    setSelectedUser(user)
    setIsSidebarOpen(true)
  }

  return (
    <GradientPage>
      <FloatingParticles />
      <div className="container mx-auto px-4 pt-8 max-w-6xl space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold heading-gold mb-2 drop-shadow-2xl font-serif"
          >
            <span className="emoji-color">💰</span> Семейный бюджет
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-cyan-100/80 mt-2 drop-shadow-lg font-sans"
          >
            Управляйте финансами всей семьи с премиальным комфортом
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center space-x-2 text-sm text-cyan-200/70 mt-4"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-glow-primary"
            ></motion.div>
            <span className="drop-shadow-sm">Премиальная система активна</span>
          </motion.div>
        </div>

        {/* Премиальная общая статистика */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.8,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            className="ultra-premium-card p-10 relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="premium-subtitle text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 font-serif"
              >
                <span className="text-4xl">📊</span>
                Семейная статистика
                <span className="text-4xl">💎</span>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Общий баланс - адаптивный дизайн */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 1.2, 
                    type: "spring", 
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5
                  }}
                  className="text-center group cursor-pointer relative"
                >
                  <motion.div 
                    className="flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`p-6 rounded-3xl border backdrop-blur-sm relative ${
                      totalBalance >= 0 
                        ? 'bg-gradient-to-br from-blue-500/25 to-cyan-500/15 border-blue-400/30'
                        : 'bg-gradient-to-br from-red-500/25 to-rose-500/15 border-red-400/30'
                    }`}>
                      <Wallet className={`h-10 w-10 ${
                        totalBalance >= 0 ? 'text-blue-300' : 'text-red-300'
                      }`} />
                      
                      {/* Адаптивные пульсирующие кольца */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [0.4, 0.1, 0.4]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className={`absolute inset-0 border-2 rounded-3xl ${
                          totalBalance >= 0 ? 'border-blue-400/30' : 'border-red-400/30'
                        }`}
                      />
                    </div>
                  </motion.div>
                  
                  <p className="premium-subtitle text-lg mb-3">Общий баланс</p>
                  <motion.div
                    className={`premium-value text-4xl font-bold ${
                      totalBalance >= 0 ? 'text-blue-300' : 'text-red-300'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <AnimatedCurrency
                      amount={totalBalance}
                      formatAmount={formatAmount}
                      duration={2}
                    />
                  </motion.div>

                  {/* Ambient освещение */}
                  <motion.div 
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute top-4 right-4 w-20 h-20 rounded-full blur-2xl pointer-events-none ${
                      totalBalance >= 0 
                        ? 'bg-gradient-to-br from-blue-400/15 to-transparent'
                        : 'bg-gradient-to-br from-red-400/15 to-transparent'
                    }`}
                  />
                </motion.div>

                {/* Общие доходы - с зелёными волнами успеха */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 1.3, 
                    type: "spring", 
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5
                  }}
                  className="text-center group cursor-pointer relative"
                >
                  <motion.div 
                    className="flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.15, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-6 bg-gradient-to-br from-emerald-500/25 to-green-500/15 rounded-3xl border border-emerald-400/30 backdrop-blur-sm relative">
                      <TrendingUp className="h-10 w-10 text-emerald-300" />
                      
                      {/* Расширяющиеся волны роста */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.6, 1.8],
                          opacity: [0.5, 0.2, 0]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className="absolute inset-0 border-2 border-emerald-400/25 rounded-3xl"
                      />
                      <motion.div 
                        animate={{ 
                          scale: [1.2, 1.8, 2],
                          opacity: [0.3, 0.1, 0]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.5
                        }}
                        className="absolute inset-0 border border-emerald-400/20 rounded-3xl"
                      />
                    </div>
                  </motion.div>
                  
                  <p className="premium-subtitle text-lg mb-3">Общие доходы</p>
                  <motion.p 
                    className="premium-value text-4xl font-bold text-emerald-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    +{formatAmount(totalIncome)}
                  </motion.p>

                  {/* Плавающие частицы успеха */}
                  <motion.div 
                    animate={{ 
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-6 right-6 w-6 h-6 bg-emerald-400/25 rounded-full blur-sm pointer-events-none"
                  />
                </motion.div>

                {/* Общие расходы - с красными предупреждениями */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 1.4, 
                    type: "spring", 
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5
                  }}
                  className="text-center group cursor-pointer relative"
                >
                  <motion.div 
                    className="flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.15, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-6 bg-gradient-to-br from-red-500/25 to-rose-500/15 rounded-3xl border border-red-400/30 backdrop-blur-sm relative">
                      <TrendingDown className="h-10 w-10 text-red-300" />
                      
                      {/* Пульсирующие предупреждения */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.1, 0.4]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-red-400/20 rounded-3xl blur-sm"
                      />
                    </div>
                  </motion.div>
                  
                  <p className="premium-subtitle text-lg mb-3">Общие расходы</p>
                  <motion.p 
                    className="premium-value text-4xl font-bold text-red-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    -{formatAmount(totalExpense)}
                  </motion.p>

                  {/* Мигающие индикаторы */}
                  <motion.div 
                    animate={{ 
                      opacity: [0, 0.6, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute bottom-6 left-6 w-4 h-4 bg-red-400/30 rounded-full blur-sm pointer-events-none"
                  />
                </motion.div>
              </div>
            </div>

            {/* Глобальное ambient освещение для всего блока */}
            <motion.div 
              animate={{ 
                opacity: [0.05, 0.15, 0.05],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/10 via-blue-400/5 to-transparent rounded-full blur-3xl pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Месячная статистика */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <LazyMonthlyDashboard />
          </motion.div>
        </div>

        {/* Карточки пользователей с улучшенными эффектами */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <div className="max-w-[900px] mx-auto flex flex-wrap justify-center gap-8 mt-6">
              {users.filter((user: any) => user.name === 'Артур' || user.name === 'Валерия').map((user: any, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: 2.2 + index * 0.2, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  onClick={() => handleUserClick(user)}
                  whileHover={{ 
                    scale: 1.03,
                    rotateY: 2,
                    z: 50,
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    relative overflow-hidden cursor-pointer w-full md:w-[calc(50%-1rem)] min-h-[320px]
                    ${user.name === 'Артур' 
                      ? 'bg-gradient-to-br from-slate-900/95 via-indigo-900/90 to-purple-900/95' 
                      : 'bg-gradient-to-br from-slate-900/95 via-rose-900/90 to-pink-900/95'
                    }
                    backdrop-blur-2xl rounded-[2rem] 
                    border border-white/10
                    shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
                    before:absolute before:inset-0 before:rounded-[2rem]
                    ${user.name === 'Артур'
                      ? 'before:bg-gradient-to-br before:from-indigo-500/20 before:via-transparent before:to-purple-500/20'
                      : 'before:bg-gradient-to-br before:from-rose-500/20 before:via-transparent before:to-pink-500/20'
                    }
                    after:absolute after:inset-0 after:rounded-[2rem] after:opacity-0 after:transition-opacity after:duration-500
                    ${user.name === 'Артур'
                      ? 'hover:after:bg-gradient-to-br hover:after:from-indigo-400/10 hover:after:to-purple-400/10'
                      : 'hover:after:bg-gradient-to-br hover:after:from-rose-400/10 hover:after:to-pink-400/10'
                    }
                    hover:after:opacity-100
                    hover:shadow-[0_0_80px_rgba(139,92,246,0.3),0_0_120px_rgba(139,92,246,0.1)]
                    transition-all duration-500 ease-out
                    group
                  `}
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                
                {/* Абсолютные декоративные элементы */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
                  <div className={`
                    absolute inset-0 rounded-full blur-2xl
                    ${user.name === 'Артур' 
                      ? 'bg-gradient-to-br from-indigo-400 to-purple-600' 
                      : 'bg-gradient-to-br from-rose-400 to-pink-600'
                    }
                  `} />
                </div>
                
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20">
                  <div className={`
                    absolute inset-0 rounded-full blur-xl
                    ${user.name === 'Артур' 
                      ? 'bg-gradient-to-tl from-purple-400 to-indigo-600' 
                      : 'bg-gradient-to-tl from-pink-400 to-rose-600'
                    }
                  `} />
                </div>

                {/* Основной контент */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                
                {/* Верхняя часть - имя пользователя с премиум эффектами */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className={`
                        relative p-4 rounded-2xl
                        ${user.name === 'Артур' 
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-600/30' 
                          : 'bg-gradient-to-br from-rose-500/30 to-pink-600/30'
                        }
                        backdrop-blur-sm border border-white/20
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(0,0,0,0.3)]
                      `}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.6 }
                      }}
                    >
                      <Wallet className="h-6 w-6 text-white drop-shadow-lg" />
                      
                      {/* Внутреннее свечение иконки */}
                      <div className={`
                        absolute inset-0 rounded-2xl blur-md opacity-50
                        ${user.name === 'Артур' 
                          ? 'bg-gradient-to-br from-indigo-400 to-purple-500' 
                          : 'bg-gradient-to-br from-rose-400 to-pink-500'
                        }
                      `} />
                    </motion.div>
                    
                    <div>
                      <motion.h3 
                        className="text-2xl font-bold text-white drop-shadow-lg tracking-wide font-serif"
                        whileHover={{ 
                          scale: 1.05,
                          textShadow: "0 0 20px rgba(255,255,255,0.5)"
                        }}
                      >
                        {user.name}
                      </motion.h3>
                      <motion.p 
                        className="text-sm text-white/60 mt-1 font-sans font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 + index * 0.2 }}
                      >
                        Личный кошелёк
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                  >
                    <User className="h-6 w-6 text-white drop-shadow-lg" />
                  </motion.div>
                </div>

                {/* Средняя часть - основной баланс с премиум эффектами */}
                <div className="text-center mb-8 flex-1 flex flex-col justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2.8 + index * 0.2, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <motion.p 
                      className={`
                        premium-value text-4xl md:text-5xl font-black tracking-wider mb-3
                        heading-gold
                        drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
                        ${user.balance < 0 ? 'from-red-300 via-red-200 to-red-400' : ''}
                      `}
                      whileHover={{
                        textShadow: "0 0 30px rgba(255,255,255,0.8)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      {formatAmountWhole(user.balance)}
                    </motion.p>
                    
                    {/* Подсветка для баланса */}
                    <div className={`
                      absolute inset-0 blur-2xl opacity-20 -z-10
                      ${user.balance >= 0 
                        ? 'bg-gradient-to-r from-emerald-400 to-blue-400' 
                        : 'bg-gradient-to-r from-red-400 to-orange-400'
                      }
                    `} />
                  </motion.div>
                  
                  <motion.p 
                    className="text-white/50 text-sm tracking-wide font-medium font-sans"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2 + index * 0.2 }}
                  >
                    Общий баланс
                  </motion.p>
                </div>

                {/* Нижняя часть - доходы и расходы с премиум стилизацией */}
                <motion.div 
                  className="grid grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.5 + index * 0.2, duration: 0.6 }}
                >
                  {/* Доходы - супер премиум карточка */}
                  <motion.div 
                    className="
                      relative overflow-hidden
                      bg-gradient-to-br from-emerald-500/25 via-emerald-600/15 to-green-500/25
                      backdrop-blur-sm rounded-2xl p-4 text-center
                      border border-emerald-400/30
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(16,185,129,0.2)]
                    "
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 25px rgba(16,185,129,0.4)"
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Heart className="h-5 w-5 text-emerald-300 drop-shadow-lg" />
                      </motion.div>
                      <p className="text-xs text-emerald-200 font-semibold tracking-wide uppercase font-sans">
                        Доходы
                      </p>
                    </div>
                    <motion.p 
                      className="premium-value text-xl font-bold text-emerald-100 tracking-wide drop-shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      +{formatAmountWhole(user.income)}
                    </motion.p>
                    
                    {/* Внутреннее свечение */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-2xl" />
                  </motion.div>

                  {/* Расходы - супер премиум карточка */}
                  <motion.div 
                    className="
                      relative overflow-hidden
                      bg-gradient-to-br from-rose-500/25 via-red-600/15 to-pink-500/25
                      backdrop-blur-sm rounded-2xl p-4 text-center
                      border border-rose-400/30
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(244,63,94,0.2)]
                    "
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 25px rgba(244,63,94,0.4)"
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: -15 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Heart className="h-5 w-5 text-rose-300 drop-shadow-lg" />
                      </motion.div>
                      <p className="text-xs text-rose-200 font-semibold tracking-wide uppercase font-sans">
                        Расходы
                      </p>
                    </div>
                    <motion.p 
                      className="premium-value text-xl font-bold text-rose-100 tracking-wide drop-shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      -{formatAmountWhole(user.expense)}
                    </motion.p>
                    
                    {/* Внутреннее свечение */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-transparent rounded-2xl" />
                  </motion.div>
                </motion.div>
                
                </div>

                {/* Анимированные частицы для премиум эффекта */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`
                        absolute w-2 h-2 rounded-full
                        ${user.name === 'Артур' ? 'bg-indigo-400/40' : 'bg-rose-400/40'}
                      `}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3],
                        x: [0, Math.random() * 20 - 10],
                        y: [0, Math.random() * 20 - 10],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                      }}
                    />
                  ))}
                </div>

                {/* Граничное свечение при ховере */}
                <motion.div
                  className={`
                    absolute inset-0 rounded-[2rem] opacity-0 pointer-events-none
                    ${user.name === 'Артур'
                      ? 'bg-gradient-to-r from-indigo-500/20 via-transparent to-purple-500/20'
                      : 'bg-gradient-to-r from-rose-500/20 via-transparent to-pink-500/20'
                    }
                  `}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Сайдбар для добавления операций */}
      <AddOperationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedUser={selectedUser}
      />
    </GradientPage>
  )
}



