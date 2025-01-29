const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const generateSitemap = async () => {
  try {
    console.log('Starting sitemap generation...');
    const sitemap = new SitemapStream({ hostname: 'https://devlog.rweb.site' });

    // Static and dynamic routes
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      
      // Manually added links
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

    // Write links to sitemap
    links.forEach(link => {
      console.log('Writing link:', link);
      sitemap.write(link);
    });

    sitemap.end();

    const sitemapOutput = resolve(__dirname, 'public', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapOutput);

    // Handle errors
    writeStream.on('error', (error) => {
      console.error('Error writing sitemap:', error);
    });

    // Stream the sitemap to the file
    await streamToPromise(sitemap.pipe(writeStream))
      .then(() => {
        console.log('Sitemap generated at', sitemapOutput);
      })
      .catch((error) => {
        console.error('Error generating sitemap:', error);
      });
  } catch (error) {
    console.error('Error in generateSitemap:', error);
  }
};

generateSitemap().catch(console.error);
