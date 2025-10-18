'use client'

import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Trash2,
  Edit
} from 'lucide-react'
import { Operation } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/dateUtils'
import { useCurrency } from '@/hooks/useCurrency'

interface AdvancedOperationsTableProps {
  operations: Operation[]
  onEdit?: (operation: Operation) => void
  onDelete?: (operationId: string) => void
  onExport?: () => void
}

const columnHelper = createColumnHelper<Operation>()

const AdvancedOperationsTable = ({ 
  operations, 
  onEdit, 
  onDelete, 
  onExport 
}: AdvancedOperationsTableProps) => {
  const { formatAmountWhole } = useCurrency()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(() => [
    columnHelper.accessor('createdAt', {
      id: 'date',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Дата</span>
          {{
            asc: <ArrowUp className="w-4 h-4" />,
            desc: <ArrowDown className="w-4 h-4" />,
          }[column.getIsSorted() as string] ?? <ArrowUpDown className="w-4 h-4" />}
        </button>
      ),
      cell: (info) => (
        <div className="font-medium">
          {formatRelativeTime(new Date(info.getValue()))}
        </div>
      ),
      sortingFn: 'datetime',
    }),

    columnHelper.accessor('category', {
      id: 'category',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Категория</span>
          {{
            asc: <ArrowUp className="w-4 h-4" />,
            desc: <ArrowDown className="w-4 h-4" />,
          }[column.getIsSorted() as string] ?? <ArrowUpDown className="w-4 h-4" />}
        </button>
      ),
      cell: (info) => {
        const category = info.getValue()
        if (!category) return <span className="text-slate-600">—</span>
        return (
          <div className="flex items-center space-x-2">
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const categoryA = rowA.original.category?.name || ''
        const categoryB = rowB.original.category?.name || ''
        return categoryA.localeCompare(categoryB)
      },
      filterFn: (row, columnId, value) => {
        const categoryName = row.original.category?.name || ''
        return categoryName.toLowerCase().includes(value.toLowerCase())
      },
    }),

    columnHelper.accessor('amount', {
      id: 'amount',
      header: ({ column }) => (
        <button
          className="flex items-center space-x-1 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Сумма</span>
          {{
            asc: <ArrowUp className="w-4 h-4" />,
            desc: <ArrowDown className="w-4 h-4" />,
          }[column.getIsSorted() as string] ?? <ArrowUpDown className="w-4 h-4" />}
        </button>
      ),
      cell: (info) => {
        const operation = info.row.original
        const isIncome = operation.type === 'income'
        return (
          <div className={`font-semibold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
            {isIncome ? '+' : '-'}{formatAmountWhole(info.getValue())}
          </div>
        )
      },
      sortingFn: 'basic',
    }),

    columnHelper.accessor('type', {
      id: 'type',
      header: 'Тип',
      cell: (info) => {
        const type = info.getValue()
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === 'income' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {type === 'income' ? 'Доход' : 'Расход'}
          </span>
        )
      },
      filterFn: (row, columnId, value) => {
        return value.includes(row.getValue(columnId))
      },
    }),

    columnHelper.accessor('user', {
      id: 'user',
      header: 'Пользователь',
      cell: (info) => {
        const user = info.getValue()
        return (
          <span className="text-slate-300">{user?.name || '—'}</span>
        )
      },
      filterFn: (row, columnId, value) => {
        const userName = row.original.user?.name || ''
        return userName.toLowerCase().includes(value.toLowerCase())
      },
    }),

    columnHelper.accessor('note', {
      id: 'note',
      header: 'Заметка',
      cell: (info) => {
        const note = info.getValue()
        return note ? (
          <span className="text-slate-400 text-sm">{note}</span>
        ) : (
          <span className="text-slate-600 text-sm italic">—</span>
        )
      },
      enableSorting: false,
      filterFn: (row, columnId, value) => {
        const note = row.getValue(columnId) as string
        return note?.toLowerCase().includes(value.toLowerCase()) || false
      },
    }),

    columnHelper.display({
      id: 'actions',
      header: 'Действия',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(info.row.original)}
              className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-colors"
              title="Редактировать"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(info.row.original.id)}
              className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    }),
  ], [formatAmountWhole, onEdit, onDelete])

  const table = useReactTable({
    data: operations,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  const typeOptions = [
    { value: 'income', label: 'Доходы' },
    { value: 'expense', label: 'Расходы' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative">
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-4 pr-10 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all"
              placeholder="Поиск по всем полям..."
            />
            <Filter className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Type Filter */}
          <select
            value={(table.getColumn('type')?.getFilterValue() as string[])?.join(',') ?? ''}
            onChange={(e) => {
              const values = e.target.value ? e.target.value.split(',') : []
              table.getColumn('type')?.setFilterValue(values.length ? values : undefined)
            }}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all"
          >
            <option value="">Все типы</option>
            <option value="income">Только доходы</option>
            <option value="expense">Только расходы</option>
          </select>
        </div>

        {/* Export Button */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Экспорт</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700/50"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700/30 transition-colors border-b border-slate-700/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-700/20 border-t border-slate-700/50">
          <div className="text-sm text-slate-400">
            Показано {table.getRowModel().rows.length} из {table.getFilteredRowModel().rows.length} записей
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-slate-300">
              {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedOperationsTable