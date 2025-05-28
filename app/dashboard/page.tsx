"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        // Rediriger vers la page de connexion si non connecté
        router.push("/login")
        return
      }

      setUser(data.session.user)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Déconnexion
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Informations utilisateur</h2>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>ID:</strong> {user?.id}
          </p>
        </div>

        <div className="space-y-4">
          <p>Bienvenue sur votre tableau de bord!</p>
          <p>Cette page n'est accessible qu'aux utilisateurs connectés.</p>
        </div>
      </div>
    </div>
  )
}
