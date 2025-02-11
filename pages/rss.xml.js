import { db } from "../lib/firebase"; // Firestore instance
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import RSS from "rss";

export async function getServerSideProps({ res }) {
  try {
    const feed = new RSS({
      title: "Devlog RSS Feed",
      description: "Latest posts from Devlog",
      site_url: "https://devlog.rweb.site",
      feed_url: "https://devlog.rweb.site/rss.xml",
      language: "en",
    });

    // Fetch posts from Firestore and sort by 'createdAt' in descending order
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const postsSnapshot = await getDocs(postsQuery);

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      feed.item({
        title: post.title,
        description: post.description,
        url: `https://devlog.rweb.site/${post.username}/${post.slug}`, // Adjusted URL structure
        date: post.createdAt.toDate(),
        author: post.username, // Assuming 'username' is the field for the author
        custom_elements: [{ 'content:encoded': post.content }] // Optional: Include post content if needed
      });
    });

    // Set response headers to indicate XML content
    res.setHeader("Content-Type", "application/xml");
    res.write(feed.xml()); // Send the RSS feed XML
    res.end();

    return { props: {} }; // No props needed
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).end(); // Return a 500 error if there's a problem
    return { props: {} };
  }
}

export default function RssPage() {
  return null; // The page itself doesn't render anything
}
