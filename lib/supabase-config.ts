export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Défini dans .env.local
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatiquement défini par Vercel
    'http://localhost:3000/'

  // S'assurer d'inclure `https://` quand ce n'est pas localhost
  url = url.includes('http') ? url : `https://${url}`
  
  // S'assurer d'inclure un `/` final
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}

export const getAuthCallbackURL = () => {
  return `${getURL()}auth/callback`
}
