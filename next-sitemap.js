module.exports = {
  siteUrl: 'https://devlog.rweb.site',
  generateRobotsTxt: true, // Generates robots.txt
  outDir: './public', // Output directory for the generated files
  changefreq: 'weekly', // Default frequency for other pages
  priority: 0.7, // Default priority for other pages
  sitemapSize: 70000, // Max number of URLs per sitemap
  generateIndexSitemap: false, // Disable sitemap index file
  transform: async (config, url) => {
    // Check if the current URL is the homepage
    const isHomepage = url === config.siteUrl;

    return {
      loc: url,
      lastmod: new Date().toISOString(),
      changefreq: isHomepage ? 'daily' : 'weekly', // Homepage: daily, others: weekly
      priority: isHomepage ? 1.0 : 0.7, // Homepage: 1.0, others: 0.7
    };
  },
};
