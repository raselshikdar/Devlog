import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import kebabCase from "lodash.kebabcase";
import { translateText } from "../../lib/translate";  // Import translation function
import s from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import Metatags from "../../components/Metatags";
import { query, collection, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export default function AdminPostsPage(props) {
  return (
    <main className={s.dashboard}>
      <Metatags title="Admin Dashboard" />
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const q = query(collection(userRef, "posts"), orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map(doc => doc.data());
  return (
    <div>
      <h2>Manage your Posts</h2>
      <PostFeed posts={posts} admin />
    </div>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Ensure slug is URL safe
  const generateSlug = (title) => {
    const slug = kebabCase(title);
    return encodeURI(slug);
  };

  const handleSlugGeneration = async (title) => {
    const slug = generateSlug(title);
    if (slug === title) {
      // If slug is already in English, return it directly
      return slug;
    } else {
      // If the title is non-English, translate it and generate the slug
      const translatedSlug = await translateText(title);
      return generateSlug(translatedSlug);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const slug = await handleSlugGeneration(title);
    const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    const docRef = doc(userRef, "posts", slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      commentCount: 0,
      saveCount: 0,
    };

    await setDoc(docRef, data);

    toast.success("Post created!");
    router.push(`/admin/${slug}`);
  };

  return (
    <div className={s.createPost}>
      <h1>Create a post</h1>

      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
          className={s.input}
        />
        <p>
          <strong>Slug:</strong> {generateSlug(title)}
        </p>
        <button type="submit" disabled={!isValid} className="btn-accent">
          Create New Post
        </button>
      </form>
    </div>
  );
}
