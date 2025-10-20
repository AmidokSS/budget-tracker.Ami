/**
 * 🧠 React Memoization Hooks
 * Хуки для оптимизации мемоизации React компонентов
 */

import React, { useMemo, useCallback, useRef } from 'react'

// 🚀 Стабильный колбэк с мемоизацией
export function useStableCallback<Args extends any[], Return>(
  callback: (...args: Args) => Return
): (...args: Args) => Return {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args: Args) => {
    return callbackRef.current(...args)
  }, [])
}

// 🔄 Мемоизация предыдущего значения
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  React.useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}

// 📊 Простая мемоизация дорогих вычислений
export function useExpensiveComputation<T>(
  computation: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computation, deps)
}

// 🎭 Мемоизация компонента с производительностью
export function withPerformanceMemo<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = React.memo(Component, areEqual)
  
  // Добавляем отладочную информацию в DEV режиме
  if (process.env.NODE_ENV === 'development') {
    MemoizedComponent.displayName = `PerformanceMemo(${Component.displayName || Component.name})`
  }
  
  return MemoizedComponent
}

// ⚡ Оптимизированный useMemo для массивов
export function useArrayMemo<T>(array: T[]): T[] {
  const prevArrayRef = useRef<T[]>([])
  
  return useMemo(() => {
    if (array.length !== prevArrayRef.current.length) {
      prevArrayRef.current = array
      return array
    }
    
    const hasChanged = array.some((item, index) => {
      const prevItem = prevArrayRef.current[index]
      return item !== prevItem
    })
    
    if (hasChanged) {
      prevArrayRef.current = array
      return array
    }
    
    return prevArrayRef.current
  }, [array])
}

// 🎯 Условная мемоизация
export function useConditionalMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  condition: boolean
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedValue = useMemo(factory, deps)
  const unconditionalValue = factory()
  
  return condition ? memoizedValue : unconditionalValue
}

// 🧮 Helper функция для shallow сравнения объектов
export function shallowEqual(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

// 🎲 Hook для отслеживания ре-рендеров (DEV only)
export function useRenderTracker(componentName: string) {
  const renderCount = useRef(0)
  const prevProps = useRef<any>()
  
  renderCount.current += 1
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`)
    }
  })
  
  return {
    renderCount: renderCount.current,
    trackProps: useCallback((props: any) => {
      if (process.env.NODE_ENV === 'development') {
        if (prevProps.current) {
          const changedProps = Object.keys(props).filter(
            key => props[key] !== prevProps.current[key]
          )
          if (changedProps.length > 0) {
            console.log(`📝 ${componentName} props changed:`, changedProps)
          }
        }
        prevProps.current = props
      }
    }, [componentName])
  }
}

// ⚡ Мемоизация селекторов
export function useSelector<T, R>(
  selector: (state: T) => R,
  state: T,
  equalityFn?: (left: R, right: R) => boolean
): R {
  const prevResultRef = useRef<R>()
  const prevSelectorRef = useRef(selector)
  const prevStateRef = useRef(state)
  
  return useMemo(() => {
    const isEqual = equalityFn || ((a, b) => a === b)
    
    if (
      selector !== prevSelectorRef.current ||
      state !== prevStateRef.current
    ) {
      const result = selector(state)
      
      if (prevResultRef.current === undefined || !isEqual(result, prevResultRef.current)) {
        prevResultRef.current = result
      }
      
      prevSelectorRef.current = selector
      prevStateRef.current = state
    }
    
    return prevResultRef.current!
  }, [selector, state, equalityFn])
}

// 🔧 Hook для мемоизации стилей
export function useStyleMemo(styles: React.CSSProperties): React.CSSProperties {
  const stylesKey = JSON.stringify(styles)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => styles, [stylesKey])
}