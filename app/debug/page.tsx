"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSessionInfo(data.session)
    }

    checkSession()
  }, [])

  const fetchProfileDirectly = async () => {
    if (!user) return

    setLoadingData(true)
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error)
      } else {
        setProfileData(data)
      }
    } catch (error) {
      console.error("Exception lors de la récupération du profil:", error)
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Page de débogage</h1>

        <Card>
          <CardHeader>
            <CardTitle>État de l'authentification</CardTitle>
            <CardDescription>Informations sur l'état actuel de l'authentification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Chargement: {loading ? "Oui" : "Non"}</h3>
              </div>

              <div>
                <h3 className="font-semibold">Utilisateur:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto mt-2">
                  {user ? JSON.stringify(user, null, 2) : "Non connecté"}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Session:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto mt-2">
                  {sessionInfo ? JSON.stringify(sessionInfo, null, 2) : "Aucune session"}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Profil (via AuthProvider):</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto mt-2">
                  {profile ? JSON.stringify(profile, null, 2) : "Aucun profil"}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Profil (requête directe):</h3>
                <div className="flex space-x-2 mb-2">
                  <Button onClick={fetchProfileDirectly} disabled={loadingData || !user}>
                    {loadingData ? "Chargement..." : "Charger le profil directement"}
                  </Button>
                  <Button onClick={refreshProfile} variant="outline">
                    Rafraîchir le profil
                  </Button>
                </div>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {profileData ? JSON.stringify(profileData, null, 2) : "Non chargé"}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button onClick={() => (window.location.href = "/dashboard")}>Aller au tableau de bord</Button>
          <Button onClick={() => (window.location.href = "/auth/signin")} variant="outline">
            Aller à la page de connexion
          </Button>
        </div>
      </div>
    </div>
  )
}
