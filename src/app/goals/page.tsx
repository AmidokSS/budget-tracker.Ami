'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGoals, useUpdateGoal, useDeleteGoal } from '@/hooks/useApi'
import { formatCurrency } from '@/lib/utils'
import { GradientPage } from '@/components/GradientPage'
import GoalSidebar from '@/components/GoalSidebar'
import GoalCard from '@/components/GoalCard'
import { LazyVirtualizedGoalList } from '@/components/LazyComponents'

import { 
  Target, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Edit3,
  Archive,
  ArchiveRestore
} from 'lucide-react'
import { Goal } from '@/types'

export default function GoalsPage() {
  const { data: goals, isLoading, error } = useGoals()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [sidebarMode, setSidebarMode] = useState<'create' | 'edit' | 'fund'>('create')

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

  const handleDeleteGoal = useCallback(async (goalId: string) => {
    try {
      await deleteGoal.mutateAsync(goalId)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }, [deleteGoal])

  const handleUnarchiveGoal = async (goal: Goal) => {
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        archived: false,
      })
    } catch (error) {
      console.error('Error unarchiving goal:', error)
    }
  }

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

  const activeGoals = goals?.filter(goal => !goal.archived && goal.currentAmount < goal.targetAmount) || []
  const completedGoals = goals?.filter(goal => !goal.archived && goal.currentAmount >= goal.targetAmount) || []
  const archivedGoals = goals?.filter(goal => goal.archived) || []

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
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent mb-4"
            >
              Финансовые цели
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-300"
            >
              Планируйте и достигайте финансовых целей
            </motion.p>
          </div>

          {/* Общая статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">Всего целей</p>
                <p className="text-2xl font-bold text-purple-400">{goals?.length || 0}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-orange-500/20 rounded-full border border-orange-500/30">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">Активных</p>
                <p className="text-2xl font-bold text-orange-400">{activeGoals.length}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">Завершённых</p>
                <p className="text-2xl font-bold text-green-400">{completedGoals.length}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-pink-500/20 rounded-full border border-pink-500/30">
                    <TrendingUp className="h-6 w-6 text-pink-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">Общий прогресс</p>
                <p className="text-2xl font-bold text-pink-400">
                  {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
                </p>
              </div>
            </div>
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
                    />
                  ))}

                  {/* Карточка добавления новой цели - всегда последняя */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + activeGoals.length * 0.05 }}
                    onClick={openCreateGoal}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border-2 border-dashed border-white/30 hover:border-purple-400/60 hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center min-h-[280px]"
                  >
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <Target className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">Добавить цель</h3>
                        <p className="text-gray-400 text-sm">
                          Создайте новую финансовую цель и начните копить
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                        Нажмите для создания
                      </div>
                    </div>
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
                        <span className="text-green-400 font-semibold">{formatCurrency(goal.targetAmount)}</span>
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

          {/* Архивированные цели */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Archive className="h-6 w-6 text-gray-400" />
              <span>Архивированные цели ({archivedGoals.length})</span>
            </h2>
            
            {archivedGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedGoals.map((goal, index) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-gray-500/10 backdrop-blur-md rounded-2xl p-6 border border-gray-500/30 relative overflow-hidden opacity-60 group"
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Archive className="h-6 w-6 text-gray-400" />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => handleUnarchiveGoal(goal)}
                            className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded border border-green-500/30 transition-colors"
                            title="Разархивировать"
                          >
                            <ArchiveRestore className="h-3 w-3 text-green-400" />
                          </button>
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
                          <div className="text-2xl grayscale">{goal.emoji}</div>
                          <h3 className="text-gray-300 font-semibold text-lg">{goal.title}</h3>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Прогресс:</span>
                          <span className="text-gray-400 font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/30 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-center text-sm text-gray-500 font-medium">
                          📦 Архивировано
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Архивированных целей пока нет</p>
              </div>
            )}
          </motion.div>

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
