"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export default function TestConfirmationPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleTestSignup = async () => {
    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: "test123456",
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (error) throw error

      setMessage(`Email de test envoyé à ${email}. Vérifiez votre boîte de réception.`)
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Test de confirmation email</CardTitle>
          <CardDescription>Testez le processus de confirmation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email de test</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <Button onClick={handleTestSignup} disabled={loading} className="w-full">
            {loading ? "Envoi..." : "Envoyer email de test"}
          </Button>

          <div className="text-xs text-gray-500">
            <p>URL de confirmation actuelle:</p>
            <code className="bg-gray-100 p-1 rounded">
              {typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : ""}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
