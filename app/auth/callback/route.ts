import { NextResponse } from "next/server"

export async function GET() {
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
