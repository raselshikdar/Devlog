module.exports = {
  siteUrl: 'https://devlog.rweb.site',
  generateRobotsTxt: true,  // Ensures robots.txt is generated
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 70000,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://devlog.rweb.site/sitemap-0.xml', // Adding the additional sitemap explicitly
    ],
  },
  transform: async (config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: 0.7,
  }),
};
