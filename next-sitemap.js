module.exports = {
  siteUrl: 'https://devlog.rweb.site', // Your website address
  generateRobotsTxt: true, // Enable robots.txt generation
  sitemapSize: 70000, // Adjust the size limit (e.g., up to 70,000 URLs)
  outDir: './public', // The output directory for the sitemap
  changefreq: 'daily', // Frequency for URL changes
  priority: 0.7, // Default priority for URLs
  generateIndexSitemap: false, // This will prevent the index sitemap (sitemap.xml) from being generated as a list of URLs
  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'daily',
      priority: 0.7,
    }
  },
}
