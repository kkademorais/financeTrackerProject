/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita o uso de imagens de domínios externos
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  },
  // Otimizações para produção
  swcMinify: true,
  reactStrictMode: false,
  // Configuração para o Vercel
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Configuração de ambiente
  env: {
    NEXTAUTH_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  // Configuração de rotas
  trailingSlash: false,
  poweredByHeader: false
}

module.exports = nextConfig 