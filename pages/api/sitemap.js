import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async (req, res) => {
  const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/rasel/about-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/sponsor-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/documentations', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/terms-of-use', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/privacy-policy', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/how-to-write-blog-posts-in-devlog', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/how-to-write-blog-posts-in-devlog-bangla-tutorial', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/new-feature-multi-language-supports-for-codes', changefreq: 'monthly', priority: 0.8 },
  { url: '/wasik/this-is-an-awesome-blog', changefreq: 'monthly', priority: 0.8 }
  ];

  const stream = new SitemapStream({ hostname: SITE_URL });

  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).end(xmlString);
};
