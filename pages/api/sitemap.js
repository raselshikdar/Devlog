import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Import Firestore instance from your existing firebase.js

export default async (req, res) => {
  try {
    const SITE_URL = process.env.SITE_URL || 'https://devlog.rweb.site';

    // Static URLs
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

    // Fetch dynamic URLs from Firestore (e.g., blog posts)
    const dynamicLinks = await fetchDynamicUrlsFromFirestore();

    // Combine static and dynamic links
    const links = [...staticLinks, ...dynamicLinks];

    // Create sitemap stream
    const stream = new SitemapStream({ hostname: SITE_URL });

    // Convert links to XML
    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

    // Set cache headers (1 day cache)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

    // Set content type to XML
    res.setHeader('Content-Type', 'application/xml');

    // Send the XML response
    res.status(200).end(xmlString);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end('Internal Server Error');
  }
};

// Function to fetch dynamic URLs from Firestore
async function fetchDynamicUrlsFromFirestore() {
  try {
    // Fetch all documents from the 'posts' collection (replace 'posts' with your collection name)
    const postsSnapshot = await getDocs(collection(db, 'posts'));

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
