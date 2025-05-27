import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Create a Supabase client for the middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if available
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protéger les routes qui nécessitent une authentification
  const protectedRoutes = ["/dashboard", "/profile", "/publications", "/projects", "/researchers"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/signin", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  const authRoutes = ["/auth/signin", "/auth/signup"]
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
