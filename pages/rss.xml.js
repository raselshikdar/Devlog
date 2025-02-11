import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import RSS from 'rss';

export async function getServerSideProps({ res }) {
  try {
    // Create RSS feed instance
    const feed = new RSS({
      title: 'Devlog Blog',
      description: 'Latest posts from Devlog',
      site_url: 'https://devlog.rweb.site',
      feed_url: 'https://devlog.rweb.site/rss.xml',
      language: 'en',
    });

    // Fetch posts with sorting
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const postsSnapshot = await getDocs(postsQuery);

    // Log the fetched posts to verify
    if (postsSnapshot.empty) {
      console.log("No posts found.");
    }

    // Add items to feed
    postsSnapshot.forEach((doc) => {
      const data = doc.data();

      // Log post data to verify
      console.log("Adding post:", data);

      feed.item({
        title: data.title,
        description: data.description,
        url: `https://devlog.rweb.site/${data.username}/${data.slug}`,
        date: data.createdAt.toDate(),
        author: data.username,
      });
    });

    // Set headers and write response
    res.setHeader('Content-Type', 'application/rss+xml');
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.write(feed.xml({ indent: true }));
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('RSS generation error:', error);
    res.status(500).end();
    return { props: {} };
  }
}

// Renamed component to avoid name collision
export default function RssFeed() {
  return null;
}
