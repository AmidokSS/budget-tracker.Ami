'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'

interface UseSearchOptions<T> {
  data: T[]
  keys: string[]
  threshold?: number
  includeScore?: boolean
  minMatchCharLength?: number
}

interface UseSearchResult<T> {
  query: string
  results: T[]
  search: (searchQuery: string) => void
  clearSearch: () => void
  isSearching: boolean
  resultCount: number
}

export function useSearch<T>({
  data,
  keys,
  threshold = 0.3, // Чем меньше, тем строже поиск
  includeScore = false,
  minMatchCharLength = 1
}: UseSearchOptions<T>): UseSearchResult<T> {
  const [query, setQuery] = useState('')

  // Создаем экземпляр Fuse с настройками
  const fuse = useMemo(() => {
    const options = {
      keys,
      threshold,
      includeScore,
      minMatchCharLength,
      // Дополнительные настройки для лучшего поиска
      distance: 100,
      location: 0,
      useExtendedSearch: false,
      findAllMatches: false,
      ignoreLocation: false,
      ignoreFieldNorm: false,
    }
    
    return new Fuse(data, options)
  }, [data, keys, threshold, includeScore, minMatchCharLength])

  // Выполняем поиск
  const results = useMemo(() => {
    if (!query.trim()) {
      return data // Возвращаем все данные если запрос пустой
    }

    const searchResults = fuse.search(query)
    
    if (includeScore) {
      return searchResults as T[]
    }
    
    return searchResults.map(result => result.item)
  }, [query, fuse, data, includeScore])

  const search = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const clearSearch = () => {
    setQuery('')
  }

  return {
    query,
    results,
    search,
    clearSearch,
    isSearching: query.trim().length > 0,
    resultCount: results.length
  }
}

// Предустановленные конфигурации для разных типов данных

export const useOperationSearch = (operations: any[]) => {
  return useSearch({
    data: operations,
    keys: [
      'description',
      'category.name',
      'amount'
    ],
    threshold: 0.4, // Более мягкий поиск для операций
    minMatchCharLength: 2
  })
}

export const useGoalSearch = (goals: any[]) => {
  return useSearch({
    data: goals,
    keys: [
      'title',
      'description',
      'emoji'
    ],
    threshold: 0.3,
    minMatchCharLength: 2
  })
}

export const useLimitSearch = (limits: any[]) => {
  return useSearch({
    data: limits,
    keys: [
      'category.name',
      'limitAmount'
    ],
    threshold: 0.4,
    minMatchCharLength: 2
  })
}

export const useCategorySearch = (categories: any[]) => {
  return useSearch({
    data: categories,
    keys: [
      'name',
      'emoji'
    ],
    threshold: 0.2, // Строгий поиск для категорий
    minMatchCharLength: 1
  })
}