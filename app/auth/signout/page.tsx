"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut()

      // Redirection après un court délai
      setTimeout(() => {
        router.push("/")
      }, 1000)
    }

    signOut()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-lg">Déconnexion en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Vous allez être redirigé vers la page d'accueil.</p>
        </CardContent>
      </Card>
    </div>
  )
}
