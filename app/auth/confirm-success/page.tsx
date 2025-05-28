"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, User } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profileCreated, setProfileCreated] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const setupProfile = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          // Si l'utilisateur n'est pas connecté, essayer de se connecter avec le token
          const token = searchParams.get("token_hash")
          const type = searchParams.get("type")

          if (token && type) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type as any,
            })

            if (error) {
              console.error("Erreur lors de la vérification OTP:", error)
              setError("Erreur lors de la confirmation de votre email. Veuillez réessayer.")
              setLoading(false)
              return
            }

            // Attendre un peu pour que la session soit établie
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Vérifier à nouveau la session
            const { data: newSessionData } = await supabase.auth.getSession()

            if (!newSessionData.session) {
              setError("Impossible d'établir une session. Veuillez vous connecter manuellement.")
              setLoading(false)
              return
            }
          } else {
            setError("Paramètres de confirmation manquants.")
            setLoading(false)
            return
          }
        }

        // À ce stade, nous devrions avoir une session
        const { data: finalSessionData } = await supabase.auth.getSession()

        if (finalSessionData.session?.user) {
          // Vérifier si le profil existe
          const { data: existingProfile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", finalSessionData.session.user.id)
            .single()

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Erreur lors de la vérification du profil:", profileError)
            setError("Erreur lors de la vérification de votre profil.")
            setLoading(false)
            return
          }

          // Si le profil n'existe pas, le créer
          if (!existingProfile) {
            const { error: insertError } = await supabase.from("profiles").insert({
              id: finalSessionData.session.user.id,
              email: finalSessionData.session.user.email!,
              first_name: finalSessionData.session.user.user_metadata?.first_name || "",
              last_name: finalSessionData.session.user.user_metadata?.last_name || "",
              role: finalSessionData.session.user.user_metadata?.role || "researcher",
              title: finalSessionData.session.user.user_metadata?.title || "",
              department: finalSessionData.session.user.user_metadata?.department || "",
              laboratory: finalSessionData.session.user.user_metadata?.laboratory || "",
              phone: finalSessionData.session.user.user_metadata?.phone || "",
              bio: finalSessionData.session.user.user_metadata?.bio || "",
              is_active: true,
            })

            if (insertError) {
              console.error("Erreur lors de la création du profil:", insertError)
              setError("Erreur lors de la création de votre profil.")
              setLoading(false)
              return
            }

            setProfileCreated(true)
          }

          // Rediriger vers le tableau de bord après 3 secondes
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          setError("Session utilisateur non trouvée.")
        }
      } catch (error: any) {
        console.error("Erreur lors de la configuration du profil:", error)
        setError(error.message || "Une erreur s'est produite.")
      } finally {
        setLoading(false)
      }
    }

    setupProfile()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {error ? (
              <div className="h-16 w-16 text-red-500">❌</div>
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
          <CardTitle className={error ? "text-red-600" : "text-green-600"}>
            {error ? "Erreur" : "Email confirmé avec succès !"}
          </CardTitle>
          <CardDescription>{error ? "Un problème est survenu" : "Votre compte a été activé"}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-700">Configuration de votre compte...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-red-600">{error}</p>
              <div className="space-y-2">
                <Link href="/auth/signin">
                  <Button className="w-full">Aller à la page de connexion</Button>
                </Link>
                <Link href="/auth/resend-confirmation">
                  <Button variant="outline" className="w-full">
                    Renvoyer l'email de confirmation
                  </Button>
                </Link>
              </div>
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
