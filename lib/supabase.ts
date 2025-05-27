import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fonction pour obtenir l'URL de base dynamiquement
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Côté client : utilise l'URL actuelle
    return window.location.origin
  }

  // Côté serveur : essaie différentes sources
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Fallback pour développement local
  return "http://localhost:3000"
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Fonction pour créer un client avec URL dynamique
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Export de l'URL de base pour utilisation dans les composants
export { getBaseUrl }
