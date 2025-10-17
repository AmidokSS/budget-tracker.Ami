const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
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
