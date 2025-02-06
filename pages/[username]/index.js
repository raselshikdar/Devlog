import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import Link from "next/link"; // Import Link for navigation
import { auth } from "../../lib/firebase"; // Import Firebase auth
import {
  getDocs,
  query as firebaseQuery,
  collection,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;

  // Fetch user data from Firestore
  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = firebaseQuery(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      {/* Meta tags for SEO */}
      <Metatags
        title={user.username}
        description={`${user.username}'s public profile`}
      />

      {/* User Profile Component */}
      <UserProfile user={user} />

      {/* Add a link to the Edit Profile page if the current user is viewing their own profile */}
      {auth.currentUser?.uid === user.id && (
        <div style={{ marginTop: "1rem" }}>
          <Link href="/profile/edit">
            <a style={{ textDecoration: "underline", color: "blue" }}>
              Edit Profile
            </a>
          </Link>
        </div>
      )}

      {/* Display the user's posts */}
      <PostFeed posts={posts} />
    </main>
  );
}
