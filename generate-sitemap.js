import 'dotenv/config';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';

const generateSitemap = async () => {
  try {
    console.log('Starting sitemap generation...');
    const sitemap = new SitemapStream({ hostname: SITE_URL });

    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/rasel/sponsor-us', changefreq: 'monthly', priority: 0.8 },
      { url: '/rasel/new-feature-multi-language-supports-for-codes', changefreq: 'weekly', priority: 0.7 },
      { url: '/rasel/how-to-write-blog-posts-in-devlog-bangla-tutorial', changefreq: 'weekly', priority: 0.7 },
      { url: '/rasel/how-to-write-blog-posts-in-devlog', changefreq: 'weekly', priority: 0.7 },
      { url: '/rasel/documentations', changefreq: 'monthly', priority: 0.8 },
      { url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.8 },
      { url: '/rasel/terms-of-use', changefreq: 'yearly', priority: 0.6 },
      { url: '/rasel/privacy-policy', changefreq: 'yearly', priority: 0.6 },
      { url: '/rasel/about-us', changefreq: 'monthly', priority: 0.8 }
    ];

    links.forEach(link => sitemap.write(link));
    sitemap.end();

    const sitemapOutput = resolve(__dirname, 'public', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapOutput);
    
    await streamToPromise(sitemap.pipe(writeStream));
    console.log('Sitemap generated at', sitemapOutput);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();
