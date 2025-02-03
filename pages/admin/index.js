import s from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import Metatags from "../../components/Metatags";
import translateText from "../../lib/translate"; // Import translation function

import {
  query,
  doc,
  orderBy,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export default function AdminPostsPage() {
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
  const [slug, setSlug] = useState("");

  // Function to handle title input change
  const handleTitleChange = async (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);

    if (inputTitle) {
      const translatedTitle = await translateText(inputTitle, "en"); // Translate to English
      setSlug(encodeURI(kebabCase(translatedTitle))); // Generate slug from translated title
    } else {
      setSlug("");
    }
  };

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in Firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;

    const userRef = doc(db, "users", uid);
    const docRef = doc(userRef, "posts", slug);

    // Default post data
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
          onChange={handleTitleChange}
          placeholder="My Awesome Article!"
          className={s.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-accent">
          Create New Post
        </button>
      </form>
    </div>
  );
}
