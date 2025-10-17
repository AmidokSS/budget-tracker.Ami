import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Category, Operation, Goal, Limit, Statistics, User, UsersStatistics } from '@/types'

// Тип для суммарной статистики
export interface SummaryStats {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  users: Array<{
    id: string
    name: string
    balance: number
    income: number
    expense: number
  }>
}

// Тип для аналитики
export interface Analytics {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
    avgDailyExpense: number
    operationsCount: number
    period: string
  }
  categoryDistribution: Array<{
    name: string
    emoji: string
    amount: number
    count: number
    percentage: number
  }>
  timeline: Array<{
    date: string
    income: number
    expense: number
  }>
  topCategories: Array<{
    name: string
    emoji: string
    amount: number
    count: number
    percentage: number
  }>
  limits: Array<{
    id: string
    categoryName: string
    categoryEmoji: string
    limitAmount: number
    currentAmount: number
    progress: number
    isOverLimit: boolean
    isAutoCreated: boolean
  }>
  goals: {
    total: number
    completed: number
    completionRate: number
    archived: number
  }
  insights: {
    mostExpensiveCategory: {
      name: string
      emoji: string
      amount: number
    } | null
    avgTransactionAmount: number
    incomeVsExpenseRatio: number
  }
}

// API функции
const api = {
  // Суммарная статистика
  getSummary: async (): Promise<SummaryStats> => {
    const response = await fetch('/api/stats/summary')
    if (!response.ok) throw new Error('Failed to fetch summary')
    return response.json()
  },

  // Аналитика
  getAnalytics: async (userId?: string, period?: string): Promise<Analytics> => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (period) params.append('period', period)
    
    const response = await fetch(`/api/analytics?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch analytics')
    return response.json()
  },
  // Пользователи
  getUsers: async (): Promise<User[]> => {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },
  // Категории
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories')
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  createCategory: async (data: { name: string; type: string; emoji: string }): Promise<Category> => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  updateCategory: async (data: { id: string; name: string; type: string; emoji: string }): Promise<Category> => {
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`/api/categories?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete category')
    }
  },

  // Операции
  getOperations: async (params?: { 
    categoryId?: string; 
    type?: string; 
    userId?: string;
    period?: string;
    limit?: number 
  }): Promise<Operation[]> => {
    const searchParams = new URLSearchParams()
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params?.type) searchParams.set('type', params.type)
    if (params?.userId) searchParams.set('userId', params.userId)
    if (params?.period) searchParams.set('period', params.period)
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`/api/operations?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch operations')
    return response.json()
  },

  createOperation: async (data: { amount: number; categoryId: string; type: string; note?: string; userId?: string }): Promise<Operation> => {
    const response = await fetch('/api/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create operation')
    return response.json()
  },

  deleteOperation: async (id: string): Promise<void> => {
    const response = await fetch(`/api/operations?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete operation')
  },

  // Цели
  getGoals: async (): Promise<Goal[]> => {
    const response = await fetch('/api/goals')
    if (!response.ok) throw new Error('Failed to fetch goals')
    return response.json()
  },

  createGoal: async (data: { title: string; targetAmount: number; deadline?: string; emoji?: string }): Promise<Goal> => {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create goal')
    return response.json()
  },

  updateGoal: async (data: { id: string; title?: string; targetAmount?: number; deadline?: string; emoji?: string; archived?: boolean }): Promise<Goal> => {
    const response = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update goal')
    return response.json()
  },

  addToGoal: async (data: { id: string; addAmount: number }): Promise<Goal> => {
    const response = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to add to goal')
    return response.json()
  },

  deleteGoal: async (id: string): Promise<void> => {
    const response = await fetch(`/api/goals?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete goal')
    }
  },

  // Лимиты
  getLimits: async (): Promise<Limit[]> => {
    const response = await fetch('/api/limits')
    if (!response.ok) throw new Error('Failed to fetch limits')
    return response.json()
  },

  createLimit: async (data: { categoryId: string; limitAmount: number }): Promise<Limit> => {
    const response = await fetch('/api/limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create limit')
    return response.json()
  },

  updateLimit: async (data: { id: string; limitAmount: number }): Promise<Limit> => {
    const response = await fetch('/api/limits', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update limit')
    return response.json()
  },

  deleteLimit: async (id: string): Promise<void> => {
    const response = await fetch(`/api/limits?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete limit')
  },

  // Статистика всех пользователей
  getUsersStatistics: async (): Promise<UsersStatistics> => {
    const response = await fetch('/api/statistics')
    if (!response.ok) throw new Error('Failed to fetch users statistics')
    return response.json()
  },

  // Статистика (старая версия)
  getStatistics: async (period: string = 'month'): Promise<Statistics> => {
    const response = await fetch(`/api/statistics?period=${period}`)
    if (!response.ok) throw new Error('Failed to fetch statistics')
    return response.json()
  },
}

// Хуки для категорий
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['limits'] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['limits'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Хуки для операций
export const useOperations = (params?: { 
  categoryId?: string; 
  type?: string; 
  limit?: number;
  userId?: string;
  period?: string;
}) => {
  return useQuery({
    queryKey: ['operations', params],
    queryFn: () => api.getOperations(params),
  })
}

export const useCreateOperation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['usersStatistics'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export const useDeleteOperation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['usersStatistics'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['limits'] })
    },
  })
}

// Хуки для целей
export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: api.getGoals,
  })
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useAddToGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.addToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

// Хуки для лимитов
export const useLimits = () => {
  return useQuery({
    queryKey: ['limits'],
    queryFn: api.getLimits,
  })
}

export const useCreateLimit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limits'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })
}

export const useUpdateLimit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.updateLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limits'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })
}

export const useDeleteLimit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limits'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })
}

// Хуки для статистики
export const useStatistics = (period: string = 'month') => {
  return useQuery({
    queryKey: ['statistics', period],
    queryFn: () => api.getStatistics(period),
  })
}

// Хуки для пользователей
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  })
}

// Хук для суммарной статистики
export const useSummary = () => {
  return useQuery({
    queryKey: ['summary'],
    queryFn: api.getSummary,
  })
}

// Хук для аналитики
export const useAnalytics = (userId?: string, period?: string) => {
  return useQuery({
    queryKey: ['analytics', userId, period],
    queryFn: () => api.getAnalytics(userId, period),
  })
}

// Хук для статистики всех пользователей
export const useUsersStatistics = () => {
  return useQuery({
    queryKey: ['usersStatistics'],
    queryFn: api.getUsersStatistics,
  })
}