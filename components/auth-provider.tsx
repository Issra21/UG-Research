"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fonction pour charger le profil utilisateur
    const loadProfile = async (userId: string) => {
      try {
        console.log("Chargement du profil pour l'utilisateur:", userId)

        // Vérifier d'abord si le profil existe
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

        if (error) {
          console.error("Erreur lors du chargement du profil:", error)

          // Si le profil n'existe pas, essayer de le créer
          if (error.code === "PGRST116") {
            console.log("Profil non trouvé, tentative de création...")
            await createProfile(userId)
          } else {
            setProfile(null)
          }
        } else {
          console.log("Profil chargé avec succès:", data)
          setProfile(data)
        }
      } catch (error) {
        console.error("Exception lors du chargement du profil:", error)
        setProfile(null)
      }
    }

    // Fonction pour créer un profil s'il n'existe pas
    const createProfile = async (userId: string) => {
      try {
        // Obtenir les informations de l'utilisateur
        const { data: userData } = await supabase.auth.getUser(userId)

        if (!userData.user) {
          console.error("Utilisateur non trouvé")
          return
        }

        const { email, user_metadata } = userData.user

        // Créer le profil
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: email || "",
            first_name: user_metadata?.first_name || "",
            last_name: user_metadata?.last_name || "",
            role: user_metadata?.role || "researcher",
            is_active: true,
          })
          .select()

        if (error) {
          console.error("Erreur lors de la création du profil:", error)
        } else if (data && data.length > 0) {
          console.log("Profil créé avec succès:", data[0])
          setProfile(data[0])
        }
      } catch (error) {
        console.error("Exception lors de la création du profil:", error)
      }
    }

    // Fonction pour obtenir la session initiale
    const getInitialSession = async () => {
      try {
        setLoading(true)
        console.log("Récupération de la session initiale...")

        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("Session récupérée:", session ? "Session trouvée" : "Aucune session")

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Configurer l'écouteur d'événements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Événement d'authentification:", event)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Erreur lors du rafraîchissement du profil:", error)
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.error("Exception lors du rafraîchissement du profil:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
