// lib/utils.js

/**
 * Cleans and truncates text for SEO-friendly descriptions.
 * Removes Markdown/HTML and truncates to 160 characters.
 */
export function cleanDescription(description) {
  if (!description) return "";
  
  const cleanText = description
    .replace(/!?\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_`]/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleanText.length > 157 
    ? `${cleanText.slice(0, 157)}...` 
    : cleanText;
}

/**
 * Generates absolute URLs for images with fallbacks.
 */
export function getAbsoluteImageUrl(imagePath) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devlog.rweb.site";
  const defaultImage = `${baseUrl}/featured.png`;

  if (!imagePath || typeof imagePath !== "string") return defaultImage;

  const sanitizedPath = imagePath.startsWith("/") 
    ? imagePath 
    : `/${imagePath}`;

  return imagePath.startsWith("http")
    ? imagePath
    : `${baseUrl}${sanitizedPath}`;
}

/**
 * Optional: Optimizes image URLs for WebP format.
 */
export function optimizeImageUrl(url) {
  if (!url) return url;
  return url.replace(/(\.jpg|\.png)$/, ".webp");
}
