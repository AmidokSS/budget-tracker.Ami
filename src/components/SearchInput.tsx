'use client'

import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  onClear?: () => void
  className?: string
  autoFocus?: boolean
}

export default function SearchInput({ 
  placeholder = "Поиск...", 
  onSearch, 
  onClear,
  className = "",
  autoFocus = false 
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    onClear?.()
  }

  const showClearButton = query.length > 0

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative flex items-center ultra-premium-card transition-all duration-300 ${
        isFocused ? 'border-amber-400/30' : 'border-white/10'
      }`}>
        {/* Search Icon */}
        <Search className={`w-5 h-5 ml-4 transition-colors duration-300 ${
          isFocused ? 'text-amber-400' : 'text-slate-400'
        }`} />
        
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-400 focus:outline-none"
        />
        
        {/* Clear Button */}
        <AnimatePresence>
          {showClearButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
              className="p-2 mr-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Focus glow effect */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400/20 to-orange-400/10 rounded-2xl blur-xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}