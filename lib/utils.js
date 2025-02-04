export function cleanDescription(content) {
  if (!content || typeof content !== "string") {
    return "Devlog is a dynamic blogging platform where developers share insights, codes, and ideas. Engage with articles and grow together in a thriving tech community.";
  }
  return content
    .replace(/!.*?.*?/g, '') // Remove Markdown images
    .replace(/[#*_`]/g, '') // Remove Markdown formatting
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    .substring(0, 157) + '...'; // Truncate to 160 chars
}

export function getAbsoluteImageUrl(imagePath) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devlog.rweb.site";
  return imagePath?.startsWith('http') ? imagePath : `${baseUrl}${imagePath || "/featured.png"}`;
}
