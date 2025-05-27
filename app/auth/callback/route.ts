import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Échanger le code contre une session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        // Rediriger vers la page de succès de confirmation
        return NextResponse.redirect(new URL("/auth/confirm-success", requestUrl.origin))
      }
    } catch (error) {
      console.error("Erreur lors de l'échange du code:", error)
    }
  }

  // En cas d'erreur, rediriger vers la page de confirmation avec erreur
  return NextResponse.redirect(new URL("/auth/confirm?error=true", requestUrl.origin))
}
