import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaCopy } from "react-icons/fa"; // Importing icons

// UI component for main post content
export default function PostContent({ post }) {
  let createdAt = typeof post?.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a");

  return (
    <>
      <div className="card">
        <h1>{post?.title}</h1>
        <span className="text-sm">
          Written by{" "}
          <Link href={`/${post.username}/`}>
            <a className="text-info">@{post.username}</a>
          </Link>{" "}
          on {createdAt}
        </span>
        <MarkdownPreview content={post?.content} />
      </div>

      <div className="card">
        <h3>Share This Post</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#3b5998", color: "white", fontSize: "1.2rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post?.title)}`}
            className="btn"
            style={{ backgroundColor: "#1DA1F2", color: "white", fontSize: "1.2rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post?.title)}`}
            className="btn"
            style={{ backgroundColor: "#0088cc", color: "white", fontSize: "1.2rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram />
          </a>

          {/* Copy Link */}
          <button
            className="btn"
            style={{ backgroundColor: "var(--color-accent)", color: "white", fontSize: "1.2rem" }}
            onClick={() => {
              navigator.clipboard.writeText(currentUrl);
              alert("Link copied to clipboard!");
            }}
          >
            <FaCopy />
          </button>
        </div>
      </div>
    </>
  );
}
