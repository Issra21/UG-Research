"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import type { UserRole } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function CompleteProfilePage() {
  const { user, refreshProfile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "researcher" as UserRole,
    title: "",
    department: "",
    laboratory: "",
    phone: "",
    bio: "",
  })
  const router = useRouter()

  const departments = [
    "Faculté des Sciences de Gabès",
    "Institut Supérieur des Sciences Appliquées et de Technologie de Gabès",
    "Institut Supérieur d'Informatique et de Multimédia de Gabès",
    "École Nationale d'Ingénieurs de Gabès",
    "Institut Supérieur de Gestion de Gabès",
    "Institut Supérieur des Arts et Métiers de Gabès",
    "Institut Supérieur des Langues de Gabès",
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      console.log("Creating profile for user:", user.email)

      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email!,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          title: formData.title,
          department: formData.department,
          laboratory: formData.laboratory,
          phone: formData.phone,
          bio: formData.bio,
        },
      ])

      if (error) throw error

      console.log("Profile created successfully")

      // Refresh the profile in the auth context
      await refreshProfile()

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating profile:", error)
      setError(error.message || "Erreur lors de la création du profil")
    } finally {
      setLoading(false)
    }
  }

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">UG</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Complétez votre profil</h2>
          <p className="mt-2 text-sm text-gray-600">
            Quelques informations supplémentaires pour finaliser votre compte
          </p>
          <p className="text-xs text-gray-500 mt-1">Email: {user.email}</p>
          <p className="text-xs text-blue-600 mt-1">
            Ouvert à tous les chercheurs et étudiants intéressés par la recherche
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>Ces informations seront visibles sur votre profil public</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Statut</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="researcher">Enseignant-Chercheur</SelectItem>
                      <SelectItem value="student">Doctorant</SelectItem>
                      <SelectItem value="lab_director">Directeur de laboratoire</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre/Grade</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Professeur, Maître de conférences..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Département/Institut</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laboratory">Laboratoire de recherche</Label>
                  <Input
                    id="laboratory"
                    value={formData.laboratory}
                    onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    placeholder="Nom du laboratoire"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+216 XX XXX XXX"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie/Présentation</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Présentez brièvement vos domaines de recherche et intérêts..."
                  rows={4}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création du profil...
                  </>
                ) : (
                  "Finaliser mon profil"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
