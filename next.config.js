const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  fallbacks: {
    document: '/offline',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: [],
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

module.exports = withPWA(nextConfig)
