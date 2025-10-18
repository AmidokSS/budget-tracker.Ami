"use client"

import { ReactNode } from 'react'

interface DynamicGradientWrapperProps {
  children: ReactNode
}

export function DynamicGradientWrapper({ children }: DynamicGradientWrapperProps) {
  // Единый тёмный дизайн: фоны берём из body (globals.css)
  // Обёртка оставлена минимальной, без цветных градиентов и затемнений
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  )
}