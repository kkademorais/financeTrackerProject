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
  async headers() {
    return [
      {
        // Aplica esses headers para todas as rotas
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Em produção, você deve especificar os domínios permitidos
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
  // Configuração de rotas
  trailingSlash: false,
  poweredByHeader: false
}

module.exports = nextConfig 