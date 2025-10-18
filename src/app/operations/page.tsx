'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOperations, useUsers, useCategories, useDeleteOperation } from '@/hooks/useApi'
import { useCurrency } from '@/hooks/useCurrency'
import { GradientPage } from '@/components/GradientPage'
import { EmptyState } from '@/components/EmptyState'
import { LazyVirtualizedOperationList } from '@/components/LazyComponents'
import { 
  Filter, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  X,
  CreditCard,
  Calendar,
  User,
  Tag,
  RotateCcw
} from 'lucide-react'

type Period = 'all' | 'current_month' | 'last_month' | 'last_7_days'

export default function OperationsPage() {
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, operationId: string | null}>({
    show: false,
    operationId: null
  })
  
  const { data: operations, isLoading: operationsLoading } = useOperations({ 
    userId: selectedUser !== 'all' ? selectedUser : undefined,
    period: selectedPeriod !== 'all' ? selectedPeriod : undefined
  })
  const { data: users } = useUsers()
  const { data: categories } = useCategories()
  const deleteOperation = useDeleteOperation()
  const { formatAmount } = useCurrency()

  // Мемоизированные обработчики
  const handleDeleteOperation = useCallback(async (id: string) => {
    setDeleteConfirm({ show: true, operationId: id })
  }, [])

  if (operationsLoading) {
    return (
      <GradientPage>
        <div className="responsive-container section-padding">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="responsive-heading text-white mb-8"
          >
            💳 Операции
          </motion.h1>
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white/70">Загрузка операций...</p>
            </motion.div>
          </div>
        </div>
      </GradientPage>
    )
  }

  const filteredOperations = operations?.filter(operation => {
    const typeMatch = selectedType === 'all' || operation.type === selectedType
    const categoryMatch = selectedCategory === 'all' || operation.categoryId === selectedCategory
    return typeMatch && categoryMatch
  }) || []

  const incomeOperations = filteredOperations.filter(op => op.type === 'income')
  const expenseOperations = filteredOperations.filter(op => op.type === 'expense')
  const totalIncome = incomeOperations.reduce((sum, op) => sum + op.amount, 0)
  const totalExpense = expenseOperations.reduce((sum, op) => sum + op.amount, 0)
  const balance = totalIncome - totalExpense

  const confirmDelete = async () => {
    if (deleteConfirm.operationId) {
      try {
        await deleteOperation.mutateAsync(deleteConfirm.operationId)
        setDeleteConfirm({ show: false, operationId: null })
      } catch (error) {
        console.error('Ошибка при удалении операции:', error)
      }
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, operationId: null })
  }

  const periodLabels: Record<Period, string> = {
    all: 'Все время',
    current_month: 'Текущий месяц',
    last_month: 'Прошлый месяц',
    last_7_days: 'Последние 7 дней'
  }

  const clearFilters = () => {
    setSelectedUser('all')
    setSelectedType('all')
    setSelectedPeriod('all')
    setSelectedCategory('all')
  }

  const hasActiveFilters = selectedUser !== 'all' || selectedType !== 'all' || selectedPeriod !== 'all' || selectedCategory !== 'all'
  return (
    <GradientPage>
      <div className="responsive-container section-padding container-spacing">
        {/* Заголовок и фильтры */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold heading-gold mb-2 drop-shadow-lg">
              <span className="emoji-color">💳</span> Журнал операций
            </h1>
            <p className="text-cyan-100/80 drop-shadow-sm">Интерактивный обзор всех ваших транзакций</p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 glass-card border border-cyan-500/20 text-cyan-100/80 rounded-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-cyan-500/10 transition-all duration-300 backdrop-blur-sm"
              >
                <X className="w-4 h-4 drop-shadow-sm" />
                Сбросить
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 premium-card border border-cyan-500/30 text-cyan-100 font-semibold rounded-xl hover:shadow-glow-primary transition-all duration-300 backdrop-blur-md"
            >
              <Filter className="w-4 h-4 drop-shadow-sm" />
              Фильтры
            </motion.button>
          </div>
        </motion.div>

        {/* Премиальная статистика операций */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Доходы - с зелёным градиентом */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
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
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="premium-subtitle text-sm mb-2">Доходы</p>
                  <div className="premium-value text-3xl font-bold text-emerald-300" data-value={formatAmount(totalIncome)}>
                    {formatAmount(totalIncome)}
                  </div>
                  <p className="premium-subtitle text-xs mt-1">{incomeOperations.length} операций</p>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative"
                >
                  <TrendingUp className="w-8 h-8 premium-icon text-emerald-300" />
                  {/* Волны роста */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1.4],
                      opacity: [0.5, 0.2, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 border-2 border-emerald-400/30 rounded-3xl" 
                  />
                </motion.div>
              </div>
              
              {/* Динамический прогресс-бар */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0, x: "-100%" }}
                  animate={{ 
                    width: "100%", 
                    x: 0
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    delay: 0.2
                  }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                />
              </div>
            </div>

            {/* Плавающие частицы */}
            <motion.div 
              animate={{ 
                y: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 right-4 w-6 h-6 bg-emerald-400/20 rounded-full blur-sm pointer-events-none"
            />
          </motion.div>

          {/* Расходы - с красным градиентом */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.1,
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
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="premium-subtitle text-sm mb-2">Расходы</p>
                  <div className="premium-value text-3xl font-bold text-rose-300" data-value={formatAmount(totalExpense)}>
                    {formatAmount(totalExpense)}
                  </div>
                  <p className="premium-subtitle text-xs mt-1">{expenseOperations.length} операций</p>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/20 to-red-500/15 border border-rose-400/25 backdrop-blur-sm relative"
                >
                  <TrendingDown className="w-8 h-8 premium-icon text-rose-300" />
                  {/* Импульсы тревоги */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-rose-400/25 rounded-3xl blur-sm" 
                  />
                </motion.div>
              </div>
              
              {/* Убывающий прогресс-бар */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: expenseOperations.length > 0 ? "100%" : "0%"
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    delay: 0.3
                  }}
                  className="h-full bg-gradient-to-r from-rose-400 to-red-400 rounded-full"
                />
              </div>
            </div>

            {/* Мигающие предупреждения */}
            <motion.div 
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-4 left-4 w-4 h-4 bg-rose-400/30 rounded-full blur-sm pointer-events-none"
            />
          </motion.div>

          {/* Баланс - с адаптивным цветом */}
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
            whileTap={{ 
              scale: 0.998,
              y: 2
            }}
            className="ultra-premium-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="premium-content-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="premium-subtitle text-sm mb-2">Баланс</p>
                  <div className={`premium-value text-3xl font-bold ${balance >= 0 ? 'text-blue-300' : 'text-orange-300'}`} data-value={formatAmount(balance)}>
                    {formatAmount(balance)}
                  </div>
                  <p className="premium-subtitle text-xs mt-1">За период</p>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`p-4 rounded-3xl border backdrop-blur-sm relative ${
                    balance >= 0 
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/15 border-blue-400/25'
                      : 'bg-gradient-to-br from-orange-500/20 to-amber-500/15 border-orange-400/25'
                  }`}
                >
                  <BarChart3 className={`w-8 h-8 premium-icon ${balance >= 0 ? 'text-blue-300' : 'text-orange-300'}`} />
                  {/* Баланс-индикатор */}
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 border border-opacity-30 rounded-3xl ${
                      balance >= 0 ? 'border-blue-400' : 'border-orange-400'
                    }`}
                  />
                </motion.div>
              </div>
              
              {/* Индикатор состояния */}
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: "100%"
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    delay: 0.4
                  }}
                  className={`h-full rounded-full ${
                    balance >= 0 
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-400'
                      : 'bg-gradient-to-r from-orange-400 to-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Адаптивное ambient освещение */}
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute top-6 right-6 w-20 h-20 rounded-full blur-xl pointer-events-none ${
                balance >= 0 
                  ? 'bg-gradient-to-br from-blue-400/10 to-transparent'
                  : 'bg-gradient-to-br from-orange-400/10 to-transparent'
              }`}
            />
          </motion.div>
        </div>

        {/* Премиальная панель фильтров */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className="ultra-premium-card p-8 overflow-hidden relative"
            >
              <div className="premium-content-glow">
                <h3 className="premium-subtitle text-lg mb-6 flex items-center gap-3">
                  <Filter className="w-5 h-5 premium-icon" />
                  Фильтры операций
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Период */}
                  <div className="space-y-3">
                    <label className="premium-subtitle text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 premium-icon" />
                      Период
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as Period)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                    >
                      {Object.entries(periodLabels).map(([value, label]) => (
                        <option key={value} value={value} className="bg-gray-900 text-white">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Тип операции */}
                  <div className="space-y-3">
                    <label className="premium-subtitle text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 premium-icon" />
                      Тип операции
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                    >
                      <option value="all" className="bg-gray-900 text-white">Все операции</option>
                      <option value="income" className="bg-gray-900 text-white">💰 Доходы</option>
                      <option value="expense" className="bg-gray-900 text-white">💸 Расходы</option>
                    </select>
                  </div>

                  {/* Пользователь */}
                  <div className="space-y-3">
                    <label className="premium-subtitle text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 premium-icon" />
                      Пользователь
                    </label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                    >
                      <option value="all" className="bg-gray-900 text-white">Все пользователи</option>
                      {users?.map((user) => (
                        <option key={user.id} value={user.id} className="bg-gray-900 text-white">
                          👤 {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Категория */}
                  <div className="space-y-3">
                    <label className="premium-subtitle text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4 premium-icon" />
                      Категория
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                    >
                      <option value="all" className="bg-gray-900 text-white">Все категории</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id} className="bg-gray-900 text-white">
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Кнопка сброса фильтров */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPeriod('current_month')
                    setSelectedType('all')
                    setSelectedUser('all')
                    setSelectedCategory('all')
                  }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Сбросить фильтры
                </motion.button>
              </div>

              {/* Ambient подсветка */}
              <motion.div 
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Премиальный список операций */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="ultra-premium-card overflow-hidden relative"
        >
          <div className="premium-content-glow">
            <div className="p-6 border-b border-white/10">
              <h2 className="premium-subtitle text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">💳</span>
                Операции ({filteredOperations.length})
                <span className="text-2xl">✨</span>
              </h2>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {filteredOperations.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={CreditCard}
                    title="Операции не найдены"
                    description={hasActiveFilters 
                      ? "Попробуйте изменить фильтры или очистить их" 
                      : "Пока нет операций. Добавьте свою первую операцию!"
                    }
                    action={hasActiveFilters ? {
                      label: "Очистить фильтры",
                      onClick: clearFilters
                    } : undefined}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <LazyVirtualizedOperationList
                    operations={filteredOperations}
                    onDelete={handleDeleteOperation}
                    height={600}
                    itemHeight={120}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Ambient lighting для списка */}
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mx-4 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  Удалить операцию?
                </h3>
                
                <p className="text-white/70 mb-6">
                  Это действие нельзя будет отменить. Операция будет удалена навсегда.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    Отмена
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    disabled={deleteOperation.isPending}
                    className="flex-1 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteOperation.isPending ? 'Удаление...' : 'Удалить'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GradientPage>
  )
}



