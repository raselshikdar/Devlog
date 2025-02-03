module.exports = {
  siteUrl: 'https://devlog.rweb.site',
  generateRobotsTxt: true,  // Generates robots.txt
  outDir: './public',  // Output directory
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 70000,  // All URLs stay in one file unless you exceed 70,000
  generateIndexSitemap: true,  // Keep sitemap-0.xml generation
  transform: async (config, url) => ({
    loc: url,  // Keep URLs as they are
    changefreq: 'daily',
    priority: 0.7,
  }),
};
