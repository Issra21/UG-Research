import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Briefcase, BarChart3, Search, MessageSquare } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Gestion des profils",
      description: "Créez et gérez vos profils de chercheur avec CV académique et domaines de recherche",
    },
    {
      icon: BookOpen,
      title: "Publications scientifiques",
      description: "Déposez et organisez vos publications avec import automatique via DOI, ORCID",
    },
    {
      icon: Briefcase,
      title: "Projets de recherche",
      description: "Suivez vos projets en cours, collaborations et financements",
    },
    {
      icon: Search,
      title: "Réseau de collaboration",
      description: "Trouvez des collaborateurs par thématique et laboratoire",
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Messagerie interne pour faciliter les échanges entre chercheurs",
    },
    {
      icon: BarChart3,
      title: "Tableaux de bord",
      description: "Statistiques et rapports pour le suivi de l'activité scientifique",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UG</span>
              </div>
              <span className="text-xl font-bold text-gray-900">UG-Research</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button>S&apos;inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plateforme de gestion des chercheurs
            <span className="block text-blue-600">Université de Gabès</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Centralisez, valorisez et mettez en réseau les chercheurs et étudiants. Favorisez la collaboration
            scientifique et la visibilité de vos travaux de recherche.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Créer un compte
              </Button>
            </Link>
            <Link href="/researchers">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explorer les profils
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fonctionnalités principales</h2>
            <p className="text-lg text-gray-600">
              Une plateforme complète pour la gestion et la valorisation de la recherche
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Chercheurs inscrits</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Publications référencées</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Projets de recherche</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-blue-100">Laboratoires connectés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UG</span>
                </div>
                <span className="text-xl font-bold">UG-Research</span>
              </div>
              <p className="text-gray-400">
                Plateforme officielle de gestion des chercheurs de l&apos;Université de Gabès
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Aide
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="text-gray-400 space-y-2">
                <p>Université de Gabès</p>
                <p>Cité Riadh Zrig, 6029 Gabès</p>
                <p>Email: research@univ-gabes.tn</p>
                <p>Tél: +216 75 392 600</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Université de Gabès. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
