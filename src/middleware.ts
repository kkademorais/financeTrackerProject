import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { authConfig } from "./lib/auth-config";

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
    // Se for uma rota de API, permita passar
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    console.log("[Middleware] Verificando rota:", req.nextUrl.pathname);
    
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log("[Middleware] Token encontrado:", !!token, "Token:", token);
    
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // Lista de rotas públicas
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Lista de rotas que devem ser ignoradas
    const ignoredRoutes = ['/_next', '/static', '/favicon.ico', '/api', '/auth'];
    const shouldIgnore = ignoredRoutes.some(route => pathname.startsWith(route));

    if (shouldIgnore) {
      console.log("[Middleware] Rota ignorada:", pathname);
      return NextResponse.next();
    }

    // Redirecionar página inicial
    if (pathname === '/') {
      if (!isAuth) {
        console.log("[Middleware] Usuário não autenticado na página inicial, redirecionando para /register");
        return NextResponse.redirect(new URL('/register', req.url));
      }
      console.log("[Middleware] Usuário autenticado na página inicial, redirecionando para /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirecionar usuário autenticado tentando acessar páginas públicas
    if (isPublicRoute && isAuth) {
      console.log("[Middleware] Usuário autenticado tentando acessar página pública, redirecionando para /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirecionar usuário não autenticado tentando acessar rotas protegidas
    if (!isPublicRoute && !isAuth) {
      console.log("[Middleware] Usuário não autenticado tentando acessar rota protegida, redirecionando para /login");
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?from=${from}`, req.url));
    }

    console.log("[Middleware] Permitindo acesso à rota:", pathname);
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Error:', error);
    return NextResponse.redirect(new URL('/register', req.url));
  }
}

// Modificar o matcher para excluir rotas de API e auth
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}; 