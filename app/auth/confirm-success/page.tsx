"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export default function ConfirmSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [profileCreated, setProfileCreated] = useState(false)
  const { user, refreshProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const setupProfile = async () => {
      try {
        // Attendre un peu pour que la session soit bien établie
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Vérifier la session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Vérifier si le profil existe
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (!existingProfile) {
            // Créer le profil s'il n'existe pas
            const { error: insertError } = await supabase.from("profiles").insert({
              id: session.user.id,
              email: session.user.email!,
              first_name: session.user.user_metadata?.first_name || "",
              last_name: session.user.user_metadata?.last_name || "",
              role: session.user.user_metadata?.role || "researcher",
              title: session.user.user_metadata?.title || "",
              department: session.user.user_metadata?.department || "",
              laboratory: session.user.user_metadata?.laboratory || "",
              phone: session.user.user_metadata?.phone || "",
              bio: session.user.user_metadata?.bio || "",
            })

            if (!insertError) {
              setProfileCreated(true)
              await refreshProfile()
            }
          }

          // Rediriger vers le tableau de bord après 3 secondes
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        }
      } catch (error) {
        console.error("Erreur lors de la configuration du profil:", error)
      } finally {
        setLoading(false)
      }
    }

    setupProfile()
  }, [router, refreshProfile])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Email confirmé avec succès !</CardTitle>
          <CardDescription>Votre compte a été activé</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-700">Configuration de votre compte...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Félicitations ! Votre adresse email a été confirmée et votre compte est maintenant actif.
                </p>
                {profileCreated && <p className="text-sm text-green-600">Votre profil a été créé automatiquement.</p>}
                <p className="text-sm text-gray-500">Vous allez être redirigé vers votre tableau de bord...</p>
              </div>

              <div className="space-y-2">
                <Button onClick={() => router.push("/dashboard")} className="w-full">
                  Accéder au tableau de bord
                </Button>
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Compléter mon profil
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
