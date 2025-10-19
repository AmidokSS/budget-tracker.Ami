'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import type { View, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Operation, Goal } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'
import { motion } from 'framer-motion'

// Настройка русской локализации
moment.locale('ru') // Устанавливаем русскую локаль

// Принудительная настройка недели с понедельника
moment.updateLocale('ru', {
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  // Переставляем дни недели так, чтобы понедельник был первым
  weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  weekdaysMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  week: {
    dow: 1, // Понедельник - первый день недели (ПРИНУДИТЕЛЬНО)
    doy: 4  // Первая неделя года содержит 4 января
  }
})

// Дополнительная настройка для react-big-calendar
;(moment.localeData('ru') as any)._config.week = { dow: 1, doy: 4 }

// Принудительная установка первого дня недели
moment.locale('ru')
const ruLocaleData = moment.localeData('ru') as any
moment.defineLocale('ru-custom', {
  ...ruLocaleData._config,
  week: { dow: 1, doy: 4 }
})
moment.locale('ru-custom')

const localizer = momentLocalizer(moment)

console.log('📅 Calendar: Первый день недели установлен:', (moment.localeData('ru') as any)._config.week.dow)

interface FinancialEvent extends Event {
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
  const [calendarHeight, setCalendarHeight] = useState(500)

  // Устанавливаем высоту календаря в зависимости от размера экрана
  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        setCalendarHeight(window.innerWidth < 768 ? 400 : 500)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

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
  const eventStyleGetter = (event: Event) => {
    const financialEvent = event as FinancialEvent
    let backgroundColor = '#3174ad'
    const color = 'white'

    switch (financialEvent.resource.type) {
      case 'operation':
        backgroundColor = financialEvent.resource.operationType === 'income' ? '#22c55e' : '#ef4444'
        break
      case 'goal':
        switch (financialEvent.resource.priority) {
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
  const EventComponent = ({ event }: { event: Event }) => {
    const financialEvent = event as FinancialEvent
    return (
      <div className="text-xs font-medium truncate">
        {financialEvent.title}
      </div>
    )
  }

  // Кастомный заголовок дня
  const DayHeaderFormat = (date: Date, culture?: string, localizer?: any) => {
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const dayIndex = date.getDay()
    // Корректируем индекс: воскресенье (0) -> 6, понедельник (1) -> 0
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1
    return dayNames[adjustedIndex]
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/20 rounded-lg p-3 text-center backdrop-blur-sm border border-green-500/30">
          <div className="text-green-400 text-sm font-medium">Доходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'income').length}
          </div>
        </div>
        <div className="bg-red-500/20 rounded-lg p-3 text-center backdrop-blur-sm border border-red-500/30">
          <div className="text-red-400 text-sm font-medium">Расходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'expense').length}
          </div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-3 text-center backdrop-blur-sm border border-blue-500/30">
          <div className="text-blue-400 text-sm font-medium">Цели</div>
          <div className="text-white text-lg font-bold">
            {goalEvents.length}
          </div>
        </div>
      </div>

      {/* Календарь */}
      <div className="bg-black/20 backdrop-blur-xl rounded-xl p-2 md:p-4 border border-white/20 shadow-2xl">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          culture="ru-custom"
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent
          }}
          step={60}
          showMultiDayTimes
          firstDayOfWeek={1}
          getNow={() => new Date()}
          formats={{
            dayHeaderFormat: DayHeaderFormat,
            dayRangeHeaderFormat: ({ start, end }: any, culture?: any, localizer?: any) =>
              localizer ? `${localizer.format(start, 'MMMM', culture)} ${localizer.format(start, 'YYYY', culture)}` : '',
            monthHeaderFormat: (date: any, culture?: any, localizer?: any) =>
              localizer ? localizer.format(date, 'MMMM YYYY', culture) : ''
          }}
          messages={{
            next: 'Далее',
            previous: 'Назад',
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
          dayLayoutAlgorithm={'overlap'}
          popup={true}
          style={{ height: calendarHeight }}
          className="financial-calendar"
        />
      </div>

      {/* Легенда */}
      <div className="mt-4 grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
          <span className="text-white/70">Доходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded"></div>
          <span className="text-white/70">Расходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded"></div>
          <span className="text-white/70">Цели (высокий)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded"></div>
          <span className="text-white/70">Цели (средний)</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 md:col-span-1">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-500 rounded"></div>
          <span className="text-white/70">Цели (низкий)</span>
        </div>
      </div>
    </motion.div>
  )
}