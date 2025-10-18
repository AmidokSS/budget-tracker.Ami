const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // API кеширование с Network First стратегией
      {
        urlPattern: /^https?.*\/api\/operations/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-operations',
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60, // 5 минут
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https?.*\/api\/goals/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-goals',
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 10 * 60, // 10 минут
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https?.*\/api\/limits/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-limits',
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 10 * 60, // 10 минут
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https?.*\/api\/categories/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'api-categories',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60, // 1 час
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https?.*\/api\/exchange/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-exchange',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 60, // 30 минут
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Статические ресурсы
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
          },
        },
      },
    ],
  },
})

// Условный импорт bundle analyzer только когда нужен
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  eslint: {
    dirs: ['src'],
  },
  // Настройки для работы с базой данных
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Исключаем Prisma Client из бандла клиента
      config.externals.push('@prisma/client')
    }
    return config
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))
