import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Vérifier si l'utilisateur est connecté pour accéder au tableau de bord
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // Rediriger les utilisateurs connectés de login/register vers dashboard
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
