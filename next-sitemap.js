module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://devlog.rweb.site',
  generateRobotsTxt: true,
  outDir: './public',
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 70000,
  generateIndexSitemap: false,
  transform: async (config, url) => {
    const isHomepage = url === '/';

    return {
      loc: new URL(url, config.siteUrl).toString(),
      lastmod: new Date().toISOString(),
      changefreq: isHomepage ? 'daily' : config.changefreq,
      priority: isHomepage ? 1.0 : config.priority,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://devlog.rweb.site/sitemap.xml',
    ],
  },
};
