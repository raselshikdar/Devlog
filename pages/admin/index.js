import s from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";

import { useContext, useState, useCallback } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import Metatags from "../../components/Metatags";
import { query, doc, orderBy, collection, serverTimestamp, setDoc } from "firebase/firestore";

// Function to translate text to English using LibreTranslate API
async function translateToEnglish(text) {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: "en",
      }),
    });

    if (!res.ok) {
      throw new Error("Translation API request failed");
    }

    const data = await res.json();
    return data.translatedText || text; // Fallback to original text if translation fails
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text in case of any error
  }
}

// Debounce function to limit API calls while typing
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  // Function to generate a slug
  const generateSlug = async (titleText) => {
    if (!titleText) return "";

    let slugSource = titleText;

    // Translate to English only if the title is not in English
    try {
      const translatedTitle = await translateToEnglish(titleText);
      slugSource = translatedTitle;
    } catch (error) {
      console.error("Translation failed, using original title:", error);
    }

    return encodeURI(kebabCase(slugSource));
  };

  // Debounced version of handleTitleChange to avoid excessive API calls
  const debouncedHandleTitleChange = useCallback(
    debounce(async (newTitle) => {
      const generatedSlug = await generateSlug(newTitle);
      setSlug(generatedSlug);
    }, 500), // Adjust the delay as needed
    []
  );

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedHandleTitleChange(newTitle);
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

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <div>
      <h2>Manage your Posts</h2>
      <PostFeed posts={posts} admin />
    </div>
  );
}
