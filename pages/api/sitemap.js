import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import admin from 'firebase-admin';

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

export default async (req, res) => {
  try {
    const hostname = 'https://devlog.rweb.site';
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/terms-of-use', changefreq: 'yearly', priority: 0.6 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.6 },
    ];

    // Fetch blog posts
    const postsSnapshot = await db.collection('posts').get();
    postsSnapshot.forEach((doc) => {
      links.push({
        url: `/blog/${doc.id}`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    const stream = new SitemapStream({ hostname });
    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xmlString);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Internal Server Error');
  }
};
