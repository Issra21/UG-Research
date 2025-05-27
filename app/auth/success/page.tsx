"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, User, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function AuthSuccessPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to load
    if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  const handleContinue = () => {
    if (profile) {
      router.push("/dashboard")
    } else {
      router.push("/auth/complete-profile")
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification de votre compte...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Bienvenue sur UG-Research !</h2>
          <p className="mt-2 text-sm text-gray-600">Votre compte a été confirmé avec succès</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Confirmation réussie</CardTitle>
            <CardDescription>Votre adresse email a été vérifiée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-blue-600 mt-1">Compte vérifié</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Prochaines étapes :</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Complétez votre profil de chercheur</li>
                  <li>Ajoutez vos publications scientifiques</li>
                  <li>Créez vos premiers projets de recherche</li>
                  <li>Explorez la communauté de chercheurs</li>
                </ul>
              </div>

              <Button onClick={handleContinue} className="w-full">
                {profile ? "Accéder à mon tableau de bord" : "Compléter mon profil"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {!profile && (
                <div className="text-center">
                  <Link href="/auth/complete-profile" className="text-sm text-blue-600 hover:text-blue-500">
                    Compléter mon profil maintenant
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Vous pouvez maintenant profiter de toutes les fonctionnalités de la plateforme UG-Research
          </p>
        </div>
      </div>
    </div>
  )
}
