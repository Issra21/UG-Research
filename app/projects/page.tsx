"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Search, Filter, Plus, Calendar, Users, DollarSign, Clock, Target } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { getCurrentProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { ResearchProject, Profile } from "@/lib/types"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ResearchProject[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  const statusOptions = [
    { value: "active", label: "Actif", color: "bg-green-500" },
    { value: "planned", label: "Planifié", color: "bg-blue-500" },
    { value: "completed", label: "Terminé", color: "bg-gray-500" },
    { value: "suspended", label: "Suspendu", color: "bg-red-500" },
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedStatus])

  const loadData = async () => {
    try {
      const currentProfile = await getCurrentProfile()
      setProfile(currentProfile)

      if (currentProfile) {
        const { data, error } = await supabase
          .from("research_projects")
          .select(`
            *,
            principal_investigator:profiles(first_name, last_name, title),
            collaborators:project_collaborators(
              id,
              role,
              contribution_percentage,
              collaborator:profiles(first_name, last_name)
            )
          `)
          .eq("principal_investigator_id", currentProfile.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setProjects(data || [])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter((project) => project.status === selectedStatus)
    }

    setFilteredProjects(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedStatus("")
  }

  const getProjectProgress = (project: ResearchProject) => {
    if (!project.start_date || !project.end_date) return 0

    const start = new Date(project.start_date).getTime()
    const end = new Date(project.end_date).getTime()
    const now = new Date().getTime()

    if (now < start) return 0
    if (now > end) return 100

    return Math.round(((now - start) / (end - start)) * 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
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
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded"></div>
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Projets de Recherche</h1>
                <p className="text-gray-600">Gérez et suivez vos projets de recherche</p>
              </div>
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau projet
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            {projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">Projets</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actifs</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {projects.filter((p) => p.status === "active").length}
                    </div>
                    <p className="text-xs text-muted-foreground">En cours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Terminés</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-600">
                      {projects.filter((p) => p.status === "completed").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Complétés</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                    </div>
                    <p className="text-xs text-muted-foreground">Financement</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            {projects.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Recherche et filtres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Rechercher par titre, description, mots-clés..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut du projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">{filteredProjects.length} projet(s) trouvé(s)</p>
                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Effacer les filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects List */}
            {filteredProjects.length > 0 ? (
              <div className="space-y-6">
                {filteredProjects.map((project) => {
                  const progress = getProjectProgress(project)
                  const statusOption = statusOptions.find((s) => s.value === project.status)

                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-xl">{project.title}</CardTitle>
                              <Badge variant="secondary" className={`text-white ${statusOption?.color}`}>
                                {statusOption?.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                              {project.start_date && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>Début: {new Date(project.start_date).toLocaleDateString("fr-FR")}</span>
                                </div>
                              )}
                              {project.end_date && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>Fin: {new Date(project.end_date).toLocaleDateString("fr-FR")}</span>
                                </div>
                              )}
                              {project.budget && (
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span>Budget: {formatCurrency(project.budget)}</span>
                                </div>
                              )}
                            </div>

                            {project.funding_source && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Source de financement:</strong> {project.funding_source}
                              </p>
                            )}

                            {project.collaborators && project.collaborators.length > 0 && (
                              <div className="flex items-center text-sm text-gray-600 mb-4">
                                <Users className="h-4 w-4 mr-2" />
                                <span>
                                  Collaborateurs:{" "}
                                  {project.collaborators
                                    .map((c) => `${c.collaborator?.first_name} ${c.collaborator?.last_name}`)
                                    .join(", ")}
                                </span>
                              </div>
                            )}

                            {project.status === "active" && project.start_date && project.end_date && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progression</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {project.description && (
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-medium text-sm mb-2">Description:</h4>
                            <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
                          </div>

                          {project.objectives && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm mb-2">Objectifs:</h4>
                              <p className="text-sm text-gray-700 line-clamp-2">{project.objectives}</p>
                            </div>
                          )}

                          {project.keywords && project.keywords.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-2">Mots-clés:</h4>
                              <div className="flex flex-wrap gap-1">
                                {project.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            ) : projects.length === 0 ? (
              // État vide - aucun projet
              <div className="text-center py-16">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Aucun projet de recherche</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Commencez à organiser vos activités de recherche en créant votre premier projet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/projects/new">
                    <Button size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Créer mon premier projet
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Target className="h-5 w-5 mr-2" />
                    Voir les appels à projets
                  </Button>
                </div>
              </div>
            ) : (
              // Aucun résultat de recherche
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
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
