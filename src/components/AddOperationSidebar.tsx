'use client'

import { useState, useEffect } from 'react'
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm premium-sidebar-overlay"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="premium-sidebar overflow-y-auto fixed right-0 top-0 h-full w-full sm:w-96"
          >
            <div className="premium-sidebar-content">
              {/* Header */}
              <div className="premium-sidebar-header p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">Добавить операцию</h2>
                  {selectedUser && (
                    <p className="text-sm text-white/70 mt-1">Пользователь: {selectedUser.name}</p>
                  )}
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-glow-primary border border-white/20"
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Operation Type */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Тип операции
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setOperationType('income')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          operationType === 'income'
                            ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 shadow-glow-success'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-green-400/30 hover:bg-green-500/10'
                        }`}
                      >
                        <Plus className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Доход</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setOperationType('expense')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          operationType === 'expense'
                            ? 'border-red-400/50 bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-300 shadow-glow-danger'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-red-400/30 hover:bg-red-500/10'
                        }`}
                      >
                        <DollarSign className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Расход</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Сумма
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="premium-form-input"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Категория
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="premium-form-input"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-secondary text-white">
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note */}
                  <div className="premium-form-group">
                    <label className="premium-form-label">
                      Примечание (необязательно)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Описание операции..."
                      rows={3}
                      className="premium-form-input resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={createOperation.isPending || !amount || !categoryId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="premium-sidebar-button premium-sidebar-button-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createOperation.isPending ? 'Добавляю...' : 'Добавить операцию'}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
