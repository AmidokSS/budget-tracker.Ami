'use client'

import { memo, useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  color: string
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function generateBaseStars(count = 160): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const warm = Math.random() < 0.25 // часть звёзд с тёплым оттенком
    stars.push({
      id: i,
      x: rand(0, 100),
      y: rand(0, 100),
      size: rand(0.8, 2.4),
      opacity: rand(0.25, 0.7),
      duration: rand(2.8, 4.5),
      delay: rand(0, 3),
      color: warm ? 'rgba(255, 215, 160, 0.95)' : 'rgba(255,255,255,0.95)'
    })
  }
  return stars
}

function generateClusteredStars(startId: number, clusters = 4, perCluster = 18): Star[] {
  const stars: Star[] = []
  for (let c = 0; c < clusters; c++) {
    const centerX = rand(10, 90)
    const centerY = rand(10, 80)
    for (let i = 0; i < perCluster; i++) {
      const angle = rand(0, Math.PI * 2)
      const radius = rand(0, 5) // компактный кластер
      stars.push({
        id: startId + c * perCluster + i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: rand(1.2, 2.8),
        opacity: rand(0.5, 0.9),
        duration: rand(2.2, 3.2),
        delay: rand(0, 2),
        color: Math.random() < 0.6 ? 'rgba(255, 225, 170, 0.95)' : 'rgba(255,255,255,0.95)'
      })
    }
  }
  return stars
}

export const StarryBackground = memo(function StarryBackground() {
  const stars = useMemo(() => {
    const base = generateBaseStars(180)
    const clusters = generateClusteredStars(base.length, 5, 16)
    return [...base, ...clusters]
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full shadow-[0_0_6px_rgba(255,255,255,0.18)]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            backgroundColor: s.color,
            animationName: 'starry-twinkle',
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite'
          }}
        />
      ))}
    </div>
  )
})

export default StarryBackground
