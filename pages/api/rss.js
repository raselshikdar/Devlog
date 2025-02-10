import { firestore } from 'firebase-admin'; // Initialize Firebase Admin SDK
import { format } from 'date-fns'; // Optional: for date formatting

export default async function handler(req, res) {
  try {
    const postsRef = firestore().collection('posts'); // Assuming 'posts' is your collection
    const snapshot = await postsRef.orderBy('createdAt', 'desc').limit(10).get(); // Fetch recent posts
    const posts = snapshot.docs.map(doc => doc.data());

    const rssItems = posts.map(post => {
      return `
        <item>
          <title>${post.title}</title>
          <link>${`https://devlog.rweb.site/${post.author}/${post.slug}`}</link>
          <description>${post.description}</description>
          <pubDate>${format(post.createdAt.toDate(), 'EEE, dd MMM yyyy HH:mm:ss Z')}</pubDate>
          <guid>${`https://devlog.rweb.site/${post.author}/${post.slug}`}</guid>
        </item>
      `;
    }).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Devlog</title>
          <link>https://devlog.rweb.site</link>
          <description>A blog platform for developers</description>
          <language>en-us</language>
          ${rssItems}
        </channel>
      </rss>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(rssFeed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
}
