import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
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
    const userEmail = session.user.email || ""
    const userMetadata = session.user.user_metadata || {}

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
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          first_name: userMetadata.first_name || "",
          last_name: userMetadata.last_name || "",
          role: userMetadata.role || "researcher",
          title: userMetadata.title || "",
          department: userMetadata.department || "",
          laboratory: userMetadata.laboratory || "",
          phone: userMetadata.phone || "",
          bio: userMetadata.bio || "",
          is_active: true,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Erreur lors de la création du profil:", insertError)
        return NextResponse.json({ error: "Erreur lors de la création du profil" }, { status: 500 })
      }

      return NextResponse.json({ message: "Profil créé avec succès", profile: newProfile })
    }

    return NextResponse.json({ message: "Profil existant", profile: existingProfile })
  } catch (error) {
    console.error("Exception dans ensure-profile:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
