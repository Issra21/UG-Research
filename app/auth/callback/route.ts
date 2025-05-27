import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Échanger le code contre une session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Erreur lors de l'échange du code:", error)
        return NextResponse.redirect(
          new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
        )
      }

      // Si c'est une confirmation d'email, créer le profil
      if (type === "email_confirmation" || type === "signup") {
        try {
          // Obtenir la session après l'échange
          const { data: sessionData } = await supabase.auth.getSession()

          if (sessionData.session?.user) {
            // Vérifier si le profil existe déjà
            const { data: existingProfile, error: profileError } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", sessionData.session.user.id)
              .maybeSingle()

            // Si le profil n'existe pas, le créer
            if (!existingProfile && (!profileError || profileError.code === "PGRST116")) {
              const { error: insertError } = await supabase.from("profiles").insert({
                id: sessionData.session.user.id,
                email: sessionData.session.user.email || "",
                first_name: sessionData.session.user.user_metadata?.first_name || "",
                last_name: sessionData.session.user.user_metadata?.last_name || "",
                role: sessionData.session.user.user_metadata?.role || "researcher",
                title: sessionData.session.user.user_metadata?.title || "",
                department: sessionData.session.user.user_metadata?.department || "",
                laboratory: sessionData.session.user.user_metadata?.laboratory || "",
                phone: sessionData.session.user.user_metadata?.phone || "",
                bio: sessionData.session.user.user_metadata?.bio || "",
                is_active: true,
              })

              if (insertError) {
                console.error("Erreur lors de la création du profil:", insertError)
              }
            }
          }
        } catch (profileError) {
          console.error("Erreur lors de la création du profil:", profileError)
        }
      }

      // Rediriger vers le tableau de bord
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      console.error("Exception lors de l'échange du code:", error)
      return NextResponse.redirect(new URL("/auth/signin?error=callback_exception", requestUrl.origin))
    }
  }

  // Si pas de code, rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
