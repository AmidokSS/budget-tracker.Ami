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
            className="text-4xl md:text-5xl font-bold heading-gold mb-4 drop-shadow-2xl"
          >
            <span className="emoji-color">📁</span> Категории
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-cyan-100/80 drop-shadow-lg"
          >
            Управляйте категориями доходов и расходов с премиальным интерфейсом
          </motion.p>
        </div>

        {/* Премиальная статистика категорий */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Всего категорий - с уникальным градиентом */}
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
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/15 border border-cyan-400/25 backdrop-blur-sm relative">
                    <Folder className="w-8 h-8 premium-icon text-cyan-300" />
                    {/* Внутреннее свечение */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-3xl blur-sm" />
                  </div>
                </motion.div>
                <p className="premium-subtitle text-sm mb-2">Всего категорий</p>
                <div className="premium-value text-3xl font-bold text-cyan-300" data-value={totalCategories}>
                  {totalCategories}
                </div>
                
                {/* Декоративная линия */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                />
              </motion.div>

              {/* Доходные категории - с зелёным акцентом */}
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
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/15 border border-emerald-400/25 backdrop-blur-sm relative">
                    <TrendingUp className="w-8 h-8 premium-icon text-emerald-300" />
                    {/* Пульсирующее свечение для доходов */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 to-transparent rounded-3xl blur-sm" 
                    />
                  </div>
                </motion.div>
                <p className="premium-subtitle text-sm mb-2">Доходные</p>
                <div className="premium-value text-3xl font-bold text-emerald-300" data-value={incomeCategories.length}>
                  {incomeCategories.length}
                </div>
                
                {/* Декоративная линия */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  className="mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                />
              </motion.div>

              {/* Расходные категории - с красным акцентом */}
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
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/20 to-red-500/15 border border-rose-400/25 backdrop-blur-sm relative">
                    <TrendingDown className="w-8 h-8 premium-icon text-rose-300" />
                    {/* Мерцающее свечение для расходов */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-rose-400/15 to-transparent rounded-3xl blur-sm" 
                    />
                  </div>
                </motion.div>
                <p className="premium-subtitle text-sm mb-2">Расходные</p>
                <div className="premium-value text-3xl font-bold text-rose-300" data-value={expenseCategories.length}>
                  {expenseCategories.length}
                </div>
                
                {/* Декоративная линия */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                  className="mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-rose-400/50 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          {/* Уникальное ambient освещение для статистики */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/6 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-4 center w-24 h-24 bg-gradient-to-tl from-emerald-400/4 to-transparent rounded-full blur-xl" />
            <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-bl from-rose-400/5 to-transparent rounded-full blur-xl" />
          </motion.div>

        </motion.div>

        {/* Премиальные фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Label с иконкой */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/20 backdrop-blur-sm">
              <Filter className="w-5 h-5 premium-icon text-amber-300" />
            </div>
            <span className="premium-subtitle text-sm font-medium">Фильтр категорий:</span>
          </motion.div>
          
          {/* Премиальные кнопки фильтров */}
          <div className="ultra-premium-card p-2 flex gap-2 border border-amber-400/20">
            <motion.button
              whileHover={{ 
                scale: filter === 'all' ? 1 : 1.05,
                y: filter === 'all' ? 0 : -1
              }}
              whileTap={{ 
                scale: 0.98,
                y: 1
              }}
              onClick={() => setFilter('all')}
              className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === 'all'
                  ? 'ultra-premium-card border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-200 shadow-lg'
                  : 'text-white/70 hover:text-amber-200 hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-orange-500/5'
              }`}
            >
              {filter === 'all' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/5 rounded-xl border border-amber-400/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                📁 Все
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: filter === 'income' ? 1 : 1.05,
                y: filter === 'income' ? 0 : -1
              }}
              whileTap={{ 
                scale: 0.98,
                y: 1
              }}
              onClick={() => setFilter('income')}
              className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === 'income'
                  ? 'ultra-premium-card border border-emerald-400/30 bg-gradient-to-r from-emerald-500/15 to-green-500/10 text-emerald-200 shadow-lg'
                  : 'text-white/70 hover:text-emerald-200 hover:bg-gradient-to-r hover:from-emerald-500/5 hover:to-green-500/5'
              }`}
            >
              {filter === 'income' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/5 rounded-xl border border-emerald-400/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                💰 Доходы
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: filter === 'expense' ? 1 : 1.05,
                y: filter === 'expense' ? 0 : -1
              }}
              whileTap={{ 
                scale: 0.98,
                y: 1
              }}
              onClick={() => setFilter('expense')}
              className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === 'expense'
                  ? 'ultra-premium-card border border-rose-400/30 bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-200 shadow-lg'
                  : 'text-white/70 hover:text-rose-200 hover:bg-gradient-to-r hover:from-rose-500/5 hover:to-red-500/5'
              }`}
            >
              {filter === 'expense' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-red-400/5 rounded-xl border border-rose-400/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                💸 Расходы
              </span>
            </motion.button>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.1 + index * 0.05,
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
              className="ultra-premium-card p-8 cursor-pointer group h-full min-h-[200px]"
              onClick={() => handleEditCategory(category)}
            >
              {/* Premium content glow */}
              <div className="premium-content-glow h-full flex flex-col">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Premium emoji container */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/20 backdrop-blur-sm"
                    >
                      <span className="premium-icon text-3xl">{category.emoji}</span>
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="premium-title text-xl font-bold mb-2 leading-tight">
                        {category.name}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ultra-premium-card border ${
                        category.type === 'income' 
                          ? 'border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5' 
                          : 'border-rose-400/20 bg-gradient-to-r from-rose-500/10 to-red-500/5'
                      }`}>
                        <span className={`text-sm font-medium ${
                          category.type === 'income' ? 'text-emerald-300' : 'text-rose-300'
                        }`}>
                          {category.type === 'income' ? '💰 Доходы' : '💸 Расходы'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit button with premium styling */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCategory(category)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-xl ultra-premium-card border border-amber-400/20"
                  >
                    <Edit2 className="w-4 h-4 premium-icon" />
                  </motion.button>
                </div>

                {/* Creation date with emboss styling */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="premium-subtitle text-sm">Создана:</span>
                    <span className="premium-value text-sm font-medium" data-value={new Date(category.createdAt).toLocaleDateString('ru-RU')}>
                      {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Luxury ambient lighting */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className={`absolute top-6 right-6 w-32 h-32 rounded-full blur-2xl ${
                  category.type === 'income' 
                    ? 'bg-gradient-to-br from-emerald-400/8 to-transparent' 
                    : 'bg-gradient-to-br from-rose-400/8 to-transparent'
                }`} />
              </motion.div>

            </motion.div>
          ))}

          {/* Карточка добавления категории */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.1 + filteredCategories.length * 0.05,
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
            onClick={handleAddCategory}
            className="ultra-premium-card p-8 cursor-pointer group h-full min-h-[200px] border-2 border-dashed border-amber-400/30 hover:border-emerald-400/50"
          >
            {/* Premium content glow */}
            <div className="premium-content-glow h-full flex flex-col items-center justify-center text-center">
              
              {/* Premium plus icon */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-green-500/10 border border-emerald-400/20 backdrop-blur-sm"
              >
                <Plus className="w-8 h-8 premium-icon text-emerald-400" />
              </motion.div>
              
              <div className="space-y-3">
                <h3 className="premium-title text-xl font-bold">
                  Добавить категорию
                </h3>
                <p className="premium-subtitle text-sm">
                  Создать новую категорию доходов или расходов
                </p>
              </div>
            </div>

            {/* Luxury ambient lighting for add card */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-emerald-400/8 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-tl from-amber-400/6 to-transparent rounded-full blur-xl" />
            </motion.div>

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



