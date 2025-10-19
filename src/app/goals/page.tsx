'use client'

import { motion } from 'framer-motion'

import { useState, useCallback } from 'react'
import { useCurrency } from '@/hooks/useCurrency'
import { useGoals, useUpdateGoal, useDeleteGoal } from '@/hooks/useApi'
import { GradientPage } from '@/components/GradientPage'
import GoalSidebar from '@/components/GoalSidebar'
import GoalCard from '@/components/GoalCard'
import { LazyVirtualizedGoalList } from '@/components/LazyComponents'

import { 
  Target, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Edit3
} from 'lucide-react'
import { Goal } from '@/types'

export default function GoalsPage() {
  const { formatAmountWhole } = useCurrency()
  const { data: goals, isLoading, error } = useGoals()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [sidebarMode, setSidebarMode] = useState<'create' | 'edit' | 'fund' | 'withdraw'>('create')

  const openCreateGoal = () => {
    setSelectedGoal(null)
    setSidebarMode('create')
    setIsSidebarOpen(true)
  }

  const openEditGoal = useCallback((goal: Goal) => {
    setSelectedGoal(goal)
    setSidebarMode('edit')
    setIsSidebarOpen(true)
  }, [])

  const openFundGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setSidebarMode('fund')
    setIsSidebarOpen(true)
  }

  const openWithdrawGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setSidebarMode('withdraw')
    setIsSidebarOpen(true)
  }

  const handleDeleteGoal = useCallback(async (goalId: string) => {
    try {
      await deleteGoal.mutateAsync(goalId)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }, [deleteGoal])



  if (isLoading) {
    return (
      <GradientPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </GradientPage>
    )
  }

  if (error) {
    return (
      <GradientPage>
        <div className="text-center text-red-400">
          Ошибка загрузки целей
        </div>
      </GradientPage>
    )
  }

  const activeGoals = goals?.filter(goal => goal.currentAmount < goal.targetAmount) || []
  const completedGoals = goals?.filter(goal => goal.currentAmount >= goal.targetAmount) || []

  const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  return (
    <>
      <GradientPage>
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Заголовок */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold heading-gold mb-4 drop-shadow-2xl"
            >
              <span className="emoji-color">🎯</span> Финансовые цели
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-cyan-100/80 drop-shadow-lg"
            >
              Планируйте и достигайте финансовых целей с премиальным подходом
            </motion.p>
          </div>

          {/* Премиальная статистика целей */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              scale: 0.999,
              y: 1
            }}
            className="ultra-premium-card p-8 relative overflow-hidden group"
          >
            {/* Premium content glow */}
            <div className="premium-content-glow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Всего целей - с фиолетовым акцентом */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center group relative"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-center mb-4"
                  >
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/15 border border-purple-400/25 backdrop-blur-sm relative">
                      <Target className="w-8 h-8 premium-icon text-purple-300" />
                      {/* Вращающееся свечение */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-400/15 via-transparent to-indigo-400/10 rounded-3xl blur-sm" 
                      />
                    </div>
                  </motion.div>
                  <p className="premium-subtitle text-sm mb-2">Всего целей</p>
                  <div className="premium-value text-3xl font-bold text-purple-300" data-value={goals?.length || 0}>
                    {goals?.length || 0}
                  </div>
                  
                  {/* Анимированная точка */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mx-auto mt-3 w-2 h-2 bg-purple-400 rounded-full"
                  />
                </motion.div>

                {/* Активные цели - с оранжевым акцентом */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center group relative"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-center mb-4"
                  >
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/15 border border-orange-400/25 backdrop-blur-sm relative">
                      <Clock className="w-8 h-8 premium-icon text-orange-300" />
                      {/* Пульсирующее кольцо */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className="absolute inset-0 border-2 border-orange-400/30 rounded-3xl" 
                      />
                    </div>
                  </motion.div>
                  <p className="premium-subtitle text-sm mb-2">Активных</p>
                  <div className="premium-value text-3xl font-bold text-orange-300" data-value={activeGoals.length}>
                    {activeGoals.length}
                  </div>
                  
                  {/* Мигающая линия */}
                  <motion.div 
                    animate={{ 
                      scaleX: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mx-auto mt-3 h-0.5 w-12 bg-orange-400"
                  />
                </motion.div>

                {/* Завершённые цели - с зелёным акцентом */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center group relative"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-center mb-4"
                  >
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative">
                      <CheckCircle className="w-8 h-8 premium-icon text-emerald-300" />
                      {/* Волны успеха */}
                      {completedGoals.length > 0 && (
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.5, 2],
                            opacity: [0.6, 0.3, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                          className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-sm" 
                        />
                      )}
                    </div>
                  </motion.div>
                  <p className="premium-subtitle text-sm mb-2">Завершённых</p>
                  <div className="premium-value text-3xl font-bold text-emerald-300" data-value={completedGoals.length}>
                    {completedGoals.length}
                  </div>
                  
                  {/* Звёздочки успеха */}
                  {completedGoals.length > 0 && (
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mx-auto mt-3 text-emerald-400 text-lg"
                    >
                      ✨
                    </motion.div>
                  )}
                </motion.div>

                {/* Общий прогресс - с розовым акцентом */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center group relative"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-center mb-4"
                  >
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-pink-500/20 to-rose-500/15 border border-pink-400/25 backdrop-blur-sm relative">
                      <TrendingUp className="w-8 h-8 premium-icon text-pink-300" />
                      {/* Прогресс-волна */}
                      <motion.div 
                        animate={{ 
                          x: [-20, 20, -20],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/15 to-transparent rounded-3xl blur-sm" 
                      />
                    </div>
                  </motion.div>
                  <p className="premium-subtitle text-sm mb-2">Общий прогресс</p>
                  <div className="premium-value text-3xl font-bold text-pink-300" data-value={`${totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%`}>
                    {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
                  </div>
                  
                  {/* Прогресс-бар */}
                  <div className="mx-auto mt-3 w-16 h-1 bg-black/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%`
                      }}
                      transition={{ 
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Динамичное ambient освещение для целей */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div 
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, 50, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-8 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/8 to-transparent rounded-full blur-2xl" 
              />
              <motion.div 
                animate={{ 
                  x: [0, -80, 0],
                  y: [0, 30, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-8 right-1/4 w-32 h-32 bg-gradient-to-bl from-emerald-400/6 to-transparent rounded-full blur-2xl" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-pink-400/4 to-orange-400/4 rounded-full blur-3xl" 
              />
            </motion.div>

          </motion.div>

          {/* Активные цели */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Clock className="h-6 w-6 text-orange-400" />
              <span>Активные цели</span>
            </h2>
              
              {activeGoals.length > 6 ? (
                <LazyVirtualizedGoalList
                  goals={activeGoals}
                  onEdit={openEditGoal}
                  onDelete={handleDeleteGoal}
                  height={600}
                  itemHeight={120}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal, index) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      index={index}
                      onEdit={openEditGoal}
                      onDelete={handleDeleteGoal}
                      onFund={openFundGoal}
                      onWithdraw={openWithdrawGoal}
                    />
                  ))}

                  {/* Карточка добавления новой цели - всегда последняя */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + activeGoals.length * 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                    whileHover={{ 
                      scale: 0.999,
                      y: 1
                    }}
                    whileTap={{ 
                      scale: 0.998,
                      y: 2
                    }}
                    onClick={openCreateGoal}
                    className="ultra-premium-card p-8 cursor-pointer group h-full min-h-[280px] border-2 border-dashed border-amber-400/30 hover:border-purple-400/50"
                  >
                    {/* Premium content glow */}
                    <div className="premium-content-glow h-full flex flex-col items-center justify-center text-center">
                      
                      {/* Premium target icon */}
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 to-pink-500/10 border border-purple-400/20 backdrop-blur-sm"
                      >
                        <Target className="w-8 h-8 premium-icon text-purple-400" />
                      </motion.div>
                      
                      <div className="space-y-4">
                        <h3 className="premium-title text-xl font-bold">
                          Добавить цель
                        </h3>
                        <p className="premium-subtitle text-sm max-w-[200px]">
                          Создайте новую финансовую цель и начните копить
                        </p>
                        
                        {/* Premium call-to-action badge */}
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ultra-premium-card border border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-pink-500/5"
                        >
                          <span className="premium-subtitle text-sm text-purple-300">
                            Нажмите для создания
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Luxury ambient lighting for add goal card */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-transparent rounded-full blur-2xl" />
                      <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-tl from-pink-400/6 to-transparent rounded-full blur-xl" />
                    </motion.div>

                  </motion.div>
                </div>
              )}
          </motion.div>

          {/* Завершённые цели */}
          {completedGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Завершённые цели</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-green-500/10 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 relative overflow-hidden group"
                  >
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          onClick={() => openEditGoal(goal)}
                          className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded border border-blue-500/30 transition-colors"
                          title="Редактировать"
                        >
                          <Edit3 className="h-3 w-3 text-blue-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{goal.emoji}</div>
                        <h3 className="text-white font-semibold text-lg">{goal.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Достигнуто:</span>
                        <span className="text-green-400 font-semibold">{formatAmountWhole(goal.targetAmount)}</span>
                      </div>
                      <div className="w-full bg-green-900/30 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-full"></div>
                      </div>
                      <div className="text-center text-sm text-green-400 font-medium">
                        🎉 Цель достигнута!
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}



          {/* Пустое состояние - показываем только если вообще нет целей */}
          {(!goals || goals.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="mb-6 mx-auto w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Target className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Пока нет целей</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Создайте свою первую финансовую цель и начните путь к её достижению
              </p>
              <button
                onClick={openCreateGoal}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Создать первую цель
              </button>
            </motion.div>
          )}
        </div>
      </GradientPage>

      {/* Goal Sidebar */}
      <GoalSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        mode={sidebarMode}
        goal={selectedGoal}
      />
    </>
  )
}






