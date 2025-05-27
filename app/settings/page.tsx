"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Shield, Bell, User, Save, Trash2 } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [settings, setSettings] = useState({
    email_notifications: true,
    collaboration_requests: true,
    publication_alerts: true,
    project_updates: true,
    profile_visibility: true,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Load user settings from database or use defaults
    setSettings({
      email_notifications: true,
      collaboration_requests: true,
      publication_alerts: true,
      project_updates: true,
      profile_visibility: true,
    })
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Save settings to database
      setMessage("Paramètres sauvegardés avec succès !")
    } catch (error: any) {
      setMessage("Erreur lors de la sauvegarde : " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.updateUser({
        password: "new_password", // This would come from a form
      })

      if (error) throw error
      setMessage("Mot de passe mis à jour avec succès !")
    } catch (error: any) {
      setMessage("Erreur lors de la mise à jour : " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
              <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
            </div>

            {message && (
              <Alert className={`mb-6 ${message.includes("succès") ? "border-green-200 bg-green-50" : ""}`}>
                <AlertDescription className={message.includes("succès") ? "text-green-800" : ""}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Confidentialité
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Compte
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notification</CardTitle>
                    <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications par email</Label>
                        <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Demandes de collaboration</Label>
                        <p className="text-sm text-gray-500">Notifications pour les nouvelles demandes</p>
                      </div>
                      <Switch
                        checked={settings.collaboration_requests}
                        onCheckedChange={(checked) => setSettings({ ...settings, collaboration_requests: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertes de publication</Label>
                        <p className="text-sm text-gray-500">Notifications pour les nouvelles publications</p>
                      </div>
                      <Switch
                        checked={settings.publication_alerts}
                        onCheckedChange={(checked) => setSettings({ ...settings, publication_alerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mises à jour de projets</Label>
                        <p className="text-sm text-gray-500">Notifications pour les projets collaboratifs</p>
                      </div>
                      <Switch
                        checked={settings.project_updates}
                        onCheckedChange={(checked) => setSettings({ ...settings, project_updates: checked })}
                      />
                    </div>

                    <Button onClick={handleSaveSettings} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de confidentialité</CardTitle>
                    <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Profil public</Label>
                        <p className="text-sm text-gray-500">Votre profil est visible dans l'annuaire</p>
                      </div>
                      <Switch
                        checked={settings.profile_visibility}
                        onCheckedChange={(checked) => setSettings({ ...settings, profile_visibility: checked })}
                      />
                    </div>

                    <Button onClick={handleSaveSettings} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations du compte</CardTitle>
                      <CardDescription>Gérez vos informations de connexion</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input value={`${profile?.first_name || ""} ${profile?.last_name || ""}`} disabled />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Zone de danger</CardTitle>
                      <CardDescription>Actions irréversibles sur votre compte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer mon compte
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
