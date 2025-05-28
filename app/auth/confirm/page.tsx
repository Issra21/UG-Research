"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data.session) {
          setSuccess(true)
        } else {
          setError("Aucune session trouvée. Veuillez vous connecter.")
        }
      } catch (error: any) {
        setError(error.message || "Une erreur s'est produite lors de la vérification de votre session.")
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg">Vérification de votre compte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className={success ? "text-green-600" : "text-red-600"}>
            {success ? "Compte confirmé avec succès !" : "Problème de confirmation"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {success ? (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-gray-700">
                Votre compte a été confirmé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de
                la plateforme.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/dashboard")} className="w-full">
                  Accéder à mon tableau de bord
                </Button>
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    Compléter mon profil
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-red-600">{error}</p>
              <div className="space-y-2">
                <Link href="/auth/signin">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Retour à l&apos;accueil
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
