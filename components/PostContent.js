import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";

export default function PostContent({ post }) {
  let createdAt = typeof post?.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate();
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    // Extract tags from post content
    const tagMatch = post?.content.match(/Tags:\s*([\w\s,]+)/i);
    if (tagMatch) {
      const tags = tagMatch[1]
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
      if (tags.length > 0) {
        setPostTags(`{${tags.slice(0, 2).join(", ")}}`);
      }
    }
  }, [post]);

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a,");
  const postTitle = post?.title;
  const twitterHashtags = "Devlog,Programming"; // Change as needed

  const handleCopy = () => {
    navigator.clipboard.writeText(`${postTitle} ${currentUrl}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: postTitle, url: currentUrl })
        .catch(error => console.error("Error sharing:", error));
    }
  };

  return (
    <>
      <div className="card">
        <h1>{post?.title}</h1>
        <span className="text-sm">
          Written by{" "}
          <Link href={`/${post.username}/`}>
            <a className="text-info">@{post.username}</a>
          </Link>{" "}
          on {createdAt} {postTags}
        </span>

        <hr style={{ border: "2px solid #1dd1a1", margin: "0 0 1rem 0" }} />

        <MarkdownPreview content={post?.content} />
      </div>

      <div className="card">
        <h3>Share This Post</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(postTitle)}&u=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#3b5998", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={16} />
          </a>

          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}&hashtags=${twitterHashtags}`}
            className="btn"
            style={{ backgroundColor: "#1DA1F2", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={16} />
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(postTitle + " " + currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#25D366", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={16} />
          </a>

          <a
            href={`https://t.me/share/url?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#0088cc", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram size={16} />
          </a>

          <button
            className="btn"
            style={{ backgroundColor: "var(--color-accent)", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            onClick={handleCopy}
          >
            <FaCopy size={16} /> {copySuccess ? "Copied!" : "Copy"}
          </button>

          {navigator.share && (
            <button
              className="btn"
              style={{ backgroundColor: "#FF5733", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
              onClick={handleWebShare}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </>
  );
}
