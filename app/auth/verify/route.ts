import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Rediriger simplement vers la page de connexion avec un message
  return NextResponse.redirect(new URL("/auth/signin?verified=true", request.url))
}
