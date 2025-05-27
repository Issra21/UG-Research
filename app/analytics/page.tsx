"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, BookOpen, Briefcase, Award } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPublications: 0,
    totalProjects: 0,
    totalCitations: 0,
    hIndex: 0,
    collaborators: 0,
    recentViews: 0,
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    if (!user) return

    try {
      // Load publications count
      const { count: publicationsCount } = await supabase
        .from("publications")
        .select("*", { count: "exact", head: true })
        .eq("author_id", user.id)

      // Load projects count
      const { count: projectsCount } = await supabase
        .from("research_projects")
        .select("*", { count: "exact", head: true })
        .eq("principal_investigator_id", user.id)

      // Load publications for citation analysis
      const { data: publications } = await supabase
        .from("publications")
        .select("citation_count")
        .eq("author_id", user.id)

      const totalCitations = publications?.reduce((sum, pub) => sum + (pub.citation_count || 0), 0) || 0

      setStats({
        totalPublications: publicationsCount || 0,
        totalProjects: projectsCount || 0,
        totalCitations,
        hIndex: calculateHIndex(publications || []),
        collaborators: 0, // Would need to calculate from collaborations
        recentViews: 0, // Would need view tracking
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateHIndex = (publications: { citation_count: number }[]) => {
    const citations = publications.map((p) => p.citation_count || 0).sort((a, b) => b - a)

    let hIndex = 0
    for (let i = 0; i < citations.length; i++) {
      if (citations[i] >= i + 1) {
        hIndex = i + 1
      } else {
        break
      }
    }
    return hIndex
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques et Analytics</h1>
              <p className="text-gray-600">Analysez votre activité de recherche et votre impact scientifique</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publications</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPublications}</div>
                  <p className="text-xs text-muted-foreground">Total publié</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projets</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">En cours et terminés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCitations}</div>
                  <p className="text-xs text-muted-foreground">Impact total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">H-Index</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.hIndex}</div>
                  <p className="text-xs text-muted-foreground">Indice de productivité</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Publication Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendances de publication</CardTitle>
                  <CardDescription>Évolution de vos publications par année</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2024</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-24" />
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2023</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={100} className="w-24" />
                        <span className="text-sm font-medium">4</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2022</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={50} className="w-24" />
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaboration Network */}
              <Card>
                <CardHeader>
                  <CardTitle>Réseau de collaboration</CardTitle>
                  <CardDescription>Vos principaux collaborateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">Collaborateurs directs</span>
                      </div>
                      <Badge variant="secondary">{stats.collaborators}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm">Projets collaboratifs</span>
                      </div>
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm">Co-publications</span>
                      </div>
                      <Badge variant="secondary">0</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques d'impact</CardTitle>
                  <CardDescription>Analyse de l'impact de vos travaux</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Citations par publication</span>
                      <span className="text-sm font-medium">
                        {stats.totalPublications > 0 ? (stats.totalCitations / stats.totalPublications).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Publications avec citations</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Publication la plus citée</span>
                      <span className="text-sm font-medium">0 citations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Profil mis à jour</span>
                      <span className="text-xs text-gray-500 ml-auto">Il y a 2 jours</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Compte créé</span>
                      <span className="text-xs text-gray-500 ml-auto">Il y a 1 semaine</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
