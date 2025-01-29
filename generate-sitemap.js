const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const generateSitemap = async () => {
  try {
    console.log('Starting sitemap generation...');
    const sitemap = new SitemapStream({ hostname: 'https://devlog.rweb.site' });

    // Add your static and dynamic routes here
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      // Add more URLs as needed
    ];

    // Write links to sitemap
    links.forEach(link => {
      console.log('Writing link:', link);
      sitemap.write(link);
    });

    sitemap.end();

    const sitemapOutput = resolve(__dirname, 'public', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapOutput);

    // Error handling for stream
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
