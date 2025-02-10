import { getFirestore } from 'firebase-admin/firestore';
import dateformat from 'dateformat';
import { marked } from 'marked';

const siteBaseUrl = "https://devlog.rweb.site";

// Initialize Firebase Admin SDK
if (!global._firebaseAdmin) {
  const admin = require('firebase-admin');
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
    });
  }
  global._firebaseAdmin = admin;
}
const db = getFirestore();

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  const postsSnapshot = await db.collection("posts").orderBy("date", "desc").limit(20).get();
  const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Devlog</title>
      <link>${siteBaseUrl}</link>
      <description>Latest posts from Devlog</description>
      ${posts
        .map(post => `
        <item>
          <title>${post.title}</title>
          <link>${siteBaseUrl}/${post.username}/${post.id}</link>
          <description>${post.excerpt || ""}</description>
          <pubDate>${dateformat(post.date, "ddd, dd mmm yyyy HH:MM:ss o")}</pubDate>
          ${post.coverImage ? `<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${siteBaseUrl}${post.coverImage.src}"/>` : ""}
        </item>`)
        .join('')}
    </channel>
  </rss>`;

  res.status(200).send(rssFeed);
}
