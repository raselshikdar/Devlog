import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy, startAt, endAt } from "firebase/firestore";
import styles from "./Search.module.css";

export default function Search() {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryText.trim()) {
        setResults([]);
        return;
      }

      const postsRef = collection(db, "posts");

      // Firestore query to search for posts based on the title
      const q = query(
        postsRef,
        orderBy("title"),  // Ensure you have Firestore index on "title"
        startAt(queryText), // Case-sensitive search
        endAt(queryText + "\uf8ff") // Firestore range query trick for case-insensitive match
      );

      const querySnapshot = await getDocs(q);
      const fetchedResults = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(fetchedResults);
    };

    fetchResults();
  }, [queryText]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search posts..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        className={styles.input}
      />
      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((post) => (
            <li key={post.id}>
              <a href={`/${post.uid}/${post.slug}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
