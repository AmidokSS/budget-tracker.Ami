import React from 'react'

// Валюты и конвертация
export type Currency = 'PLN' | 'USD' | 'EUR' | 'UAH'

export interface ExchangeRates {
  [key: string]: number
  USD: number
  EUR: number
  UAH: number
}

export interface CurrencyInfo {
  code: Currency
  name: string
  symbol: string
  flag: string
}

export interface ExchangeResponse {
  rates: ExchangeRates
  lastUpdated: string
  baseCurrency: 'PLN'
}

export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  gradient: string
}

export interface PageProps {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Базовые типы для приложения
export interface User {
  id: string
  name: string
  balance: number
  income: number
  expense: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  emoji: string
  createdAt: string
}

export interface Operation {
  id: string
  userId: string
  categoryId: string
  type: 'income' | 'expense'
  amount: number
  note?: string
  date: string
  category?: Category
  user?: User
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  emoji: string
  archived: boolean
  createdAt: string
}

export interface Limit {
  id: string
  categoryId: string
  limitAmount: number
  currentAmount: number
  active: boolean
  isAutoCreated?: boolean
  category?: Category
  createdAt: string
}

export interface Statistics {
  period: string
  totalIncome: number
  totalExpense: number
  balance: number
  user: User | null
  categoryStats: Array<{
    category: Category
    total: number
    count: number
  }>
  goals: Goal[]
  limits: Limit[]
  operationsCount: number
}

export interface UsersStatistics {
  users: Array<{
    id: string
    name: string
    income: number
    expense: number
    balance: number
  }>
  total: {
    income: number
    expense: number
    balance: number
  }
}
