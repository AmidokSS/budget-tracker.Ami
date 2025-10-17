'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCategories } from '@/hooks/useApi'
import { GradientPage } from '@/components/GradientPage'
import CategorySidebar from '@/components/CategorySidebar'
import { Category } from '@/types'
import { TrendingUp, TrendingDown, Folder, Filter, Edit2, Plus } from 'lucide-react'

export default function CategoriesPage() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const { data: categories, isLoading, error } = useCategories()

  // Обработчики
  const handleAddCategory = () => {
    setEditingCategory(null)
    setSidebarOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
    setEditingCategory(null)
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
          Ошибка загрузки категорий
        </div>
      </GradientPage>
    )
  }

  const incomeCategories = categories?.filter(c => c.type === 'income') || []
  const expenseCategories = categories?.filter(c => c.type === 'expense') || []
  const totalCategories = categories?.length || 0

  const filteredCategories = categories?.filter(category => {
    if (filter === 'all') return true
    return category.type === filter
  }) || []

  return (
    <GradientPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent mb-4"
          >
            Категории
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300"
          >
            Управляйте категориями доходов и расходов
          </motion.p>
        </div>

        {/* Мини-статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-teal-500/20 rounded-full border border-teal-500/30">
                  <Folder className="h-6 w-6 text-teal-400" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Всего категорий</p>
              <p className="text-2xl font-bold text-teal-400">{totalCategories}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Доходные</p>
              <p className="text-2xl font-bold text-green-400">{incomeCategories.length}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Расходные</p>
              <p className="text-2xl font-bold text-red-400">{expenseCategories.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Фильтр:</span>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === 'income'
                  ? 'bg-green-500/30 text-green-300 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Доходы
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === 'expense'
                  ? 'bg-red-500/30 text-red-300 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Расходы
            </button>
          </div>
        </motion.div>

        {/* Сетка категорий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer"
              onClick={() => handleEditCategory(category)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {category.emoji}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className={`text-sm ${
                      category.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {category.type === 'income' ? 'Доходы' : 'Расходы'}
                    </p>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Создана:</span>
                  <span className="text-gray-300">
                    {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Карточка добавления категории */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + filteredCategories.length * 0.05 }}
            onClick={handleAddCategory}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border-2 border-dashed border-white/20 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[140px]"
          >
            <div className="text-center">
              <div className="mb-3 mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Plus className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Добавить категорию</h3>
              <p className="text-sm text-gray-400">Создать новую категорию</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Сайдбар */}
      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        category={editingCategory}
      />
    </GradientPage>
  )
}
