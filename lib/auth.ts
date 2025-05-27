import { supabase } from "./supabase"
import type { Profile } from "./types"

export async function signUp(email: string, password: string, profileData: Partial<Profile>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })

  if (error) throw error

  // Ne pas créer le profil ici - il sera créé après la confirmation email
  // dans la page complete-profile ou via un trigger de base de données

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return data as Profile
}

// Check if user is authenticated
export async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
