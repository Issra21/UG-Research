"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Vérifier la session
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          router.push("/auth/signin")
          return
        }

        setUser(sessionData.session.user)

        // Vérifier le profil
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single()

        if (!error) {
          setProfile(profileData)
        } else if (error.code === "PGRST116") {
          // Profil non trouvé, essayer de le créer
          await createProfile(sessionData.session.user)
        } else {
          console.error("Erreur lors de la récupération du profil:", error)
          setError("Erreur lors du chargement de votre profil")
        }
      } catch (error: any) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        setError(error.message || "Une erreur s'est produite")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const createProfile = async (user: any) => {
    try {
      const response = await fetch("/api/create-profile", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
      } else {
        setError("Erreur lors de la création de votre profil")
      }
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error)
      setError("Erreur lors de la création de votre profil")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Réessayer
              </Button>
              <Link href="/debug-auth">
                <Button variant="outline" className="flex-1">
                  Déboguer l'authentification
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Non connecté</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Vous devez être connecté pour accéder à cette page.</p>
            <Button onClick={() => router.push("/auth/signin")} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                <strong>Bienvenue, {profile?.first_name || user.email?.split("@")[0] || "Utilisateur"} !</strong>
              </p>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Informations de l'utilisateur :</h3>
                <p>
                  <strong>Email :</strong> {user.email}
                </p>
                {profile && (
                  <>
                    <p>
                      <strong>Nom :</strong> {profile.first_name} {profile.last_name}
                    </p>
                    <p>
                      <strong>Rôle :</strong> {profile.role}
                    </p>
                    {profile.department && (
                      <p>
                        <strong>Département :</strong> {profile.department}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex space-x-4">
                <Link href="/profile">
                  <Button>{profile ? "Modifier mon profil" : "Compléter mon profil"}</Button>
                </Link>

                <Link href="/debug-auth">
                  <Button variant="outline">Déboguer l'authentification</Button>
                </Link>

                <Button
                  variant="destructive"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push("/auth/signin")
                  }}
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
