"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, User } from "lucide-react"
import { getCurrentProfile } from "@/lib/auth"
import type { Profile } from "@/lib/types"

export default function AuthSuccessPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentProfile = await getCurrentProfile()
      setProfile(currentProfile)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            {profile && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-sm text-gray-600">{profile.email}</p>
                <p className="text-xs text-blue-600 mt-1">{profile.department}</p>
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
                Accéder à mon tableau de bord
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <div className="text-center">
                <Link href="/profile" className="text-sm text-blue-600 hover:text-blue-500">
                  Compléter mon profil maintenant
                </Link>
              </div>
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
