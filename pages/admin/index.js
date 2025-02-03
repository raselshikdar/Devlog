import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";
import s from "../../styles/Admin.module.css";

import { query, doc, orderBy, collection, serverTimestamp, setDoc } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import Metatags from "../../components/Metatags";

async function translateToEnglish(text) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.translatedText || text; // Fallback to original text
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Final fallback
  }
}

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

  const generateSlug = async (titleText) => {
    if (!titleText) return "";

    let slugSource = titleText;

    if (/[\u0080-\uFFFF]/.test(titleText)) {
      const translated = await translateToEnglish(titleText);
      slugSource = translated;
    }

    return encodeURI(kebabCase(slugSource));
  };

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const generatedSlug = await generateSlug(newTitle);
    setSlug(generatedSlug);
  };

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
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
