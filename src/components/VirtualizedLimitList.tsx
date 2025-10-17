'use client'

import React, { memo, useMemo, useState } from 'react'
import { Limit } from '@/types'
import LimitCard from './LimitCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface VirtualizedLimitListProps {
  limits: Limit[]
  onEdit: (_limit: Limit) => void
  onDelete: (_limitId: string) => void
  height: number
  itemHeight: number
}

const ITEMS_PER_PAGE = 6

const VirtualizedLimitList = memo(({
  limits,
  onEdit,
  onDelete
}: VirtualizedLimitListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Мемоизируем пагинацию
  const { paginatedLimits, totalPages, hasNext, hasPrev } = useMemo(() => {
    const total = Math.ceil(limits.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginated = limits.slice(startIndex, endIndex)
    
    return {
      paginatedLimits: paginated,
      totalPages: total,
      hasNext: currentPage < total,
      hasPrev: currentPage > 1
    }
  }, [limits, currentPage])

  const nextPage = () => {
    if (hasNext) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (hasPrev) setCurrentPage(prev => prev - 1)
  }

  // Если лимитов мало, отображаем все без пагинации
  if (limits.length <= ITEMS_PER_PAGE) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {limits.map((limit, index) => (
          <LimitCard
            key={limit.id}
            limit={limit}
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
      {/* Сетка лимитов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLimits.map((limit, index) => (
          <LimitCard
            key={limit.id}
            limit={limit}
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
              ({limits.length} лимитов)
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

VirtualizedLimitList.displayName = 'VirtualizedLimitList'

export default VirtualizedLimitList