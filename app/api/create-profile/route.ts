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

    // Créer le profil
    const { data, error } = await supabase
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

    if (error) {
      console.error("Erreur lors de la création du profil:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data[0] })
  } catch (error: any) {
    console.error("Exception dans create-profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
