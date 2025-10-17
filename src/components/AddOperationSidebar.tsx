'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, DollarSign } from 'lucide-react'
import { useCategories, useCreateOperation } from '@/hooks/useApi'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedUser: { id: string; name: string } | null
}

export default function AddOperationSidebar({ isOpen, onClose, selectedUser }: SidebarProps) {
  const [operationType, setOperationType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')

  const { data: categories } = useCategories()
  const createOperation = useCreateOperation()

  const filteredCategories = categories?.filter(cat => cat.type === operationType) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !amount || !categoryId) return

    try {
      await createOperation.mutateAsync({
        amount: parseFloat(amount),
        categoryId,
        type: operationType,
        note,
        userId: selectedUser.id,
      })

      // Очистить форму
      setAmount('')
      setCategoryId('')
      setNote('')
      onClose()
    } catch (error) {
      console.error('Ошибка создания операции:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-md border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Добавить операцию</h2>
                  {selectedUser && (
                    <p className="text-sm text-gray-400">Пользователь: {selectedUser.name}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Operation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Тип операции
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOperationType('income')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        operationType === 'income'
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Plus className="h-5 w-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Доход</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperationType('expense')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        operationType === 'expense'
                          ? 'border-red-500 bg-red-500/20 text-red-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <DollarSign className="h-5 w-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Расход</span>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Сумма
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Категория
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Примечание (необязательно)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Описание операции..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createOperation.isPending || !amount || !categoryId}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    operationType === 'income'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
                >
                  {createOperation.isPending ? 'Добавляю...' : 'Добавить операцию'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}