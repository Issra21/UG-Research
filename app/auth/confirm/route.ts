import { createServerComponentClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/auth/success"

  console.log("Confirmation route called with:", {
    token_hash: !!token_hash,
    type,
    next,
    origin,
    fullUrl: request.url,
  })

  if (token_hash && type) {
    const supabase = createServerComponentClient()

    try {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (!error) {
        console.log("Email verification successful")
        // Redirect to success page
        return NextResponse.redirect(new URL("/auth/success", origin))
      } else {
        console.error("Email verification failed:", error)
        // Redirect to error page with error details
        const errorUrl = new URL("/auth/error", origin)
        errorUrl.searchParams.set("error", error.message)
        return NextResponse.redirect(errorUrl)
      }
    } catch (error) {
      console.error("Verification error:", error)
      const errorUrl = new URL("/auth/error", origin)
      errorUrl.searchParams.set("error", "Erreur de vérification")
      return NextResponse.redirect(errorUrl)
    }
  }

  // If no token or type, redirect to error page
  console.log("Missing token_hash or type")
  const errorUrl = new URL("/auth/error", origin)
  errorUrl.searchParams.set("error", "Lien de confirmation invalide")
  return NextResponse.redirect(errorUrl)
}
