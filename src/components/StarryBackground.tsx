'use client'

import { memo, useMemo } from 'react'

interface Star { id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number }

function generateStars(count = 90): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 3
    })
  }
  return stars
}

export const StarryBackground = memo(function StarryBackground() {
  const stars = useMemo(() => generateStars(120), [])
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">{
      stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-starry-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))
    }</div>
  )
})
export default StarryBackground
