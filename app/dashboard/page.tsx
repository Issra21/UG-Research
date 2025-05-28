"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Mail, Building, GraduationCap } from "lucide-react"

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Le useEffect va rediriger
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UG</span>
              </div>
              <span className="text-xl font-bold text-gray-900">UG-Research</span>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue sur votre espace chercheur</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations utilisateur */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations du compte</span>
                </CardTitle>
                <CardDescription>Détails de votre compte utilisateur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                  <Badge variant="outline" className="text-green-600">
                    Vérifié
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">ID utilisateur:</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>

                {profile && (
                  <>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Nom complet:</span>
                      <span>
                        {profile.first_name} {profile.last_name}
                      </span>
                    </div>

                    {profile.role && (
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Statut:</span>
                        <Badge variant="secondary">{profile.role}</Badge>
                      </div>
                    )}

                    {profile.department && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Département:</span>
                        <span>{profile.department}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accès rapide aux fonctionnalités</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Modifier mon profil
                </Button>
                <Button className="w-full" variant="outline">
                  Mes publications
                </Button>
                <Button className="w-full" variant="outline">
                  Mes projets
                </Button>
                <Button className="w-full" variant="outline">
                  Rechercher des collaborateurs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statut du profil */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>État du profil</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="text-green-600">✅ Votre profil est configuré et actif</div>
              ) : (
                <div className="text-orange-600">⚠️ Votre profil n'est pas encore complètement configuré</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
