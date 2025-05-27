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
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Erreur lors de l'échange du code:", error)
        // En cas d'erreur, rediriger vers la page de connexion avec un message d'erreur
        return NextResponse.redirect(new URL("/auth/signin?error=callback_error", requestUrl.origin))
      }

      // Rediriger directement vers le tableau de bord après une confirmation réussie
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      console.error("Exception lors de l'échange du code:", error)
      return NextResponse.redirect(new URL("/auth/signin?error=callback_exception", requestUrl.origin))
    }
  }

  // Si pas de code, rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
