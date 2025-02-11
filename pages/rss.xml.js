import { db } from "../lib/firebase"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";
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

    // Fetch posts from Firestore
    const postsSnapshot = await getDocs(collection(db, "posts"));
    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      feed.item({
        title: post.title,
        description: post.description,
        url: `https://devlog.rweb.site/${post.author}/${doc.id}`, // Adjust as per your URL structure
        date: post.createdAt.toDate(),
        author: post.author,
      });
    });

    // Set response headers for XML
    res.setHeader("Content-Type", "application/xml");
    res.write(feed.xml());
    res.end();
    
    return { props: {} }; // No props needed
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return { notFound: true };
  }
}

export default function RssPage() {
  return null; // The page itself doesn't render anything
}
