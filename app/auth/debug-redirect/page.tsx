"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DebugRedirectPage() {
  const [siteUrl, setSiteUrl] = useState<string>("")
  const [vercelUrl, setVercelUrl] = useState<string>("")
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [callbackUrl, setCallbackUrl] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin)

      // Construire l'URL de callback comme le ferait l'application
      const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || window.location.origin

      const baseUrl = url.includes("http") ? url : `https://${url}`
      const normalizedUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

      setCallbackUrl(`${normalizedUrl}auth/callback`)
      setSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "Non défini")
      setVercelUrl(process.env.NEXT_PUBLIC_VERCEL_URL || "Non défini")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Débogage des redirections</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informations sur les URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>URL actuelle:</strong> {currentUrl}
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription>
                  <strong>URL de callback calculée:</strong> {callbackUrl}
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription>
                  <strong>NEXT_PUBLIC_SITE_URL:</strong> {siteUrl}
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription>
                  <strong>NEXT_PUBLIC_VERCEL_URL:</strong> {vercelUrl}
                </AlertDescription>
              </Alert>

              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Pour tester la redirection, cliquez sur le bouton ci-dessous:
                </p>
                <Button onClick={() => (window.location.href = "/auth/callback?code=test_code")}>
                  Tester la redirection de callback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
