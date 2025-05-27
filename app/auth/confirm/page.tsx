"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasError = searchParams.get("error") === "true"

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Si on a un paramètre d'erreur, afficher l'erreur
        if (hasError) {
          setError("La confirmation de votre email a échoué. Veuillez réessayer.")
          setLoading(false)
          return
        }

        // Vérifier la session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data.session) {
          setSuccess(true)
          // Rediriger vers le tableau de bord après un court délai
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
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
  }, [router, hasError])

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
          {success ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-green-600">Compte confirmé avec succès !</CardTitle>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-red-600">Problème de confirmation</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {success ? (
            <>
              <p className="text-gray-700">
                Votre compte a été confirmé avec succès. Redirection vers votre tableau de bord...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            </>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
