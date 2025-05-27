"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Briefcase, TrendingUp, Plus, MessageSquare, Eye, Loader2 } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import type { Publication, ResearchProject } from "@/lib/types"
import Link from "next/link"

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    publications: 0,
    projects: 0,
    collaborations: 0,
    citations: 0,
  })
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [activeProjects, setActiveProjects] = useState<ResearchProject[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/signin")
        return
      }

      if (!profile) {
        // Si pas de profil, c'est que le trigger n'a pas fonctionné, on reste sur le dashboard
        setLoading(false)
        return
      }

      loadDashboardData()
    }
  }, [user, profile, authLoading, router])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      const [publicationsRes, projectsRes] = await Promise.all([
        supabase
          .from("publications")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("research_projects")
          .select("*")
          .eq("principal_investigator_id", user.id)
          .eq("status", "active")
          .limit(3),
      ])

      if (publicationsRes.data) {
        setRecentPublications(publicationsRes.data)
        setStats((prev) => ({ ...prev, publications: publicationsRes.data.length }))
      }

      if (projectsRes.data) {
        setActiveProjects(projectsRes.data)
        setStats((prev) => ({ ...prev, projects: projectsRes.data.length }))
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement de votre tableau de bord...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour, {profile?.first_name || "Utilisateur"} {profile?.last_name || ""}
              </h1>
              <p className="text-gray-600">Bienvenue sur votre tableau de bord UG-Research</p>
              {profile && (
                <div className="mt-2">
                  <Badge variant="secondary">{profile.department || "Département non renseigné"}</Badge>
                  {profile.laboratory && (
                    <Badge variant="outline" className="ml-2">
                      {profile.laboratory}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publications</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publications}</div>
                  <p className="text-xs text-muted-foreground">Total publié</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.projects}</div>
                  <p className="text-xs text-muted-foreground">En cours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.collaborations}</div>
                  <p className="text-xs text-muted-foreground">Chercheurs connectés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.citations}</div>
                  <p className="text-xs text-muted-foreground">Impact total</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Publications récentes</CardTitle>
                      <CardDescription>Vos dernières publications scientifiques</CardDescription>
                    </div>
                    <Link href="/publications/new">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {recentPublications.length > 0 ? (
                      <div className="space-y-4">
                        {recentPublications.map((publication) => (
                          <div key={publication.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{publication.title}</h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Badge variant="secondary">{publication.publication_type}</Badge>
                                <span>{publication.publication_date}</span>
                                {publication.journal_name && <span>• {publication.journal_name}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Eye className="h-3 w-3" />
                              <span>{publication.citation_count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Aucune publication pour le moment</p>
                        <Link href="/publications/new">
                          <Button>Ajouter votre première publication</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/publications/new">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle publication
                      </Button>
                    </Link>
                    <Link href="/projects/new">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau projet
                      </Button>
                    </Link>
                    <Link href="/researchers">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Trouver des collaborateurs
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mon profil
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projets actifs</CardTitle>
                    <CardDescription>Vos projets de recherche en cours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeProjects.length > 0 ? (
                      <div className="space-y-3">
                        {activeProjects.map((project) => (
                          <div key={project.id} className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <Badge variant="outline">{project.status}</Badge>
                              <span>{project.start_date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-3">Aucun projet actif</p>
                        <Link href="/projects/new">
                          <Button size="sm">Créer un projet</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informations du compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      {profile && (
                        <>
                          <p>
                            <strong>Nom:</strong> {profile.first_name} {profile.last_name}
                          </p>
                          <p>
                            <strong>Rôle:</strong> {profile.role}
                          </p>
                          {profile.department && (
                            <p>
                              <strong>Département:</strong> {profile.department}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
