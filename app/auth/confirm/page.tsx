"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (!token_hash || !type) {
        setError("Lien de confirmation invalide")
        setLoading(false)
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash,
        })

        if (error) {
          setError(error.message)
        } else {
          setSuccess(true)
          setTimeout(() => {
            router.push("/auth/success")
          }, 2000)
        }
      } catch (err: any) {
        setError(err.message || "Erreur de confirmation")
      } finally {
        setLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <CardTitle>Confirmation en cours...</CardTitle>
            <CardDescription>Vérification de votre email</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-600" />
            <CardTitle className="text-green-600">Email confirmé !</CardTitle>
            <CardDescription>Redirection en cours...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/success">
              <Button>Continuer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <CardTitle className="text-red-600">Erreur de confirmation</CardTitle>
          <CardDescription>Impossible de confirmer votre email</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">{error}</p>
          <div className="space-y-2">
            <Link href="/auth/resend-confirmation">
              <Button className="w-full">Renvoyer l'email</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
