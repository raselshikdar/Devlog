import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export default async (req, res) => {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    // Add more URLs as needed
  ]

  const stream = new SitemapStream({ hostname: 'https://devlog.rweb.site' })
  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString())

  res.writeHead(200, {
    'Content-Type': 'application/xml'
  })
  res.end(xmlString)
}
