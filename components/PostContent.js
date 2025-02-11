import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";
import ReadingProgressBar from "./ReadingProgressBar"; // Import the progress bar

// Dynamically import remark and related libraries to prevent SSR issues
import dynamic from "next/dynamic";
import styles from "./ToC.module.css"; // Import ToC styles

const remark = dynamic(() => import("remark"), { ssr: false });
const remarkToc = dynamic(() => import("remark-toc"), { ssr: false });
const html = dynamic(() => import("remark-html"), { ssr: false });

export default function PostContent({ post }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState("");
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
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

      generateTableOfContents(post.content);
    }

    setLoading(false);
  }, [post]);

  const generateTableOfContents = async (markdown) => {
    const processedContent = await remark().use(remarkToc).use(html).process(markdown);
    const tocContent = processedContent.toString();
    setToc(tocContent);

    // Log the ToC content for debugging
    console.log("Generated ToC:", tocContent);
  };

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

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <ReadingProgressBar /> {/* Add the reading progress bar here */}

      {/* ToC Toggle Button */}
      <button className={styles.tocButton} onClick={() => setShowToc(!showToc)}>
        {showToc ? "Hide ToC" : "Show ToC"}
      </button>

      {/* Table of Contents */}
      {showToc && toc && (
        <div className={styles.tableOfContents} dangerouslySetInnerHTML={{ __html: toc }} />
      )}

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
          {/* Facebook */}
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

          {/* Twitter */}
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

          {/* WhatsApp */}
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

          {/* Telegram */}
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

          {/* Copy Link */}
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
    </>
  );
}
