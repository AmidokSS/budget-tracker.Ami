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
  const { formatAmount } = useCurrency()

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
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent mb-2"
          >
            Семейный бюджет
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 mt-2"
          >
            Управляйте финансами всей семьи
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-400 mt-4"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Система активна</span>
          </motion.div>
        </div>

        {/* Общая статистика с улучшенными анимациями */}
        <div className="max-w-4xl mx-auto">
          <GlassMorphismCard
            delay={0.8}
            gradient="from-white/15 to-white/5"
            className="p-8 bg-slate-900/40 shadow-lg backdrop-blur-md border border-slate-800/40 rounded-2xl"
          >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-2xl font-bold text-white mb-6 text-center"
          >
            Общая статистика
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Общий баланс */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 150 }}
              className="text-center group"
            >
              <motion.div 
                className="flex items-center justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30 group-hover:bg-blue-500/30 group-hover:border-blue-500/50 transition-all duration-300">
                  <Wallet className="h-8 w-8 text-blue-400 group-hover:text-blue-300" />
                </div>
              </motion.div>
              <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">Общий баланс</p>
              <motion.div
                className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <AnimatedCurrency
                  amount={totalBalance}
                  formatAmount={formatAmount}
                  duration={1.5}
                />
              </motion.div>
            </motion.div>

            {/* Общие доходы */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 150 }}
              className="text-center group"
            >
              <motion.div 
                className="flex items-center justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30 group-hover:bg-green-500/30 group-hover:border-green-500/50 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-green-400 group-hover:text-green-300" />
                </div>
              </motion.div>
              <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">Общие доходы</p>
              <motion.p 
                className="text-3xl font-bold text-green-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                +{formatAmount(totalIncome)}
              </motion.p>
            </motion.div>

            {/* Общие расходы */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 150 }}
              className="text-center group"
            >
              <motion.div 
                className="flex items-center justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30 group-hover:bg-red-500/30 group-hover:border-red-500/50 transition-all duration-300">
                  <TrendingDown className="h-8 w-8 text-red-400 group-hover:text-red-300" />
                </div>
              </motion.div>
              <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">Общие расходы</p>
              <motion.p 
                className="text-3xl font-bold text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                -{formatAmount(totalExpense)}
              </motion.p>
            </motion.div>
          </div>
          </GlassMorphismCard>
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
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 2.2 + index * 0.2, 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  onClick={() => handleUserClick(user)}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-[#1f123d]/80 to-[#2a1f4f]/60 backdrop-blur-xl rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.3)] p-6 md:p-8 cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] w-full md:w-[calc(50%-1rem)] min-h-[280px]"
                >
                {/* Верхняя часть - имя пользователя */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`${
                      user.name === 'Артур' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-pink-500 to-rose-600'
                    } p-3 rounded-xl`}>
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  </div>
                  <User className="h-5 w-5 text-slate-400 opacity-60" />
                </div>

                {/* Средняя часть - основной баланс */}
                <div className="text-center mb-6">
                  <p className={`text-3xl font-bold tracking-wide mb-2 ${
                    user.balance >= 0 ? 'text-white' : 'text-red-400'
                  }`}>
                    {formatAmount(user.balance)}
                  </p>
                  <p className="text-sm text-slate-400">Общий баланс</p>
                </div>

                {/* Нижняя часть - доходы и расходы */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* Доходы */}
                  <div className="bg-emerald-500/20 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Heart className="h-4 w-4 text-emerald-300" />
                      <p className="text-xs text-emerald-300 font-medium">Доходы</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-300 tracking-wide">
                      +{formatAmount(user.income)}
                    </p>
                  </div>

                  {/* Расходы */}
                  <div className="bg-rose-500/20 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Heart className="h-4 w-4 text-rose-300" />
                      <p className="text-xs text-rose-300 font-medium">Расходы</p>
                    </div>
                    <p className="text-lg font-bold text-rose-300 tracking-wide">
                      -{formatAmount(user.expense)}
                    </p>
                  </div>
                </div>
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
