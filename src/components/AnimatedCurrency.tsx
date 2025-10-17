'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedNumber({ value, duration = 1, className = '' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (latest) => Math.round(latest))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest)
    })

    return () => unsubscribe()
  }, [display])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

interface AnimatedCurrencyProps {
  amount: number
  // eslint-disable-next-line no-unused-vars
  formatAmount: (amount: number) => string
  duration?: number
  className?: string
  prefix?: string
}

export function AnimatedCurrency({ 
  amount, 
  formatAmount, 
  duration = 1, 
  className = '',
  prefix = ''
}: AnimatedCurrencyProps) {
  const [displayAmount, setDisplayAmount] = useState(0)
  const spring = useSpring(0, { duration: duration * 1000 })

  useEffect(() => {
    spring.set(amount)
  }, [spring, amount])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayAmount(latest)
    })

    return () => unsubscribe()
  }, [spring])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {prefix}{formatAmount(displayAmount)}
    </motion.span>
  )
}