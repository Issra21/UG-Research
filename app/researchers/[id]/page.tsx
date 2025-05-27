"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  ExternalLink,
  Users,
  BookOpen,
  Briefcase,
} from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { supabase } from "@/lib/supabase"
import type { Profile, Publication, ResearchProject } from "@/lib/types"
import Link from "next/link"

export default function ResearcherDetailPage() {
  const params = useParams()
  const [researcher, setResearcher] = useState<Profile | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadResearcherData(params.id as string)
    }
  }, [params.id])

  const loadResearcherData = async (id: string) => {
    try {
      // Load researcher profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      if (profileError) throw profileError
      setResearcher(profileData)

      // Load publications
      const { data: publicationsData } = await supabase
        .from("publications")
        .select("*")
        .eq("author_id", id)
        .order("publication_date", { ascending: false })
        .limit(5)

      setPublications(publicationsData || [])

      // Load projects
      const { data: projectsData } = await supabase
        .from("research_projects")
        .select("*")
        .eq("principal_investigator_id", id)
        .order("created_at", { ascending: false })
        .limit(3)

      setProjects(projectsData || [])
    } catch (error) {
      console.error("Error loading researcher data:", error)
    } finally {
      setLoading(false)
    }
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
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!researcher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chercheur non trouvé</h3>
              <Link href="/researchers">
                <Button>Retour à l'annuaire</Button>
              </Link>
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/researchers">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'annuaire
                </Button>
              </Link>
            </div>

            {/* Profile Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={researcher.avatar_url || "/placeholder.svg"} alt={researcher.first_name} />
                    <AvatarFallback className="text-2xl">
                      {researcher.first_name[0]}
                      {researcher.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {researcher.first_name} {researcher.last_name}
                    </h1>
                    {researcher.title && (
                      <p className="text-lg text-gray-600 mb-3 flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        {researcher.title}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{researcher.role}</Badge>
                      {researcher.department && <Badge variant="outline">{researcher.department}</Badge>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:text-blue-800">
                        <Mail className="h-5 w-5" />
                      </a>
                      {researcher.orcid_id && (
                        <a
                          href={`https://orcid.org/${researcher.orcid_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              {researcher.bio && (
                <CardContent>
                  <h3 className="font-medium mb-2">Biographie</h3>
                  <p className="text-gray-700">{researcher.bio}</p>
                </CardContent>
              )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Publications */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Publications récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {publications.length > 0 ? (
                      <div className="space-y-4">
                        {publications.map((publication) => (
                          <div key={publication.id} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium">{publication.title}</h4>
                            <p className="text-sm text-gray-600">
                              {publication.journal_name || publication.conference_name} • {publication.publication_date}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucune publication disponible</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {researcher.department && (
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{researcher.department}</span>
                      </div>
                    )}
                    {researcher.laboratory && (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{researcher.laboratory}</span>
                      </div>
                    )}
                    {researcher.office_location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{researcher.office_location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Research Interests */}
                {researcher.research_interests && researcher.research_interests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Domaines de recherche</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {researcher.research_interests.map((interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Projets récents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="space-y-3">
                        {projects.map((project) => (
                          <div key={project.id} className="p-3 border rounded">
                            <h4 className="font-medium text-sm">{project.title}</h4>
                            <Badge variant="outline" className="mt-1">
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun projet disponible</p>
                    )}
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
