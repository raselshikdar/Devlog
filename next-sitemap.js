module.exports = {
  siteUrl: 'https://devlog.rweb.site',
  generateRobotsTxt: true,
  outDir: './public',
  sitemapSize: 70000,
  generateIndexSitemap: false,
  changefreq: 'weekly', // Default frequency for blog posts and other pages
  priority: 0.7, // Default priority for blog posts
  transform: async (config, url) => {
    // Set homepage's priority to 1.0 and changefreq to 'daily'
    const isHomepage = url === config.siteUrl;
    return {
      loc: url,  // Full URL
      lastmod: new Date().toISOString(),  // Last modified date
      changefreq: isHomepage ? 'daily' : 'weekly',  // Homepage gets daily updates, others weekly
      priority: isHomepage ? 1.0 : 0.7,  // Homepage gets priority 1.0, others 0.7
    };
  },
};
