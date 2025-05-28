import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  
  // Logs pour déboguer
  console.log("Callback URL:", request.url)
  console.log("Code présent:", !!code)

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Échanger le code contre une session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Erreur lors de l'échange du code:", error)
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }

      // Obtenir la session après l'échange
      const { data: sessionData } = await supabase.auth.getSession()

      if (sessionData.session?.user) {
        // Créer le profil utilisateur s'il n'existe pas déjà
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", sessionData.session.user.id)
          .maybeSingle()

        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || "",
            first_name: sessionData.session.user.user_metadata?.first_name || "",
            last_name: sessionData.session.user.user_metadata?.last_name || "",
            role: sessionData.session.user.user_metadata?.role || "researcher",
            is_active: true,
          })
        }
      }

      // Rediriger vers le tableau de bord
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      console.error("Exception lors de l'échange du code:", error)
      return NextResponse.redirect(new URL("/login?error=callback_exception", requestUrl.origin))
    }
  }

  // Si pas de code, rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
