"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function EnsureProfile() {
  const { user, profile, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user && !profile) {
      ensureProfile()
    }
  }, [user, profile])

  const ensureProfile = async () => {
    if (!user) return

    setChecking(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/ensure-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        if (data.message === "Profil créé avec succès") {
          setSuccess("Profil créé avec succès")
        } else {
          setSuccess("Profil vérifié")
        }

        // Rafraîchir le profil dans le contexte d'authentification
        await refreshProfile()
      } else {
        setError(data.error || "Erreur lors de la vérification du profil")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setChecking(false)
    }
  }

  if (!user || profile) {
    return null
  }

  return (
    <Alert className="mb-6">
      <AlertDescription className="flex items-center justify-between">
        <span>
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : success ? (
            <span className="text-green-600">{success}</span>
          ) : (
            "Vérification de votre profil..."
          )}
        </span>
        <Button onClick={ensureProfile} disabled={checking} size="sm" variant="outline">
          {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {checking ? "Vérification..." : "Vérifier le profil"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
