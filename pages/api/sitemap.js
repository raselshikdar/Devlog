import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async (req, res) => {
  const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 }
  ];

  const stream = new SitemapStream({ hostname: SITE_URL });

  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).end(xmlString);
};
