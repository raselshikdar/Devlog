import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async (req, res) => {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devlog.rweb.site';

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

  const stream = new SitemapStream({ hostname: BASE_URL });
  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xmlString);
};
