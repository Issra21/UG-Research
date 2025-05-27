"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Mail, MapPin, Building, GraduationCap, ExternalLink, Users } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import Link from "next/link"

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Profile[]>([])
  const [filteredResearchers, setFilteredResearchers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  const departments = [
    "Faculté des Sciences de Gabès",
    "Institut Supérieur des Sciences Appliquées et de Technologie de Gabès",
    "Institut Supérieur d'Informatique et de Multimédia de Gabès",
    "École Nationale d'Ingénieurs de Gabès",
    "Institut Supérieur de Gestion de Gabès",
    "Institut Supérieur des Arts et Métiers de Gabès",
    "Institut Supérieur des Langues de Gabès",
  ]

  const roles = [
    { value: "researcher", label: "Enseignant-Chercheur" },
    { value: "student", label: "Doctorant" },
    { value: "lab_director", label: "Directeur de laboratoire" },
    { value: "admin", label: "Administrateur" },
  ]

  useEffect(() => {
    loadResearchers()
  }, [])

  useEffect(() => {
    filterResearchers()
  }, [researchers, searchTerm, selectedDepartment, selectedRole])

  const loadResearchers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_active", true)
        .order("last_name", { ascending: true })

      if (error) throw error
      setResearchers(data || [])
    } catch (error) {
      console.error("Error loading researchers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterResearchers = () => {
    let filtered = researchers

    if (searchTerm) {
      filtered = filtered.filter(
        (researcher) =>
          researcher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.research_interests?.some((interest) => interest.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedDepartment) {
      filtered = filtered.filter((researcher) => researcher.department === selectedDepartment)
    }

    if (selectedRole) {
      filtered = filtered.filter((researcher) => researcher.role === selectedRole)
    }

    setFilteredResearchers(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartment("")
    setSelectedRole("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Annuaire des chercheurs</h1>
              <p className="text-gray-600">Découvrez et connectez-vous avec les chercheurs de l'Université de Gabès</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Rechercher par nom, domaine de recherche..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">{filteredResearchers.length} chercheur(s) trouvé(s)</p>
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Effacer les filtres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Researchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResearchers.map((researcher) => (
                <Card key={researcher.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={researcher.avatar_url || "/placeholder.svg"} alt={researcher.first_name} />
                        <AvatarFallback>
                          {researcher.first_name[0]}
                          {researcher.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {researcher.first_name} {researcher.last_name}
                        </h3>
                        {researcher.title && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {researcher.title}
                          </p>
                        )}
                        <Badge variant="secondary" className="mt-2">
                          {roles.find((r) => r.value === researcher.role)?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {researcher.department && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{researcher.department}</span>
                      </div>
                    )}

                    {researcher.laboratory && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{researcher.laboratory}</span>
                      </div>
                    )}

                    {researcher.office_location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{researcher.office_location}</span>
                      </div>
                    )}

                    {researcher.bio && <p className="text-sm text-gray-700 line-clamp-3">{researcher.bio}</p>}

                    {researcher.research_interests && researcher.research_interests.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Domaines de recherche:</p>
                        <div className="flex flex-wrap gap-1">
                          {researcher.research_interests.slice(0, 3).map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {researcher.research_interests.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{researcher.research_interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        {researcher.orcid_id && (
                          <a
                            href={`https://orcid.org/${researcher.orcid_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:text-blue-800">
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                      <Link href={`/researchers/${researcher.id}`}>
                        <Button size="sm" variant="outline">
                          Voir le profil
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResearchers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chercheur trouvé</h3>
                <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
