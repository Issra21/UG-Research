"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Si pas d'erreur, rediriger vers la page de connexion après un court délai
    if (!error) {
      const timer = setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-blue-600">Confirmation d'email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {error ? (
            <>
              <p className="text-red-600">Un problème est survenu lors de la confirmation de votre email.</p>
              <div className="space-y-2">
                <Link href="/auth/signin">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                Votre email a été confirmé avec succès. Vous allez être redirigé vers la page de connexion...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
