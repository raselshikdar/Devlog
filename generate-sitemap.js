const fs = require('fs');
const path = require('path');
const sitemap = require('sitemap');
require('dotenv').config();

// Your site URLs
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  // Add other URLs here
];

// Ensure you include your website URL and other pages dynamically if needed
const sitemapStream = sitemap.createSitemap({
  hostname: process.env.SITE_URL || 'https://www.example.com', // Use your site URL
  cacheTime: 600000, // Cache for 600 seconds (10 minutes)
  urls: urls
});

// Write the sitemap.xml file to the public directory
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

sitemapStream.toXML((err, xml) => {
  if (err) {
    console.error('Error generating sitemap:', err);
    return;
  }
  
  fs.writeFileSync(sitemapPath, xml);
  console.log('Sitemap generated successfully!');
});
