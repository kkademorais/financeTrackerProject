import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

// Função auxiliar para adicionar headers CORS
function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export default async function middleware(req: NextRequestWithAuth) {
  try {
    // Handling CORS preflight requests
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders(req.headers.get("origin") || "*"),
      });
    }

    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // Lista de rotas públicas
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Lista de rotas que devem ser ignoradas
    const ignoredRoutes = ['/_next', '/static', '/favicon.ico'];
    const shouldIgnore = ignoredRoutes.some(route => pathname.startsWith(route));

    if (shouldIgnore) return null;

    // Se for uma rota de API, apenas adicione os headers CORS
    if (pathname.startsWith('/api')) {
      const response = NextResponse.next();
      const headers = corsHeaders(req.headers.get("origin") || "*");
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Redirecionar página inicial
    if (pathname === '/') {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/register', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirecionar usuário autenticado tentando acessar páginas públicas
    if (isPublicRoute && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirecionar usuário não autenticado tentando acessar rotas protegidas
    if (!isPublicRoute && !isAuth && !pathname.startsWith('/api')) {
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?from=${from}`, req.url));
    }

    return null;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/register', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 