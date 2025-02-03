import { useState, useEffect } from "react";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import { db } from "../../lib/firebase";
import { getDocs, query, collection, where, orderBy, limit, startAfter } from "firebase/firestore";
import { AiOutlineCloseCircle } from "react-icons/ai";

// Max posts per page
const LIMIT = 5;

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT)
    );

    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  const [allPosts, setAllPosts] = useState(posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // Function to fetch more posts
  const getMorePosts = async () => {
    setLoading(true);
    const last = allPosts[allPosts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const postsQuery = query(
      collection(db, "users", user.uid, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map(postToJSON);
    setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setLoading(false);

    // Check if we have reached the end of posts
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title={user.username} description={`${user.username}'s public profile`} />
      <UserProfile user={user} />
      <PostFeed posts={allPosts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}

      {loading && <div>Loading...</div>}

      {postsEnd && <div>You have reached the end!</div>}
    </main>
  );
}
