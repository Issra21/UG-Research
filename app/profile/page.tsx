"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, MapPin, Building, GraduationCap, Edit, Save, X, Plus, ExternalLink } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    department: "",
    laboratory: "",
    phone: "",
    office_location: "",
    bio: "",
    research_interests: [] as string[],
    orcid_id: "",
    google_scholar_id: "",
  })
  const [newInterest, setNewInterest] = useState("")

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
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.title || "",
        department: profile.department || "",
        laboratory: profile.laboratory || "",
        phone: profile.phone || "",
        office_location: profile.office_location || "",
        bio: profile.bio || "",
        research_interests: profile.research_interests || [],
        orcid_id: profile.orcid_id || "",
        google_scholar_id: profile.google_scholar_id || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      await refreshProfile()
      setIsEditing(false)
      setMessage("Profil mis à jour avec succès")
    } catch (error: any) {
      setMessage("Erreur lors de la mise à jour: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const addResearchInterest = () => {
    if (newInterest.trim() && !formData.research_interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        research_interests: [...formData.research_interests, newInterest.trim()],
      })
      setNewInterest("")
    }
  }

  const removeResearchInterest = (interest: string) => {
    setFormData({
      ...formData,
      research_interests: formData.research_interests.filter((i) => i !== interest),
    })
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center py-12">
              <p>Chargement du profil...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </div>

            {message && (
              <Alert className="mb-6">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="research">Recherche</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Gérez vos informations de profil public</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.first_name} />
                        <AvatarFallback className="text-lg">
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">Photo de profil</h3>
                        <p className="text-sm text-gray-500">Ajoutez une photo pour personnaliser votre profil</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Changer la photo
                        </Button>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{profile?.first_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{profile?.last_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Titre/Grade</Label>
                        {isEditing ? (
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Professeur, Maître de conférences..."
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span>{profile?.title || "Non renseigné"}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Statut</Label>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{profile?.role}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Département/Institut</Label>
                      {isEditing ? (
                        <Select
                          value={formData.department}
                          onValueChange={(value) => setFormData({ ...formData, department: value })}
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
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{profile?.department || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="laboratory">Laboratoire de recherche</Label>
                      {isEditing ? (
                        <Input
                          id="laboratory"
                          value={formData.laboratory}
                          onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                          placeholder="Nom du laboratoire"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{profile?.laboratory || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Présentez brièvement vos domaines de recherche et intérêts..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {profile?.bio || "Aucune biographie renseignée"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="research">
                <Card>
                  <CardHeader>
                    <CardTitle>Domaines de recherche</CardTitle>
                    <CardDescription>Gérez vos domaines d'expertise et identifiants de recherche</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Research Interests */}
                    <div className="space-y-4">
                      <Label>Domaines d'intérêt</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.research_interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {interest}
                            {isEditing && (
                              <button
                                onClick={() => removeResearchInterest(interest)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Ajouter un domaine d'intérêt"
                            onKeyPress={(e) => e.key === "Enter" && addResearchInterest()}
                          />
                          <Button onClick={addResearchInterest} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Research IDs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="orcid">ORCID ID</Label>
                        {isEditing ? (
                          <Input
                            id="orcid"
                            value={formData.orcid_id}
                            onChange={(e) => setFormData({ ...formData, orcid_id: e.target.value })}
                            placeholder="0000-0000-0000-0000"
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                            {profile?.orcid_id ? (
                              <a
                                href={`https://orcid.org/${profile.orcid_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {profile.orcid_id}
                              </a>
                            ) : (
                              <span className="text-gray-500">Non renseigné</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scholar">Google Scholar ID</Label>
                        {isEditing ? (
                          <Input
                            id="scholar"
                            value={formData.google_scholar_id}
                            onChange={(e) => setFormData({ ...formData, google_scholar_id: e.target.value })}
                            placeholder="ID Google Scholar"
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                            {profile?.google_scholar_id ? (
                              <a
                                href={`https://scholar.google.com/citations?user=${profile.google_scholar_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {profile.google_scholar_id}
                              </a>
                            ) : (
                              <span className="text-gray-500">Non renseigné</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de contact</CardTitle>
                    <CardDescription>Gérez vos informations de contact professionnelles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{profile?.email}</span>
                        <Badge variant="outline">Vérifié</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+216 XX XXX XXX"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{profile?.phone || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="office">Bureau</Label>
                      {isEditing ? (
                        <Input
                          id="office"
                          value={formData.office_location}
                          onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                          placeholder="Numéro de bureau"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{profile?.office_location || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
