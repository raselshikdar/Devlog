module.exports = {
  siteUrl: 'https://devlog.rweb.site',
  generateRobotsTxt: true,
  outDir: './public',
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 70000,
  generateIndexSitemap: false,
  transform: async (config, url) => {
    // Correctly identify homepage by path
    const isHomepage = url === '/';

    // Ensure absolute URL for sitemap entries
    return {
      loc: `${config.siteUrl}${url}`, // Combine siteUrl with path
      lastmod: new Date().toISOString(),
      changefreq: isHomepage ? 'daily' : config.changefreq,
      priority: isHomepage ? 1.0 : config.priority,
    };
  },
};
