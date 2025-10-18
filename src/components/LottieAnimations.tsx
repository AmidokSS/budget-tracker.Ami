'use client'

import React from 'react'
import Lottie from 'lottie-react'

// Встроенные JSON анимации (легковесные)
const loadingAnimation = {
  "v": "5.7.3",
  "fr": 60,
  "ip": 0,
  "op": 120,
  "w": 200,
  "h": 200,
  "nm": "Loading",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": {
          "a": 1,
          "k": [
            { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] },
            { "t": 120, "s": [360] }
          ],
          "ix": 10
        },
        "p": { "a": 0, "k": [100, 100, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [60, 60], "ix": 2 },
              "p": { "a": 0, "k": [0, 0], "ix": 3 },
              "nm": "Circle"
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.3, 0.7, 1, 1], "ix": 3 },
              "o": { "a": 0, "k": 100, "ix": 4 },
              "w": { "a": 0, "k": 4, "ix": 5 },
              "lc": 2,
              "lj": 2,
              "bm": 0,
              "nm": "Stroke"
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Circle",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}

const successAnimation = {
  "v": "5.7.3",
  "fr": 60,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Success",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Check",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 0, "k": 0, "ix": 10 },
        "p": { "a": 0, "k": [100, 100, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": {
          "a": 1,
          "k": [
            { "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167] }, "t": 0, "s": [0, 0, 100] },
            { "t": 30, "s": [120, 120, 100] },
            { "t": 60, "s": [100, 100, 100] }
          ],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ind": 0,
              "ty": "sh",
              "ix": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0], [0, 0]],
                  "v": [[-25, 0], [-5, 20], [25, -20]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Check Path"
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.2, 0.8, 0.2, 1], "ix": 3 },
              "o": { "a": 0, "k": 100, "ix": 4 },
              "w": { "a": 0, "k": 6, "ix": 5 },
              "lc": 2,
              "lj": 2,
              "bm": 0,
              "nm": "Stroke"
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Check",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}

const celebrationAnimation = {
  "v": "5.7.3",
  "fr": 60,
  "ip": 0,
  "op": 120,
  "w": 200,
  "h": 200,
  "nm": "Celebration",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Confetti",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": {
          "a": 1,
          "k": [
            { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] },
            { "t": 120, "s": [720] }
          ],
          "ix": 10
        },
        "p": {
          "a": 1,
          "k": [
            { "i": { "x": [0.833, 0.833], "y": [0.833, 0.833] }, "o": { "x": [0.167, 0.167] }, "t": 0, "s": [100, 50] },
            { "t": 120, "s": [100, 150] }
          ],
          "ix": 2
        },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": { "a": 0, "k": [8, 8], "ix": 2 },
              "p": { "a": 0, "k": [0, 0], "ix": 3 },
              "r": { "a": 0, "k": 2, "ix": 4 },
              "nm": "Rectangle"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.8, 0, 1], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill"
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Confetti",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}

interface LottieLoaderProps {
  size?: number
  className?: string
}

interface LottieSuccessProps {
  size?: number
  className?: string
  onComplete?: () => void
}

interface LottieCelebrationProps {
  size?: number
  className?: string
  onComplete?: () => void
}

// Компонент загрузки
export const LottieLoader: React.FC<LottieLoaderProps> = ({ 
  size = 60, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie 
        animationData={loadingAnimation}
        style={{ width: size, height: size }}
        loop={true}
      />
    </div>
  )
}

// Компонент успеха
export const LottieSuccess: React.FC<LottieSuccessProps> = ({ 
  size = 80, 
  className = '',
  onComplete
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie 
        animationData={successAnimation}
        style={{ width: size, height: size }}
        loop={false}
        onComplete={onComplete}
      />
    </div>
  )
}

// Компонент празднования
export const LottieCelebration: React.FC<LottieCelebrationProps> = ({ 
  size = 120, 
  className = '',
  onComplete
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie 
        animationData={celebrationAnimation}
        style={{ width: size, height: size }}
        loop={false}
        onComplete={onComplete}
      />
    </div>
  )
}

// Анимированный прогресс-бар
interface AnimatedProgressBarProps {
  progress: number
  className?: string
  showCelebration?: boolean
  onCelebrationComplete?: () => void
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  className = '',
  showCelebration = true,
  onCelebrationComplete
}) => {
  const isComplete = progress >= 100

  return (
    <div className={`relative ${className}`}>
      {/* Прогресс-бар */}
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {/* Анимация при завершении */}
      {isComplete && showCelebration && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <LottieCelebration 
            size={60}
            onComplete={onCelebrationComplete}
          />
        </div>
      )}
    </div>
  )
}

// Loader с кастомным сообщением
interface CustomLoaderProps {
  message?: string
  size?: number
  className?: string
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({
  message = 'Загрузка...',
  size = 60,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LottieLoader size={size} />
      <p className="text-slate-400 text-sm animate-pulse">{message}</p>
    </div>
  )
}

// Success toast
interface SuccessToastProps {
  message: string
  onComplete?: () => void
  className?: string
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  onComplete,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-3 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg ${className}`}>
      <LottieSuccess size={40} onComplete={onComplete} />
      <span className="text-emerald-400 font-medium">{message}</span>
    </div>
  )
}