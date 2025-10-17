'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className = '' }: FloatingActionButtonProps) {
  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16
        bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
        text-white
        rounded-full
        shadow-2xl
        flex items-center justify-center
        backdrop-blur-sm
        border border-white/20
        hover:shadow-3xl
        group
        ${className}
      `}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
        rotate: 90,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 3.0
      }}
    >
      {/* Внутреннее свечение */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Иконка плюса */}
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Plus className="h-6 w-6" />
      </motion.div>
      
      {/* Пульсирующие кольца */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/30"
        animate={{
          scale: [1, 1.5],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        animate={{
          scale: [1, 2],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
    </motion.button>
  )
}