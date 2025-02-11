// pages/rss.xml.js
import RSS from 'next-rss';
import { db, collection, getDocs } from '../lib/firebase';  // Import Firestore functions

export async function getServerSideProps({ res }) {
  // Fetch the posts collection from Firestore
  const postsSnapshot = await getDocs(collection(db, 'posts'));  // 'posts' collection in Firestore

  // Map the fetched posts into an array of post objects
  const posts = postsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      title: data.title,  // Assuming 'title' field in Firestore
      description: data.description,  // Assuming 'description' field in Firestore
      slug: data.slug,  // Assuming 'slug' field in Firestore
      username: data.username,  // Assuming 'username' field in Firestore
      date: data.createdAt.toDate(),  // Assuming 'createdAt' field is a Firestore Timestamp
    };
  });

  // Create the RSS feed using next-rss
  const rss = new RSS({
    title: 'Devlog Blog',  // Title of your site
    description: 'Latest posts from Devlog',  // Description of your site
    site: 'https://devlog.rweb.site',  // Your site URL
    items: posts.map(post => ({
      title: post.title,
      description: post.description,
      url: `https://devlog.rweb.site/${post.username}/${post.slug}`,  // URL with username and slug
      date: post.date,  // Date of the post
    })),
  });

  // Set the content-type header to application/rss+xml
  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(rss.xml());  // Generate and send the RSS XML content
  res.end();

  return { props: {} };
}

export default function RSS() {
  return null;  // No need to render anything
}
