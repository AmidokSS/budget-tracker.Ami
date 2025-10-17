/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: [],
  },
  eslint: {
    dirs: ['src'],
  },
  // Оптимизация для Vercel
  output: 'standalone',
  experimental: {
    // Включаем App Router
    appDir: true,
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

module.exports = nextConfig
