"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")
  const verifiedParam = searchParams.get("verified")

  useEffect(() => {
    if (errorParam) {
      if (errorParam === "callback_error") {
        setError("Erreur lors de la confirmation de votre email. Veuillez réessayer ou contacter le support.")
      } else if (errorParam === "callback_exception") {
        setError("Une erreur technique s'est produite. Veuillez réessayer ultérieurement.")
      }
    }
  }, [errorParam])

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Tentative de connexion avec:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Erreur de connexion:", error.message)
        throw error
      }

      console.log("Connexion réussie:", data.user?.id)
      setSuccess(true)

      // Attendre un peu pour que la session soit bien établie
      setTimeout(async () => {
        try {
          // Vérifier si le profil existe et le créer si nécessaire
          await fetch("/api/ensure-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })

          // Rediriger vers le tableau de bord
          router.push("/dashboard")
        } catch (err) {
          console.error("Erreur lors de la vérification du profil:", err)
          router.push("/dashboard")
        }
      }, 1000)
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Veuillez confirmer votre email avant de vous connecter")
      } else {
        setError(error.message || "Erreur de connexion")
      }
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Connexion à UG-Research</h2>
          <p className="mt-2 text-sm text-gray-600">Accédez à votre espace chercheur</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            {verifiedParam === "true" && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <AlertDescription className="text-green-700">
                    Votre email a été confirmé avec succès ! Vous pouvez maintenant vous connecter.
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </Alert>
            )}

            {success ? (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 text-blue-600 mx-auto animate-spin" />
                <p className="mt-2 text-sm text-gray-600">Connexion réussie! Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
                  Créer un compte
                </Link>
              </p>
              <p className="mt-2 text-sm">
                <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
