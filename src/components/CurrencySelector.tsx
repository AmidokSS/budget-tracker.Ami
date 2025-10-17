'use client'

import { motion } from 'framer-motion'
import { Check, RefreshCw } from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { CURRENCIES } from '@/stores/currencyStore'
import type { Currency } from '@/types'

export default function CurrencySelector() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    isLoading,
    error,
    getCurrentRate,
    forceUpdateRates,
    lastUpdated
  } = useCurrency()

  const currentRate = getCurrentRate()
  const currentCurrencyInfo = CURRENCIES[selectedCurrency]

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency)
  }

  const handleRefreshRates = () => {
    forceUpdateRates()
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Никогда'
    
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Только что'
    if (diffHours < 24) return `${diffHours} ч. назад`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} дн. назад`
  }

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Валюта</h2>
          <p className="text-slate-400 text-sm mt-1">
            Выберите валюту для отображения сумм
          </p>
        </div>
        
        <button
          onClick={handleRefreshRates}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
          title="Обновить курсы валют"
        >
          <RefreshCw className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Текущий курс */}
      {selectedCurrency !== 'PLN' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentCurrencyInfo.flag}</div>
              <div>
                <div className="text-sm text-slate-400">Курс</div>
                <div className="text-white font-medium">
                  1 PLN = {currentRate.toFixed(4)} {currentCurrencyInfo.code}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">Обновлено</div>
              <div className="text-xs text-slate-500">{formatLastUpdated()}</div>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-2 bg-red-900/20 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Выбор валюты */}
      <div className="grid grid-cols-2 gap-3">
        {Object.values(CURRENCIES).map((currency) => {
          const isSelected = selectedCurrency === currency.code
          
          return (
            <motion.button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Флаг и код валюты */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{currency.flag}</div>
                <div className="text-left">
                  <div className="font-semibold text-white text-lg">
                    {currency.code}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {currency.name}
                  </div>
                </div>
              </div>

              {/* Символ валюты */}
              <div className="absolute top-4 right-4">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="text-xl text-slate-500 font-bold">
                    {currency.symbol}
                  </div>
                )}
              </div>

              {/* Курс (если не PLN) */}
              {currency.code !== 'PLN' && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-500">
                    1 PLN ≈ {currency.code === 'USD' ? '0.25' : 
                             currency.code === 'EUR' ? '0.23' : 
                             '10.5'} {currency.symbol}
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Информация */}
      <div className="card-base p-4 bg-slate-800/30">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-xl">💡</div>
          <div>
            <h3 className="text-white font-medium mb-1">Информация</h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Все суммы хранятся в польских злотых (PLN)</li>
              <li>• При выборе другой валюты происходит автоматическая конвертация</li>
              <li>• Курсы обновляются автоматически раз в сутки</li>
              <li>• Выбор валюты сохраняется между сессиями</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}