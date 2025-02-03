module.exports = {
  siteUrl: 'https://devlog.rweb.site', // Your site URL
  generateRobotsTxt: true, // Generate robots.txt
  outDir: './public', // Output directory
  changefreq: 'daily', // Frequency of URL changes
  priority: 0.7, // Default priority for all URLs
  sitemapSize: 70000, // Max number of URLs per sitemap file (set to 70k for a single file)
  
  generateIndexSitemap: false, // Disable index sitemap (e.g., sitemap-0.xml)
  
  transform: async (config, url) => ({
    loc: url, // Location of the URL
    changefreq: 'daily', // Frequency of URL changes
    priority: 0.7, // Priority of URL
  }),
};
