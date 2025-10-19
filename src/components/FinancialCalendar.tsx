'use client'

import React, { useMemo, useState } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Operation, Goal } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'
import { motion } from 'framer-motion'

// Настройка локализации
moment.locale('pl')
const localizer = momentLocalizer(moment)

interface FinancialEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    type: 'operation' | 'goal' | 'recurring'
    amount: number
    category?: string
    priority?: 'high' | 'medium' | 'low'
    operationType?: 'income' | 'expense'
  }
}

interface FinancialCalendarProps {
  operations: Operation[]
  goals: Goal[]
  className?: string
}

export function FinancialCalendar({ operations, goals, className }: FinancialCalendarProps) {
  const { formatCurrency } = useCurrency()
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())

  // Конвертируем операции в события календаря
  const operationEvents: FinancialEvent[] = useMemo(() => {
    return operations.map(operation => ({
      id: `operation-${operation.id}`,
      title: `${operation.type === 'income' ? '💰' : '💸'} ${formatCurrency(operation.amount)} - ${operation.note || 'Без описания'}`,
      start: new Date(operation.date),
      end: new Date(operation.date),
      resource: {
        type: 'operation',
        amount: operation.amount,
        category: operation.category?.name,
        operationType: operation.type
      }
    }))
  }, [operations, formatCurrency])

  // Конвертируем цели в события (deadline)
  const goalEvents: FinancialEvent[] = useMemo(() => {
    return goals
      .filter(goal => goal.deadline)
      .map(goal => {
        const priorityEmoji = goal.priority === 'high' ? '🔥' : goal.priority === 'medium' ? '⚖️' : '🕐'
        return {
          id: `goal-${goal.id}`,
          title: `${priorityEmoji} Цель: ${goal.title} (${formatCurrency(goal.targetAmount)})`,
          start: new Date(goal.deadline!),
          end: new Date(goal.deadline!),
          resource: {
            type: 'goal',
            amount: goal.targetAmount,
            priority: goal.priority
          }
        }
      })
  }, [goals, formatCurrency])

  // Объединяем все события
  const allEvents = [...operationEvents, ...goalEvents]

  // Кастомные стили для событий
  const eventStyleGetter = (event: FinancialEvent) => {
    let backgroundColor = '#3174ad'
    const color = 'white'

    switch (event.resource.type) {
      case 'operation':
        backgroundColor = event.resource.operationType === 'income' ? '#22c55e' : '#ef4444'
        break
      case 'goal':
        switch (event.resource.priority) {
          case 'high':
            backgroundColor = '#dc2626'
            break
          case 'medium':
            backgroundColor = '#f59e0b'
            break
          case 'low':
            backgroundColor = '#6b7280'
            break
        }
        break
    }

    return {
      style: {
        backgroundColor,
        color,
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        padding: '2px 6px'
      }
    }
  }

  // Кастомный компонент для события
  const EventComponent = ({ event }: { event: FinancialEvent }) => (
    <div className="text-xs font-medium truncate">
      {event.title}
    </div>
  )

  // Кастомный заголовок дня
  const DayHeaderFormat = (date: Date, culture?: string, localizer?: any) =>
    localizer.format(date, 'dddd', culture)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📅 Финансовый календарь</h2>
        <p className="text-white/70">
          Планируйте операции и отслеживайте дедлайны целей
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/20 rounded-lg p-3 text-center">
          <div className="text-green-400 text-sm font-medium">Доходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'income').length}
          </div>
        </div>
        <div className="bg-red-500/20 rounded-lg p-3 text-center">
          <div className="text-red-400 text-sm font-medium">Расходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'expense').length}
          </div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-3 text-center">
          <div className="text-blue-400 text-sm font-medium">Цели</div>
          <div className="text-white text-lg font-bold">
            {goalEvents.length}
          </div>
        </div>
      </div>

      {/* Календарь */}
      <div className="bg-white rounded-lg p-4 min-h-[600px]">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent
          }}
          formats={{
            dayHeaderFormat: DayHeaderFormat,
            dayRangeHeaderFormat: ({ start, end }: any, culture?: any, localizer?: any) =>
              localizer ? `${localizer.format(start, 'MMMM', culture)} ${localizer.format(start, 'YYYY', culture)}` : '',
            monthHeaderFormat: (date: any, culture?: any, localizer?: any) =>
              localizer ? localizer.format(date, 'MMMM YYYY', culture) : ''
          }}
          messages={{
            next: 'Следующий',
            previous: 'Предыдущий',
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            agenda: 'Повестка',
            date: 'Дата',
            time: 'Время',
            event: 'Событие',
            noEventsInRange: 'В этом диапазоне нет событий',
            showMore: (total: any) => `+ ещё ${total}`
          }}
          style={{ height: 500 }}
          className="text-gray-800"
        />
      </div>

      {/* Легенда */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-white/70">Доходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-white/70">Расходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-white/70">Цели (высокий приоритет)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-white/70">Цели (средний приоритет)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-white/70">Цели (низкий приоритет)</span>
        </div>
      </div>
    </motion.div>
  )
}