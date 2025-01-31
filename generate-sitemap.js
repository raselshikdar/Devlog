const fs = require('fs');
const path = require('path');
const { SitemapStream } = require('sitemap');
require('dotenv').config();

// Firestore imports
const { collection, getDocs } = require('firebase/firestore');
const { db } = require('./lib/firebase'); // Adjust the path

const staticLinks = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/rasel/about-us', changefreq: 'yearly', priority: 0.5 },
  { url: '/rasel/contact-us', changefreq: 'monthly', priority: 0.6 },
  { url: '/rasel/sponsor-us', changefreq: 'monthly', priority: 0.7 },
  { url: '/rasel/documentations', changefreq: 'weekly', priority: 0.8 },
  { url: '/rasel/terms-of-use', changefreq: 'yearly', priority: 0.5 },
  { url: '/rasel/privacy-policy', changefreq: 'yearly', priority: 0.5 },
  { url: '/rasel/how-to-write-blog-posts-in-devlog', changefreq: 'monthly', priority: 0.7 },
  { url: '/rasel/how-to-write-blog-posts-in-devlog-bangla-tutorial', changefreq: 'monthly', priority: 0.7 },
  { url: '/rasel/new-feature-multi-language-supports-for-codes', changefreq: 'weekly', priority: 0.8 },
];

async function fetchDynamicUrlsFromFirestore() {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    return postsSnapshot.docs.map(doc => ({
      url: `/blog/${doc.id}`,
      changefreq: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching dynamic URLs from Firestore:', error);
    return [];
  }
}

async function generateSitemap() {
  try {
    const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';
    const dynamicLinks = await fetchDynamicUrlsFromFirestore();
    const links = [...staticLinks, ...dynamicLinks];

    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    const writeStream = fs.createWriteStream(sitemapPath);
    const sitemapStream = new SitemapStream({ hostname: SITE_URL });

    sitemapStream.pipe(writeStream);
    links.forEach(url => sitemapStream.write(url));
    sitemapStream.end();

    writeStream.on('finish', () => console.log(`Sitemap generated with ${links.length} URLs!`));
    writeStream.on('error', err => console.error('Error writing sitemap:', err));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
