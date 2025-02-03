module.exports = {
  // Use environment variable instead of hardcoded domain
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://devlog.rweb.site',
  generateRobotsTxt: true,
  outDir: './public',
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 70000,
  generateIndexSitemap: false,
  transform: async (config, url) => {
    // Universal homepage check (works with any domain)
    const isHomepage = url === '/';
    
    return {
      // Safely construct absolute URL using dynamic siteUrl
      loc: new URL(url, config.siteUrl).toString(),
      lastmod: new Date().toISOString(),
      changefreq: isHomepage ? 'daily' : config.changefreq,
      priority: isHomepage ? 1.0 : config.priority,
    };
  },
};
