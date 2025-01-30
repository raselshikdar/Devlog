const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap'); // Correct import for v6.x
require('dotenv').config();

// URLs to include in the sitemap
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  // Add other URLs here
];

// Create the sitemap stream
const sitemapStream = new SitemapStream({ hostname: process.env.SITE_URL || 'https://www.example.com' });

// Create a write stream to the sitemap.xml file in the public directory
const writeStream = fs.createWriteStream(path.join(__dirname, 'public', 'sitemap.xml'));

// Pipe the sitemap stream into the file
streamToPromise(sitemapStream.pipe(writeStream))
  .then(() => {
    console.log('Sitemap generated successfully!');
  })
  .catch(err => {
    console.error('Error generating sitemap:', err);
  });

// Add each URL to the sitemap stream
urls.forEach(url => {
  sitemapStream.write(url);
});

// Close the stream
sitemapStream.end();
