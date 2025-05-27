import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return res
  }

  // Create a Supabase client configured to use cookies
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Get session from cookies
  const cookieHeader = request.headers.get("cookie")
  let session = null

  if (cookieHeader) {
    try {
      // Extract access token from cookies
      const accessTokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
      if (accessTokenMatch) {
        const tokenData = JSON.parse(decodeURIComponent(accessTokenMatch[1]))
        if (tokenData.access_token) {
          const { data } = await supabase.auth.getUser(tokenData.access_token)
          if (data.user) {
            session = { user: data.user }
          }
        }
      }
    } catch (error) {
      console.error("Middleware auth error:", error)
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/publications",
    "/projects",
    "/researchers",
    "/messages",
    "/analytics",
    "/settings",
  ]

  // Auth routes that should redirect to dashboard if already logged in
  const authRoutes = ["/auth/signin", "/auth/signup"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL("/auth/signin", request.url)
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
