/**
 * Utilidadsimple para manejo de URLs de imágenes.
 * Sin Cloudinary AI, sin eliminación de fondo, sin procesamiento.
 * Solo visualización uniforme de imágenes por URL.
 */

// Detecta si una URL pertenece a Cloudinary
export function isCloudinaryUrl(url: string): boolean {
  if (!url) return false
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com')
}

// Valida si una URL parece ser una imagen
export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Obtiene la URL tal cual (sin modificaciones)
export function getImageUrl(url: string): string {
  return url || ''
}
