"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save, Loader2 } from "lucide-react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import type { PublicationType } from "@/lib/types"
import Link from "next/link"

export default function NewPublicationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    publication_type: "article" as PublicationType,
    journal_name: "",
    conference_name: "",
    publication_date: "",
    doi: "",
    isbn: "",
    pages: "",
    volume: "",
    issue: "",
    publisher: "",
    keywords: [] as string[],
    co_authors: [] as string[],
    pdf_url: "",
    external_url: "",
    citation_count: 0,
    is_published: true,
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [newCoAuthor, setNewCoAuthor] = useState("")

  const publicationTypes = [
    { value: "article", label: "Article de journal" },
    { value: "conference", label: "Communication de conférence" },
    { value: "thesis", label: "Thèse" },
    { value: "book", label: "Livre" },
    { value: "chapter", label: "Chapitre de livre" },
    { value: "patent", label: "Brevet" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.from("publications").insert([
        {
          ...formData,
          author_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setMessage("Publication ajoutée avec succès !")
      setTimeout(() => {
        router.push("/publications")
      }, 1500)
    } catch (error: any) {
      setMessage("Erreur lors de l'ajout : " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()],
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    })
  }

  const addCoAuthor = () => {
    if (newCoAuthor.trim() && !formData.co_authors.includes(newCoAuthor.trim())) {
      setFormData({
        ...formData,
        co_authors: [...formData.co_authors, newCoAuthor.trim()],
      })
      setNewCoAuthor("")
    }
  }

  const removeCoAuthor = (author: string) => {
    setFormData({
      ...formData,
      co_authors: formData.co_authors.filter((a) => a !== author),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/publications">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux publications
                </Button>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle publication</h1>
              <p className="text-gray-600">Ajoutez une nouvelle publication scientifique à votre profil</p>
            </div>

            {message && (
              <Alert className={`mb-6 ${message.includes("succès") ? "border-green-200 bg-green-50" : ""}`}>
                <AlertDescription className={message.includes("succès") ? "text-green-800" : ""}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>Détails principaux de la publication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de la publication"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abstract">Résumé</Label>
                    <Textarea
                      id="abstract"
                      value={formData.abstract}
                      onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                      placeholder="Résumé de la publication..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de publication *</Label>
                      <Select
                        value={formData.publication_type}
                        onValueChange={(value: PublicationType) =>
                          setFormData({ ...formData, publication_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {publicationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date de publication</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.publication_date}
                        onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Détails de publication */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails de publication</CardTitle>
                  <CardDescription>Informations spécifiques selon le type de publication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(formData.publication_type === "article" || formData.publication_type === "chapter") && (
                    <div className="space-y-2">
                      <Label htmlFor="journal">Nom du journal/livre</Label>
                      <Input
                        id="journal"
                        value={formData.journal_name}
                        onChange={(e) => setFormData({ ...formData, journal_name: e.target.value })}
                        placeholder="Nom du journal ou du livre"
                      />
                    </div>
                  )}

                  {formData.publication_type === "conference" && (
                    <div className="space-y-2">
                      <Label htmlFor="conference">Nom de la conférence</Label>
                      <Input
                        id="conference"
                        value={formData.conference_name}
                        onChange={(e) => setFormData({ ...formData, conference_name: e.target.value })}
                        placeholder="Nom de la conférence"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume</Label>
                      <Input
                        id="volume"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        placeholder="Volume"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue">Numéro</Label>
                      <Input
                        id="issue"
                        value={formData.issue}
                        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                        placeholder="Numéro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages</Label>
                      <Input
                        id="pages"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        placeholder="ex: 123-145"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="doi">DOI</Label>
                      <Input
                        id="doi"
                        value={formData.doi}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                        placeholder="10.1000/xyz123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        placeholder="978-3-16-148410-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">Éditeur</Label>
                    <Input
                      id="publisher"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="Nom de l'éditeur"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Co-auteurs et mots-clés */}
              <Card>
                <CardHeader>
                  <CardTitle>Co-auteurs et mots-clés</CardTitle>
                  <CardDescription>Ajoutez les co-auteurs et mots-clés de la publication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Co-auteurs */}
                  <div className="space-y-4">
                    <Label>Co-auteurs</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.co_authors.map((author, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {author}
                          <button
                            type="button"
                            onClick={() => removeCoAuthor(author)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newCoAuthor}
                        onChange={(e) => setNewCoAuthor(e.target.value)}
                        placeholder="Nom du co-auteur"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCoAuthor())}
                      />
                      <Button type="button" onClick={addCoAuthor} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mots-clés */}
                  <div className="space-y-4">
                    <Label>Mots-clés</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Mot-clé"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liens et fichiers */}
              <Card>
                <CardHeader>
                  <CardTitle>Liens et fichiers</CardTitle>
                  <CardDescription>Ajoutez des liens vers la publication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pdf">URL du PDF</Label>
                    <Input
                      id="pdf"
                      type="url"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      placeholder="https://example.com/paper.pdf"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="external">Lien externe</Label>
                    <Input
                      id="external"
                      type="url"
                      value={formData.external_url}
                      onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                      placeholder="https://example.com/publication"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citations">Nombre de citations</Label>
                    <Input
                      id="citations"
                      type="number"
                      min="0"
                      value={formData.citation_count}
                      onChange={(e) =>
                        setFormData({ ...formData, citation_count: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Link href="/publications">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
