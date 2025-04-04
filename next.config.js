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
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  // Configuração de headers
  async headers() {
    return [
      {
        // Aplica os headers para todas as rotas de API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  // Configuração de rotas
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  // Configuração de redirecionamentos
  async redirects() {
    return [];
  },
  // Configuração de rotas
  trailingSlash: false,
  poweredByHeader: false,
  // Configuração de build
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 