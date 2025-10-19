declare module 'react-big-calendar' {
  import * as React from 'react'

  export interface Event {
    title: string
    start: Date
    end: Date
    resource?: any
    [key: string]: any
  }

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda'

  export interface CalendarProps {
    localizer: any
    events: Event[]
    startAccessor?: string | ((event: Event) => Date)
    endAccessor?: string | ((event: Event) => Date)
    view?: View
    onView?: (view: View) => void
    date?: Date
    onNavigate?: (date: Date) => void
    eventPropGetter?: (event: Event, start: Date, end: Date, isSelected: boolean) => { style?: React.CSSProperties }
    components?: {
      event?: React.ComponentType<{ event: Event }>
      [key: string]: any
    }
    formats?: {
      dayHeaderFormat?: string | ((date: Date, culture?: string, localizer?: any) => string)
      dayRangeHeaderFormat?: (range: { start: Date; end: Date }, culture?: string, localizer?: any) => string
      monthHeaderFormat?: (date: Date, culture?: string, localizer?: any) => string
      [key: string]: any
    }
    messages?: {
      next?: string
      previous?: string
      today?: string
      month?: string
      week?: string
      day?: string
      agenda?: string
      date?: string
      time?: string
      event?: string
      noEventsInRange?: string
      showMore?: (total: number) => string
      [key: string]: any
    }
    style?: React.CSSProperties
    className?: string
    [key: string]: any
  }

  export class Calendar extends React.Component<CalendarProps> {}

  export function momentLocalizer(moment: any): any
}