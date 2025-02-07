import { useState, useEffect } from "react";
import styles from "./Search.module.css";
import { db } from "../../lib/firebase"; // Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";

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
      const q = query(postsRef, where("title", ">=", queryText)); 
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
        placeholder="Search..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        className={styles.input}
      />
      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((post) => (
            <li key={post.id}>
              <a href={`/${post.username}/${post.slug}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
