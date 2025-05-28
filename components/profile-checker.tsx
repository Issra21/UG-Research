"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ProfileChecker() {
  const { user, profile, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user && !profile) {
      checkProfile()
    }
  }, [user, profile])

  const checkProfile = async () => {
    if (!user) return

    setChecking(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/check-profile")
      const data = await response.json()

      if (response.ok) {
        if (data.created) {
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
            "Votre profil n'est pas complètement chargé"
          )}
        </span>
        <Button onClick={checkProfile} disabled={checking} size="sm" variant="outline">
          {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {checking ? "Vérification..." : "Vérifier le profil"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
