const fs = require('fs');
const path = require('path');
const { SitemapStream } = require('sitemap');
require('dotenv').config();

// URLs to include in the sitemap
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 }, // Homepage should be crawled frequently. (Correct)

{ url: '/rasel/about-us', changefreq: 'yearly', priority: 0.5 }, // About pages rarely change. (Correct)
{ url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.6 }, // Contact pages may change more often (e.g., contact info updates).
{ url: '/rasel/sponsor-us', changefreq: 'monthly', priority: 0.7 }, // Sponsorship details may change more frequently than yearly.
{ url: '/rasel/documentations', changefreq: 'weekly', priority: 0.8 }, // Documentation often receives updates, so weekly is better.
{ url: '/rasel/terms-of-use', changefreq: 'yearly', priority: 0.5 }, // Legal pages change infrequently. (Correct)
{ url: '/rasel/privacy-policy', changefreq: 'yearly', priority: 0.5 }, // Privacy policies are updated occasionally. (Correct)

{ url: '/rasel/how-to-write-blog-posts-in-devlog', changefreq: 'monthly', priority: 0.7 }, // Correct
{ url: '/rasel/how-to-write-blog-posts-in-devlog-bangla-tutorial', changefreq: 'monthly', priority: 0.7 }, // Correct
{ url: '/rasel/new-feature-multi-language-supports-for-codes', changefreq: 'weekly', priority: 0.8 }, // New features may get updates. (Correct)

{ url: '/wasik/this-is-an-awesome-blog', changefreq: 'monthly', priority: 0.6 }, // Individual blog posts don’t need high priority. (Correct),
{ url: '/rasel/how-to-write-complete-blog-article-using-markdown', changefreq: 'monthly', priority: 0.7 },
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
