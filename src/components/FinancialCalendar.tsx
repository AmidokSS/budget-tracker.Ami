'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import type { View, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Operation, Goal } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Настройка русской локализации с понедельником как первым днем недели
moment.updateLocale('ru', {
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  // Дни недели с понедельника
  weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  weekdaysMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  week: {
    dow: 1, // Понедельник - первый день недели
    doy: 4  // Первая неделя года содержит 4 января
  }
})

moment.locale('ru')

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
  // Считаем мобильными экраны < 768px
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [calendarHeight, setCalendarHeight] = useState(500)

  // Отладочная информация
  console.log('📊 Calendar Debug:', {
    operationsCount: operations.length,
    goalsCount: goals.length,
    operations: operations.slice(0, 3), // Показываем первые 3
    goals: goals.slice(0, 3)
  })

  // Устанавливаем высоту календаря в зависимости от размера экрана
  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        const w = window.innerWidth
        const h = window.innerHeight
        const desktopHeight = Math.min(800, Math.max(560, Math.floor(h * 0.6)))
        const mobileHeight = 420
        setCalendarHeight(w < 768 ? mobileHeight : desktopHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Стилизация выходных через dayPropGetter (без DOM-манипуляций)
  const dayPropGetter = (d: Date) => {
    const day = d.getDay()
    const isWeekend = day === 0 || day === 6
    return { className: isWeekend ? 'weekend-day' : '' }
  }

  // Конвертируем операции в события календаря
  const operationEvents: FinancialEvent[] = useMemo(() => {
    const events = operations.map(operation => ({
      id: `operation-${operation.id}`,
      title: `${operation.type === 'income' ? '💰' : '💸'} ${formatCurrency(operation.amount)} - ${operation.note || 'Без описания'}`,
      start: new Date(operation.date),
      end: new Date(operation.date),
      resource: {
        type: 'operation' as const,
        amount: operation.amount,
        category: operation.category?.name,
        operationType: operation.type
      }
    }))
    
    console.log('💰 Operation Events:', events.length, events.slice(0, 2))
    return events
  }, [operations, formatCurrency])

  // Конвертируем цели в события (deadline)
  const goalEvents: FinancialEvent[] = useMemo(() => {
    const events = goals
      .filter(goal => goal.deadline)
      .map(goal => {
        const priorityEmoji = goal.priority === 'high' ? '🔥' : goal.priority === 'medium' ? '⚖️' : '🕐'
        return {
          id: `goal-${goal.id}`,
          title: `${priorityEmoji} Цель: ${goal.title} (${formatCurrency(goal.targetAmount)})`,
          start: new Date(goal.deadline!),
          end: new Date(goal.deadline!),
          resource: {
            type: 'goal' as const,
            amount: goal.targetAmount,
            priority: goal.priority
          }
        }
      })
      
    console.log('🎯 Goal Events:', events.length, events.slice(0, 2))
    return events
  }, [goals, formatCurrency])

  // Объединяем все события
  const allEvents = [...operationEvents, ...goalEvents]
  
  console.log('📅 All Events Total:', allEvents.length)

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

  // Кастомные форматы заголовков (гарантируем ISO-порядок: Пн...Вс)
  const WeekdayFormat = (d: Date) => {
    const names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const idx = moment(d).isoWeekday() - 1 // 1..7 -> 0..6
    return names[idx]
  }
  const DayHeaderFormat = WeekdayFormat

  // На телефонах скрываем весь блок календаря
  if (isMobile) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`ultra-premium-card p-4 md:p-6 ${className || ''}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📅 Финансовый календарь</h2>
        <p className="text-white/70">
          Планируйте операции и отслеживайте дедлайны целей
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 px-4">
        <div className="premium-card text-center">
          <div className="text-green-400 text-sm font-medium">Доходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'income').length}
          </div>
        </div>
        <div className="premium-card text-center">
          <div className="text-red-400 text-sm font-medium">Расходы</div>
          <div className="text-white text-lg font-bold">
            {operationEvents.filter(e => e.resource.operationType === 'expense').length}
          </div>
        </div>
        <div className="premium-card text-center">
          <div className="text-blue-400 text-sm font-medium">Цели</div>
          <div className="text-white text-lg font-bold">
            {goalEvents.length}
          </div>
        </div>
      </div>

      {/* Календарь */}
      <div className="nav-glass rounded-lg p-4 mb-4">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            culture="ru"
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent
            }}
            step={60}
            showMultiDayTimes
            firstDayOfWeek={1}
            getNow={() => new Date()}
            formats={{
              weekdayFormat: WeekdayFormat,
              dayHeaderFormat: DayHeaderFormat,
              dayRangeHeaderFormat: ({ start, end }: any, culture?: any, localizer?: any) =>
                localizer ? `${localizer.format(start, 'MMMM', culture)} ${localizer.format(start, 'YYYY', culture)}` : '',
              monthHeaderFormat: (date: any, culture?: any, localizer?: any) =>
                localizer ? localizer.format(date, 'MMMM YYYY', culture) : ''
            }}
            dayPropGetter={dayPropGetter}
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
            className=""
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
