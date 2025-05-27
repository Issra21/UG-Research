"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Mail } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorMessage = () => {
    if (error === "access_denied") {
      return "L'accès a été refusé. Veuillez vérifier votre lien de confirmation."
    }
    if (errorDescription) {
      return errorDescription
    }
    return "Une erreur s'est produite lors de la confirmation de votre email."
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Erreur de confirmation</h2>
          <p className="mt-2 text-sm text-gray-600">Un problème est survenu lors de la vérification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Confirmation échouée</CardTitle>
            <CardDescription>Nous n'avons pas pu confirmer votre adresse email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage()}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Causes possibles :</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Le lien de confirmation a expiré</li>
                  <li>Le lien a déjà été utilisé</li>
                  <li>Le lien est invalide ou corrompu</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>

                <Link href="/auth/resend-confirmation">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Renvoyer l'email de confirmation
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Besoin d'aide ?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-500">
              Contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
