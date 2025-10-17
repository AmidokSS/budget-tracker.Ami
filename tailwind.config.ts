import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Градиентные классы для динамических фонов
    'bg-gradient-to-br',
    'from-indigo-900',
    'via-purple-900', 
    'to-indigo-800',
    'from-emerald-900',
    'via-green-800',
    'to-emerald-700',
    'from-cyan-900',
    'via-blue-900',
    'to-cyan-800',
    'from-amber-900',
    'via-orange-800', 
    'to-amber-700',
    'from-rose-900',
    'via-red-900',
    'to-rose-800',
    'from-slate-900',
    'via-indigo-900',
    'to-slate-800',
    'from-gray-900',
    'via-slate-800',
    'to-gray-700',
    // Градиенты для навигации
    'from-indigo-500',
    'to-purple-600',
    'from-emerald-500', 
    'to-green-600',
    'from-cyan-500',
    'to-blue-600',
    'from-amber-500',
    'to-orange-600',
    'from-rose-500',
    'to-red-600',
    'from-slate-500',
    'to-indigo-600',
    'from-gray-500',
    'to-slate-600',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'home-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'categories-gradient':
          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'goals-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'limits-gradient': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'operations-gradient':
          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'analytics-gradient':
          'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'settings-gradient':
          'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
