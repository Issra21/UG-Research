import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">UG-Research</h1>
        <div className="space-x-4">
          <Link href="/auth/signin">
            <Button>Se connecter</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline">S&apos;inscrire</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
