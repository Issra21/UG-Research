"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Plus, ExternalLink, Calendar, Users, Eye, Download } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { getCurrentProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { Publication, Profile } from "@/lib/types"
import Link from "next/link"

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const publicationTypes = [
    { value: "article", label: "Article de journal" },
    { value: "conference", label: "Communication" },
    { value: "thesis", label: "Thèse" },
    { value: "book", label: "Livre" },
    { value: "chapter", label: "Chapitre de livre" },
    { value: "patent", label: "Brevet" },
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPublications()
  }, [publications, searchTerm, selectedType, selectedYear])

  const loadData = async () => {
    try {
      const currentProfile = await getCurrentProfile()
      setProfile(currentProfile)

      if (currentProfile) {
        const { data, error } = await supabase
          .from("publications")
          .select(`
            *,
            author:profiles(first_name, last_name, title)
          `)
          .eq("author_id", currentProfile.id)
          .order("publication_date", { ascending: false })

        if (error) throw error
        setPublications(data || [])
      }
    } catch (error) {
      console.error("Error loading publications:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPublications = () => {
    let filtered = publications

    if (searchTerm) {
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedType) {
      filtered = filtered.filter((pub) => pub.publication_type === selectedType)
    }

    if (selectedYear) {
      filtered = filtered.filter((pub) => pub.publication_date?.startsWith(selectedYear))
    }

    setFilteredPublications(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("")
    setSelectedYear("")
  }

  const getYears = () => {
    const years = publications
      .map((pub) => pub.publication_date?.split("-")[0])
      .filter((year) => year)
      .filter((year, index, self) => self.indexOf(year) === index)
      .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
    return years
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Publications</h1>
                <p className="text-gray-600">Gérez et organisez vos publications scientifiques</p>
              </div>
              <Link href="/publications/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle publication
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            {publications.length > 0 && (
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
                        placeholder="Rechercher par titre, résumé, mots-clés..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de publication" />
                      </SelectTrigger>
                      <SelectContent>
                        {publicationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {getYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">{filteredPublications.length} publication(s) trouvée(s)</p>
                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Effacer les filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Publications List */}
            {filteredPublications.length > 0 ? (
              <div className="space-y-6">
                {filteredPublications.map((publication) => (
                  <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{publication.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <Badge variant="secondary">
                              {publicationTypes.find((t) => t.value === publication.publication_type)?.label}
                            </Badge>
                            {publication.publication_date && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(publication.publication_date).getFullYear()}
                              </div>
                            )}
                            {publication.citation_count > 0 && (
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {publication.citation_count} citations
                              </div>
                            )}
                          </div>
                          {publication.journal_name && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Journal:</strong> {publication.journal_name}
                              {publication.volume && `, Vol. ${publication.volume}`}
                              {publication.issue && `, No. ${publication.issue}`}
                              {publication.pages && `, pp. ${publication.pages}`}
                            </p>
                          )}
                          {publication.conference_name && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Conférence:</strong> {publication.conference_name}
                            </p>
                          )}
                          {publication.co_authors && publication.co_authors.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Co-auteurs: {publication.co_authors.join(", ")}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {publication.doi && (
                            <a
                              href={`https://doi.org/${publication.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {publication.pdf_url && (
                            <a
                              href={publication.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {publication.abstract && (
                      <CardContent>
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Résumé:</h4>
                          <p className="text-sm text-gray-700 line-clamp-3">{publication.abstract}</p>
                        </div>
                        {publication.keywords && publication.keywords.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Mots-clés:</h4>
                            <div className="flex flex-wrap gap-1">
                              {publication.keywords.map((keyword, index) => (
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
                ))}
              </div>
            ) : publications.length === 0 ? (
              // État vide - aucune publication
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Aucune publication pour le moment</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Commencez à construire votre profil académique en ajoutant vos premières publications scientifiques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/publications/new">
                    <Button size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter ma première publication
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Importer depuis ORCID
                  </Button>
                </div>
              </div>
            ) : (
              // Aucun résultat de recherche
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune publication trouvée</h3>
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
