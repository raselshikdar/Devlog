module.exports = {
  siteUrl: 'https://devlog.rweb.site', // Your website address
  generateRobotsTxt: true, // Enable robots.txt generation
  sitemapSize: 50000, // Ensure the sitemap file size doesn't exceed 50,000 URLs before splitting (increase or decrease this based on your needs)
  outDir: './public', // The output directory for the sitemap
  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'daily',
      priority: 0.7,
    }
  },
}
