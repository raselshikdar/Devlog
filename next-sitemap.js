module.exports = {
  siteUrl: 'https://devlog.rweb.site', // Your website address
  generateRobotsTxt: true, // Enable robots.txt generation
  sitemapSize: 70000, // Adjust the size limit (up to 70,000 URLs)
  outDir: './public', // The output directory for the sitemap
  changefreq: 'daily', // Frequency for URL changes
  priority: 0.7, // Default priority for URLs
  generateIndexSitemap: false, // Disable generation of sitemap index (sitemap-0.xml, sitemap-1.xml)
  additionalSitemaps: [
    'https://devlog.rweb.site/sitemap.xml', // Ensure this points to your main sitemap
  ],
  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'daily',
      priority: 0.7,
    }
  },
}
