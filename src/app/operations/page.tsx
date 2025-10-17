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
  CreditCard
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
            <h1 className="text-3xl font-bold text-white mb-2">Журнал операций</h1>
            <p className="text-white/70">Интерактивный обзор всех ваших транзакций</p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
                Сбросить
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              <Filter className="w-4 h-4" />
              Фильтры
            </motion.button>
          </div>
        </motion.div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Доходы</p>
                <p className="text-white font-semibold">{incomeOperations.length} операций</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatAmount(totalIncome)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Расходы</p>
                <p className="text-white font-semibold">{expenseOperations.length} операций</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-400">{formatAmount(totalExpense)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Баланс</p>
                <p className="text-white font-semibold">За период</p>
              </div>
            </div>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatAmount(balance)}
            </p>
          </motion.div>
        </div>

        {/* Панель фильтров */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Период</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as Period)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(periodLabels).map(([value, label]) => (
                      <option key={value} value={value} className="bg-gray-800">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Тип</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all" className="bg-gray-800">Все операции</option>
                    <option value="income" className="bg-gray-800">Доходы</option>
                    <option value="expense" className="bg-gray-800">Расходы</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Пользователь</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all" className="bg-gray-800">Все пользователи</option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id} className="bg-gray-800">
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Категория</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all" className="bg-gray-800">Все категории</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id} className="bg-gray-800">
                        {category.emoji} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Список операций */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">
              Операции ({filteredOperations.length})
            </h2>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {filteredOperations.length === 0 ? (
              <div className="p-6">
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
              <div className="p-4">
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
