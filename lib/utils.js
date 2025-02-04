// lib/utils.js

/**
 * Cleans the description by truncating it to 160 characters if necessary
 * and appending an ellipsis.
 * 
 * @param {string} description The description to clean.
 * @returns {string} The cleaned description.
 */
export function cleanDescription(description) {
  if (!description) return "";
  return description.length > 160 ? description.slice(0, 157) + "..." : description;
}

/**
 * Returns the absolute URL for an image, ensuring it's properly formatted.
 * 
 * @param {string} imagePath The image path (relative or absolute).
 * @returns {string} The absolute URL for the image.
 */
export function getAbsoluteImageUrl(imagePath) {
  const baseUrl = "https://devlog.rweb.site";  // Base URL of your site
  return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`;
}
