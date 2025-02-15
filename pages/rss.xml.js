import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import RSS from 'rss';

export async function getServerSideProps({ res }) {
  try {
    // Create an instance of the RSS feed
    const feed = new RSS({
      title: 'Devlog Blog',
      description: 'Latest posts from Devlog',
      site_url: 'https://devlog.rweb.site',
      feed_url: 'https://devlog.rweb.site/rss.xml',
      language: 'en',
    });

    // Fetch posts sorted by creation date (newest first)
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const postsSnapshot = await getDocs(postsQuery);

    if (postsSnapshot.empty) {
      console.log("No posts found.");
    }

    // Add each post to the RSS feed
    postsSnapshot.forEach((doc) => {
      const data = doc.data();

      console.log("Adding post:", data);

      // Safely convert createdAt to a Date object, falling back to the current date if needed
      const postDate = data.createdAt ? data.createdAt.toDate() : new Date();

      feed.item({
        title: data.title || "Untitled Post",
        description: data.description || "",
        url: `https://devlog.rweb.site/${data.username}/${data.slug}`,
        date: postDate,
        author: data.username || "",
      });
    });

    // Set the response headers and write the RSS XML
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

// This component does not render anything on the client
export default function RssFeed() {
  return null;
}
