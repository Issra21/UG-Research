import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Vérifier si l'utilisateur est connecté
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const userId = session.user.id

    // Vérifier si le profil existe
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Erreur lors de la vérification du profil:", profileError)
      return NextResponse.json({ error: "Erreur lors de la vérification du profil" }, { status: 500 })
    }

    // Si le profil n'existe pas, le créer
    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        email: session.user.email,
        first_name: session.user.user_metadata?.first_name || "",
        last_name: session.user.user_metadata?.last_name || "",
        role: session.user.user_metadata?.role || "researcher",
        title: session.user.user_metadata?.title || "",
        department: session.user.user_metadata?.department || "",
        laboratory: session.user.user_metadata?.laboratory || "",
        phone: session.user.user_metadata?.phone || "",
        bio: session.user.user_metadata?.bio || "",
        is_active: true,
      })

      if (insertError) {
        console.error("Erreur lors de la création du profil:", insertError)
        return NextResponse.json({ error: "Erreur lors de la création du profil" }, { status: 500 })
      }

      return NextResponse.json({ message: "Profil créé avec succès", created: true })
    }

    return NextResponse.json({ message: "Profil existant", profile: existingProfile })
  } catch (error) {
    console.error("Exception dans check-profile:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
