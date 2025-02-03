// pages/[username]/[slug].js

import s from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import Comments from "../../components/Comments";
import { UserContext } from "../../lib/context/userContext";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";

import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useContext } from "react";
import {
  query,
  getDoc,
  getDocs,
  doc,
  collectionGroup,
  where,
} from "firebase/firestore";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;
  let doesPostExists;

  if (userDoc) {
    const postRef = doc(userDoc.ref, "posts", slug);
    const postDoc = await getDoc(postRef);
    post = postToJSON(postDoc);
    path = postRef.path;
    doesPostExists = postDoc?.exists();
  }

  if (!doesPostExists) {
    return {
      notFound: true,
    };
  }
  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const postsRef = collectionGroup(db, "posts");
  const postsQuery = query(postsRef, where("published", "==", true));
  const snapshot = await getDocs(postsQuery);

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(db, props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;
  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={s.container}>
      {/* Pass title and description dynamically to Metatags */}
      <Metatags 
        title={post.title} 
        description={post.excerpt || post.title.slice(0, 160)} // Use excerpt or title as description
        image={post.image || '/featured.png'}  // Default image if not provided
      />

      <section>
        <PostContent post={post} />
        <Comments postRef={postRef} />
      </section>

      <aside>
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/signin">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-accent">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
