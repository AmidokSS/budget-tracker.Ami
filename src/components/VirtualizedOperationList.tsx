'use client'

import React, { memo, useMemo, useState } from 'react'
import { Operation } from '@/types'
import OperationCard from './OperationCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface VirtualizedOperationListProps {
  operations: Operation[]
  onDelete: (_operationId: string) => void
  height: number
  itemHeight: number
}

const ITEMS_PER_PAGE = 10

const VirtualizedOperationList = memo(({
  operations,
  onDelete
}: VirtualizedOperationListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Мемоизируем пагинацию
  const { paginatedOperations, totalPages, hasNext, hasPrev } = useMemo(() => {
    const total = Math.ceil(operations.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginated = operations.slice(startIndex, endIndex)
    
    return {
      paginatedOperations: paginated,
      totalPages: total,
      hasNext: currentPage < total,
      hasPrev: currentPage > 1
    }
  }, [operations, currentPage])

  const nextPage = () => {
    if (hasNext) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (hasPrev) setCurrentPage(prev => prev - 1)
  }

  // Если операций мало, отображаем все без пагинации
  if (operations.length <= ITEMS_PER_PAGE) {
    return (
      <div className="space-y-4">
        {operations.map((operation, index) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            index={index}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Список операций */}
      <div className="space-y-4">
        {paginatedOperations.map((operation, index) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            index={index}
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
              ({operations.length} операций)
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

VirtualizedOperationList.displayName = 'VirtualizedOperationList'

export default VirtualizedOperationList