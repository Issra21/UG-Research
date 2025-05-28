"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ForceProfileCreationPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const createProfileForcefully = async () => {
      try {
        setLoading(true)

        // 1. Vérifier si l'utilisateur est connecté
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          setError("Aucune session utilisateur trouvée. Veuillez vous connecter.")
          setLoading(false)
          return
        }

        const user = sessionData.session.user
        setUserId(user.id)
        setUserEmail(user.email)

        // 2. Vérifier si le profil existe déjà
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle()

        // 3. Si le profil existe déjà, rediriger vers le tableau de bord
        if (existingProfile) {
          setSuccess(true)
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
          return
        }

        // 4. Créer le profil de force
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email || "",
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          role: user.user_metadata?.role || "researcher",
          is_active: true,
        })

        if (insertError) {
          console.error("Erreur lors de la création du profil:", insertError)
          setError(`Erreur lors de la création du profil: ${insertError.message}`)
          setLoading(false)
          return
        }

        // 5. Profil créé avec succès
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error: any) {
        console.error("Erreur lors de la création forcée du profil:", error)
        setError(`Une erreur s'est produite: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    createProfileForcefully()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {loading ? "Création de votre profil..." : error ? "Erreur" : "Profil créé avec succès !"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-center text-gray-600">Nous configurons votre compte, veuillez patienter...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => router.push("/auth/signin")}>Retour à la connexion</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center text-gray-600">
                Votre profil a été créé avec succès ! Vous allez être redirigé vers votre tableau de bord...
              </p>
              {userId && (
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded w-full">
                  <p>ID: {userId}</p>
                  <p>Email: {userEmail}</p>
                </div>
              )}
              <Button onClick={() => router.push("/dashboard")} className="mt-4">
                Aller au tableau de bord
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
