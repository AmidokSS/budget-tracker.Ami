import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ArrowRight,
  BarChart3,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useCurrency } from '@/hooks/useCurrency';

interface MonthlyStats {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  operationsCount: number;
  previousBalance: number;
  finalBalance: number;
}

interface MonthlyStatsData {
  currentMonth: MonthlyStats;
  monthlyStats: MonthlyStats[];
  totalBalance: number;
  periodsCount: number;
}

interface ResetSimulation {
  simulation: boolean;
  period: string;
  currentMonth: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    operationsCount: number;
  };
  balances: {
    carryOverBalance: number;
    currentMonthBalance: number;
    finalBalance: number;
  };
  resetPreview: {
    operationsToReset: number;
    newStartingBalance: number;
    message: string;
  };
}

const MonthlyDashboard: React.FC = () => {
  const [data, setData] = useState<MonthlyStatsData | null>(null);
  const [resetSimulation, setResetSimulation] = useState<ResetSimulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResetPreview, setShowResetPreview] = useState(false);
  
  const { formatAmount } = useCurrency();

  // Загружаем данные
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/monthly-stats?months=6');
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Симуляция сброса
  const simulateReset = async () => {
    try {
      const response = await fetch('/api/monthly-stats/simulate-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1' })
      });
      if (!response.ok) throw new Error('Ошибка симуляции');
      const result = await response.json();
      setResetSimulation(result);
      setShowResetPreview(true);
    } catch (err) {
      console.error('Ошибка симуляции:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Форматируем период для отображения
  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  // Рассчитываем тренд
  const trend = useMemo(() => {
    if (!data || data.monthlyStats.length < 2) return null;
    
    const current = data.currentMonth.netBalance;
    const previous = data.monthlyStats[data.monthlyStats.length - 2]?.netBalance || 0;
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / Math.abs(previous)) * 100 : 0;
    
    return {
      change,
      changePercent,
      isPositive: change >= 0
    };
  }, [data]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded-lg mb-4"></div>
          <div className="h-20 bg-white/20 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white/20 rounded-lg"></div>
            <div className="h-16 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl rounded-3xl p-6 border border-red-500/20 shadow-2xl"
      >
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Ошибка загрузки данных'}</span>
        </div>
      </motion.div>
    );
  }

  const { currentMonth, totalBalance } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Месячный обзор</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={simulateReset}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-sm font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          Предпросмотр сброса
        </motion.button>
      </div>

      {/* Текущий период */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">
            {formatPeriod(currentMonth.period)}
          </h3>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend.isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(trend.changePercent).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Главный баланс */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 mb-4 border border-white/10"
        >
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Общий баланс</div>
            <div className={`text-3xl font-bold ${
              totalBalance >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatAmount(totalBalance)}
            </div>
          </div>
        </motion.div>

        {/* Статистика текущего месяца */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">Доходы</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              +{formatAmount(currentMonth.totalIncome)}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">Расходы</span>
            </div>
            <div className="text-xl font-bold text-red-400">
              -{formatAmount(currentMonth.totalExpense)}
            </div>
          </motion.div>
        </div>

        {/* Дополнительная информация */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <BarChart3 className="w-4 h-4" />
            <span>Операций: {currentMonth.operationsCount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign className="w-4 h-4" />
            <span>Чистый: {currentMonth.netBalance >= 0 ? '+' : ''}{formatAmount(Math.abs(currentMonth.netBalance))}</span>
          </div>
        </div>
      </div>

      {/* История последних периодов */}
      {data.monthlyStats.length > 1 && (
        <div>
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            История периодов
          </h4>
          <div className="space-y-2">
            {data.monthlyStats.slice(-3, -1).reverse().map((stat, index) => (
              <motion.div
                key={stat.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {formatPeriod(stat.period)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.operationsCount} операций
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    stat.netBalance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.netBalance >= 0 ? '+' : ''}{formatAmount(Math.abs(stat.netBalance))}
                  </div>
                  <div className="text-xs text-gray-400">
                    Итого: {formatAmount(stat.finalBalance)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Модал предпросмотра сброса */}
      <AnimatePresence>
        {showResetPreview && resetSimulation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Предпросмотр сброса</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-300 mb-2">Текущий месяц</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-green-400">Доходы</div>
                      <div className="font-semibold">+{formatAmount(resetSimulation.currentMonth.totalIncome)}</div>
                    </div>
                    <div>
                      <div className="text-red-400">Расходы</div>
                      <div className="font-semibold">-{formatAmount(resetSimulation.currentMonth.totalExpense)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/20">
                  <div className="text-sm text-gray-300 mb-2">После сброса</div>
                  <div className="text-lg font-bold text-white">
                    Баланс: {formatAmount(resetSimulation.balances.finalBalance)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Операций для сброса: {resetSimulation.resetPreview.operationsToReset}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowResetPreview(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 rounded-xl text-white font-medium"
                >
                  Закрыть
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium"
                >
                  Выполнить сброс
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MonthlyDashboard;