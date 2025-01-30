// Instead of: 
// import { SitemapStream, streamToPromise } from 'sitemap';

// Use: 
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');
const dotenv = require('dotenv'); // Make sure dotenv is required
dotenv.config();  // Load environment variables

const generateSitemap = async () => {
  try {
    console.log('Starting sitemap generation...');
    const sitemap = new SitemapStream({ hostname: 'https://devlog.rweb.site' });

    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      // Other links as needed
    ];

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
