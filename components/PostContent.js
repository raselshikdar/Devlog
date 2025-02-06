import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";
import ReadingProgressBar from "./ReadingProgressBar"; // Import the progress bar
import Head from "next/head";
import firebase from "../lib/firebase"; // Updated import path

export default function PostContent({ post }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");
  const [loading, setLoading] = useState(true);
  const [faqData, setFaqData] = useState([]); // State for storing FAQ data

  useEffect(() => {
    // Fetch FAQ data from Firestore
    const fetchFaqs = async () => {
      const faqsRef = firebase.firestore().collection("faqs");
      const snapshot = await faqsRef.get();
      const faqs = snapshot.docs.map(doc => doc.data());
      setFaqData(faqs); // Set FAQ data to state
    };

    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    if (post?.content) {
      const tagMatch = post.content.match(/Tags:\s*([\w\s,]+)/i);
      if (tagMatch) {
        const tags = tagMatch[1]
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag);
        
        setPostTags(tags.length > 0 ? `{${tags.slice(0, 2).join(", ")}}` : "{Uncategorized}");
      }
    }

    fetchFaqs(); // Fetch FAQ data when the post is loaded
    setLoading(false);
  }, [post]);

  const getFormattedDate = () => {
    try {
      const createdAt = post?.createdAt ? 
        (typeof post.createdAt === "number" 
          ? new Date(post.createdAt) 
          : post.createdAt.toDate()
        ) : new Date();
      
      return format(createdAt, "eeee MMM dd, yyyy - h:mm a,");
    } catch (e) {
      console.error("Date formatting error:", e);
      return "[Invalid Date]";
    }
  };

  // FAQ Schema Markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      }
    })),
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Head>
        {/* Adding FAQ Schema Markup */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Head>

      <ReadingProgressBar /> {/* Add the reading progress bar here */}

      <div className="card">
        <h1>{post?.title || "Untitled Post"}</h1>
        <span className="text-sm">
          Written by{" "}
          <Link href={`/${post.username}/`}>
            <a className="text-info">@{post.username}</a>
          </Link>{" "}
          on {getFormattedDate()} {postTags}
        </span>

        <hr style={{ border: "2px solid #1dd1a1", margin: "0 0 1rem 0" }} />

        <MarkdownPreview content={post?.content} />
      </div>

      <div className="card">
        <h3>Share This Post</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {/* Share buttons */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(post.title)}&u=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#3b5998", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <FaFacebook size={16} />
          </a>

          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#1DA1F2", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <FaTwitter size={16} />
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#25D366", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp size={16} />
          </a>

          <a
            href={`https://t.me/share/url?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#0088cc", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Telegram"
          >
            <FaTelegram size={16} />
          </a>

          <button
            className="btn"
            style={{ backgroundColor: "var(--color-accent)", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            onClick={() => {
              navigator.clipboard.writeText(post.title + " " + currentUrl);
              alert("Link copied to clipboard!");
            }}
            aria-label="Copy post link"
          >
            <FaCopy size={16} />
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-section">
          {faqData.length === 0 ? (
            <p>No FAQs available.</p>
          ) : (
            faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
