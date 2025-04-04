/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita o uso de imagens de domínios externos
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  // Configurações de ambiente de produção
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Otimizações para produção
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = nextConfig 