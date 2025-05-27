// Remplacer la fonction getURL par celle-ci pour s'assurer que l'URL est correcte
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this in your .env file
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    "http://localhost:3000/"

  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to include trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`

  return url
}

// Simplifier la fonction de callback pour éviter les problèmes
export const getAuthCallbackURL = () => {
  return `${getURL()}auth/callback`
}
