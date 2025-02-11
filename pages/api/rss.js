import { db } from "../../lib/firebase"; // Firestore instance
import { collection, getDocs } from "firebase/firestore";
import RSS from "rss";

export default async function handler(req, res) {
  try {
    // Create a new RSS feed instance
    const feed = new RSS({
      title: "Devlog RSS Feed",
      description: "Latest posts from Devlog",
      site_url: "https://devlog.rweb.site",
      feed_url: "https://devlog.rweb.site/api/rss",
      language: "en",
    });

    // Fetch posts from Firestore
    const postsSnapshot = await getDocs(collection(db, "posts"));
    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      feed.item({
        title: post.title,
        description: post.description,
        url: `https://devlog.rweb.site/${post.author}/${doc.id}`, // Adjust this as per your URL structure
        date: post.createdAt.toDate(), // Convert Firestore timestamp
        author: post.author,
      });
    });

    // Set response headers and send XML
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(feed.xml());
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
  }
}
