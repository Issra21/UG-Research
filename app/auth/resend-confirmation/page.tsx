"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Loader2, Mail } from "lucide-react"
import { getAuthCallbackURL } from "@/lib/supabase-config"

export default function ResendConfirmationPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthCallbackURL(),
        },
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi de l'email de confirmation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">UG</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Renvoyer l'email de confirmation</h2>
          <p className="mt-2 text-sm text-gray-600">
            Vous n'avez pas reçu l'email de confirmation ? Nous pouvons vous en envoyer un nouveau.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Renvoyer l'email</CardTitle>
            <CardDescription>Entrez votre adresse email pour recevoir un nouveau lien de confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Mail className="h-12 w-12 text-blue-600" />
                </div>
                <p className="text-green-600 font-medium">Email de confirmation envoyé !</p>
                <p className="text-gray-600">
                  Nous avons envoyé un nouvel email de confirmation à <strong>{email}</strong>. Veuillez vérifier votre
                  boîte de réception et cliquer sur le lien pour activer votre compte.
                </p>
                <p className="text-sm text-gray-500">
                  Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier de spam.
                </p>
                <Link href="/auth/signin">
                  <Button className="mt-4 w-full">Retour à la connexion</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le lien de confirmation"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-500">
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
