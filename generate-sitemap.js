const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');
require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    }),
  });
}

const db = admin.firestore();

const generateSitemap = async () => {
  try {
    console.log('Generating sitemap...');
    const hostname = 'https://devlog.rweb.site';
    const sitemap = new SitemapStream({ hostname });

    // Static Routes
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/terms-of-use', changefreq: 'yearly', priority: 0.6 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.6 },
    ];

    // Fetch Blog Posts
    const postsSnapshot = await db.collection('posts').get();
    postsSnapshot.forEach((doc) => {
      links.push({
        url: `/blog/${doc.id}`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    // Write to sitemap
    links.forEach((link) => sitemap.write(link));
    sitemap.end();

    const sitemapOutput = resolve(__dirname, 'public', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapOutput);

    await streamToPromise(sitemap.pipe(writeStream));
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap().catch(console.error);
