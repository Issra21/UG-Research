"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Vérifier si l'utilisateur vient de s'inscrire
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage("Inscription réussie! Vous pouvez maintenant vous connecter.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Connexion avec Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Rediriger vers le tableau de bord
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Une erreur s'est produite lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-center">Connexion</h1>
        </div>

        {successMessage && <div className="bg-green-50 text-green-600 p-3 rounded-md">{successMessage}</div>}

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Pas encore de compte? S'inscrire
          </Link>
        </div>
      </div>
    </div>
  )
}
