module.exports = {
  siteUrl: 'https://devlog.rweb.site',  // Your site URL
  generateRobotsTxt: true,  // Generate robots.txt
  outDir: './public',  // Output directory for sitemap files
  sitemapSize: 70000,  // Max number of URLs per sitemap
  generateIndexSitemap: false,  // Disable indexing of split sitemaps
  changefreq: 'weekly',  // Frequency of page updates (based on blog updates)
  priority: 0.7,  // Default priority for blog posts (can be adjusted for specific pages)
  transform: async (config, url) => {
    // Dynamic URL priority adjustment
    const isHomepage = url === config.siteUrl;
    return {
      loc: url,  // Full URL (e.g., https://devlog.rweb.site/post-title)
      lastmod: new Date().toISOString(),  // Last modified date
      changefreq: isHomepage ? 'daily' : 'weekly',  // Homepage updates daily, others weekly
      priority: isHomepage ? 1.0 : 0.7,  // Set homepage priority to 1.0, others to 0.7
    };
  },
};
