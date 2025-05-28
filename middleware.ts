import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  // Créer une réponse qui peut être modifiée
  const res = NextResponse.next()
  
  // Créer le client Supabase
  const supabase = createMiddlewareClient({ req, res })

  // Vérifier la session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Logs pour déboguer
  console.log("Middleware - URL:", req.nextUrl.pathname)
  console.log("Middleware - Session:", session ? "Existe" : "N'existe pas")

  // Rediriger les utilisateurs non connectés des pages protégées vers la page de connexion
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
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
  matcher: ["/dashboard/:path*", "/login", "/register", "/profile/:path*"],
}
