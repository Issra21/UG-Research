"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, BookOpen, Briefcase, BarChart3, MessageSquare, Settings, User, Search, Plus } from "lucide-react"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Mon profil", href: "/profile", icon: User },
  { name: "Chercheurs", href: "/researchers", icon: Users },
  { name: "Publications", href: "/publications", icon: BookOpen },
  { name: "Projets", href: "/projects", icon: Briefcase },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Statistiques", href: "/analytics", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

const quickActions = [
  { name: "Nouvelle publication", href: "/publications/new", icon: Plus },
  { name: "Nouveau projet", href: "/projects/new", icon: Plus },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              )}
            >
              <item.icon
                className={cn(
                  pathname === item.href ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 flex-shrink-0 h-6 w-6",
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-6 px-2">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions rapides</h3>
          <div className="mt-2 space-y-1">
            {quickActions.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                <item.icon className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
