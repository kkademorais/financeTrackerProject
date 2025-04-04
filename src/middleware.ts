import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  try {
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
    const ignoredRoutes = ['/api', '/_next', '/static', '/favicon.ico'];
    const shouldIgnore = ignoredRoutes.some(route => pathname.startsWith(route));

    if (shouldIgnore) return null;

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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 