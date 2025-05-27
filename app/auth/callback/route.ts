import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Échanger le code contre une session
      await supabase.auth.exchangeCodeForSession(code)

      // Rediriger directement vers le tableau de bord
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      console.error("Erreur lors de l'échange du code:", error)
      // En cas d'erreur, rediriger vers la page de connexion
      return NextResponse.redirect(new URL("/auth/signin?error=callback_error", requestUrl.origin))
    }
  }

  // Si pas de code, rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
