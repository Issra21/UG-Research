"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function DebugAuthPage() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Vérifier la session
        const { data: sessionData } = await supabase.auth.getSession()
        setSession(sessionData.session)

        if (sessionData.session?.user) {
          setUser(sessionData.session.user)

          // Vérifier le profil
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single()

          if (!error) {
            setProfile(profileData)
          } else {
            console.error("Erreur lors de la récupération du profil:", error)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleCreateProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          role: user.user_metadata?.role || "researcher",
          is_active: true,
        })
        .select()

      if (error) {
        console.error("Erreur lors de la création du profil:", error)
      } else {
        setProfile(data[0])
        alert("Profil créé avec succès!")
      }
    } catch (error) {
      console.error("Exception lors de la création du profil:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/signin"
  }

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Débogage de l'authentification</h1>

        <Card>
          <CardHeader>
            <CardTitle>État de l'authentification</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Session:</h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {session ? <pre>{JSON.stringify(session, null, 2)}</pre> : <p>Aucune session active</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Utilisateur:</h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>Aucun utilisateur connecté</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Profil:</h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {profile ? <pre>{JSON.stringify(profile, null, 2)}</pre> : <p>Aucun profil trouvé</p>}
                  </div>
                </div>

                <div className="flex space-x-4">
                  {user && !profile && <Button onClick={handleCreateProfile}>Créer un profil manuellement</Button>}

                  {user && (
                    <Button onClick={handleGoToDashboard} variant="outline">
                      Aller au tableau de bord
                    </Button>
                  )}

                  {user && (
                    <Button onClick={handleSignOut} variant="destructive">
                      Se déconnecter
                    </Button>
                  )}

                  {!user && <Button onClick={() => (window.location.href = "/auth/signin")}>Se connecter</Button>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
