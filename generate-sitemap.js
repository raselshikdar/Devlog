const fs = require('fs');
const path = require('path');
const { SitemapStream } = require('sitemap');
require('dotenv').config();

// Import Firestore instance
const { db } = require('./lib/firebase'); // Adjust the path to your firebase.js

// URLs to include in the sitemap
const staticLinks = [
  { url: '/', changefreq: 'daily', priority: 1.0 }, // Homepage
  { url: '/rasel/about-us', changefreq: 'yearly', priority: 0.5 }, // About
  { url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.6 }, // Contact
  { url: '/rasel/sponsor-us', changefreq: 'monthly', priority: 0.7 }, // Sponsor
  { url: '/rasel/documentations', changefreq: 'weekly', priority: 0.8 }, // Documentation
  { url: '/rasel/terms-of-use', changefreq: 'yearly', priority: 0.5 }, // Terms
  { url: '/rasel/privacy-policy', changefreq: 'yearly', priority: 0.5 }, // Privacy
  { url: '/rasel/how-to-write-blog-posts-in-devlog', changefreq: 'monthly', priority: 0.7 }, // Blog post
  { url: '/rasel/how-to-write-blog-posts-in-devlog-bangla-tutorial', changefreq: 'monthly', priority: 0.7 }, // Blog post
  { url: '/rasel/new-feature-multi-language-supports-for-codes', changefreq: 'weekly', priority: 0.8 }, // New feature
];

// Function to fetch dynamic URLs from Firestore
async function fetchDynamicUrlsFromFirestore() {
  try {
    const { collection, getDocs } = require('firebase/firestore');
    const postsSnapshot = await getDocs(collection(db, 'posts')); // Replace 'posts' with your collection name

    // Map documents to sitemap URL objects
    const dynamicLinks = postsSnapshot.docs.map(doc => ({
      url: `/blog/${doc.id}`, // Adjust the URL structure as needed
      changefreq: 'monthly', // Adjust based on how often blog posts are updated
      priority: 0.6, // Adjust priority based on importance
    }));

    return dynamicLinks;
  } catch (error) {
    console.error('Error fetching dynamic URLs from Firestore:', error);
    return []; // Return an empty array if there's an error
  }
}

// Main function to generate the sitemap
async function generateSitemap() {
  try {
    const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';

    // Fetch dynamic URLs
    const dynamicLinks = await fetchDynamicUrlsFromFirestore();

    // Combine static and dynamic links
    const links = [...staticLinks, ...dynamicLinks];

    // Create a write stream to the sitemap.xml file in the public directory
    const writeStream = fs.createWriteStream(path.join(__dirname, 'public', 'sitemap.xml'));

    // Create the sitemap stream
    const sitemapStream = new SitemapStream({ hostname: SITE_URL });

    // Pipe the sitemap stream into the file
    sitemapStream.pipe(writeStream);

    // Add each URL to the sitemap stream
    links.forEach(url => {
      sitemapStream.write(url);
    });

    // Close the stream
    sitemapStream.end();

    writeStream.on('finish', () => {
      console.log(`Sitemap generated successfully with ${links.length} URLs!`);
    });

    writeStream.on('error', (err) => {
      console.error('Error writing sitemap:', err);
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the sitemap generator
generateSitemap();
