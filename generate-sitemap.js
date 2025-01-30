const fs = require('fs');
const path = require('path');
const { SitemapStream } = require('sitemap');
require('dotenv').config();

// URLs to include in the sitemap
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/rasel/about-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.8 },
  // Add other URLs here
];

// Create a write stream to the sitemap.xml file in the public directory
const writeStream = fs.createWriteStream(path.join(__dirname, 'public', 'sitemap.xml'));

// Create the sitemap stream
const sitemapStream = new SitemapStream({ hostname: process.env.SITE_URL || 'https://devlog.rweb.site' });

// Pipe the sitemap stream into the file
sitemapStream.pipe(writeStream);

// Add each URL to the sitemap stream
urls.forEach(url => {
  sitemapStream.write(url);
});

// Close the stream
sitemapStream.end();

writeStream.on('finish', () => {
  console.log('Sitemap generated successfully!');
});

writeStream.on('error', (err) => {
  console.error('Error writing sitemap:', err);
});
