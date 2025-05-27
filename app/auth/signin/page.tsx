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
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  useEffect(() => {
    // If user is already authenticated, redirect
    if (!authLoading && user) {
      console.log("User already authenticated, redirecting...")
      router.push(redirectTo)
    }
  }, [user, authLoading, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting to sign in with:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }

      if (data.user) {
        console.log("Sign in successful:", data.user.email)

        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          setError("Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.")
          setLoading(false)
          return
        }

        // The AuthProvider will handle the rest
        console.log("Redirecting to:", redirectTo)
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Veuillez confirmer votre email avant de vous connecter")
      } else if (error.message.includes("Too many requests")) {
        setError("Trop de tentatives de connexion. Veuillez patienter quelques minutes.")
      } else {
        setError(error.message || "Erreur de connexion")
      }
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification de l'authentification...</span>
        </div>
      </div>
    )
  }

  // If user is authenticated, don't show the form
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Redirection en cours...</span>
        </div>
      </div>
    )
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
              <p className="mt-2 text-sm">
                <Link href="/auth/resend-confirmation" className="text-blue-600 hover:text-blue-500">
                  Renvoyer l'email de confirmation
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
