'use client'

import React, { memo, useMemo, useState } from 'react'
import { Goal } from '@/types'
import GoalCard from './GoalCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface VirtualizedGoalListProps {
  goals: Goal[]
  onEdit: (_goal: Goal) => void
  onDelete: (_goalId: string) => void
  height: number
  itemHeight: number
}

const ITEMS_PER_PAGE = 6

const VirtualizedGoalList = memo(({
  goals,
  onEdit,
  onDelete
}: VirtualizedGoalListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Мемоизируем пагинацию
  const { paginatedGoals, totalPages, hasNext, hasPrev } = useMemo(() => {
    const total = Math.ceil(goals.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginated = goals.slice(startIndex, endIndex)
    
    return {
      paginatedGoals: paginated,
      totalPages: total,
      hasNext: currentPage < total,
      hasPrev: currentPage > 1
    }
  }, [goals, currentPage])

  const nextPage = () => {
    if (hasNext) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (hasPrev) setCurrentPage(prev => prev - 1)
  }

  // Если целей мало, отображаем все без пагинации
  if (goals.length <= ITEMS_PER_PAGE) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Сетка целей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedGoals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-white/5 rounded-lg">
          <button
            onClick={prevPage}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasPrev 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </button>

          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">
              Страница {currentPage} из {totalPages}
            </span>
            <span className="text-xs text-white/60">
              ({goals.length} целей)
            </span>
          </div>

          <button
            onClick={nextPage}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasNext 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Далее
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
})

VirtualizedGoalList.displayName = 'VirtualizedGoalList'

export default VirtualizedGoalList