const { SitemapStream, streamToPromise } = require('sitemap')
const { createWriteStream } = require('fs')
const { resolve } = require('path')

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname: 'https://devlog.rweb.site' })

  // Add your static and dynamic routes here
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 })
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 })
  // Add more URLs as needed

  sitemap.end()

  const sitemapOutput = resolve(__dirname, 'public', 'sitemap.xml')
  const writeStream = createWriteStream(sitemapOutput)
  await streamToPromise(sitemap.pipe(writeStream))

  console.log('Sitemap generated at', sitemapOutput)
}

generateSitemap().catch(console.error)
