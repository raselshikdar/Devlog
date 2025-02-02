import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa"; // Importing WhatsApp icon
import { FaCheckCircle } from "react-icons/fa"; // Importing the checkmark icon for verified badge

// UI component for main post content
export default function PostContent({ post }) {
  let createdAt = typeof post?.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate();
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    // Extract tags from post content
    const tagMatch = post?.content.match(/Tags:\s*([\w\s,]+)/i);
    if (tagMatch) {
      const tags = tagMatch[1]
        .split(",") // Split by comma
        .map(tag => tag.trim()) // Remove extra spaces
        .filter(tag => tag); // Remove empty values
      if (tags.length > 0) {
        setPostTags(`{${tags.slice(0, 2).join(", ")}}`); // Take first 1 or 2 tags
      }
    }
  }, [post]);

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a,");

  // Title of the post
  const postTitle = post?.title;

  return (
    <>
      <div className="card">
        <h1>{post?.title}</h1>
        <span className="text-sm">
          Written by{" "}
          <Link href={`/${post.username}/`}>
            <a className="text-info">
              @{post.username}
              {post.username === "rasel" && (
                <FaCheckCircle
                  size={14}
                  className="verified-icon" // Adding a class for mobile styling
                />
              )}
            </a>
          </Link>{" "}
          on {createdAt} {postTags}
        </span>

        {/* Adjusted Horizontal Line */}
        <hr style={{ border: "2px solid #1dd1a1", margin: "0 0 1rem 0" }} />

        <MarkdownPreview content={post?.content} />
      </div>

      <div className="card">
        <h3>Share This Post</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(postTitle)}&u=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#3b5998", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={16} />
          </a>

          {/* Twitter */}
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#1DA1F2", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={16} />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(postTitle + " " + currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#25D366", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={16} />
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn"
            style={{ backgroundColor: "#0088cc", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram size={16} />
          </a>

          {/* Copy Link */}
          <button
            className="btn"
            style={{ backgroundColor: "var(--color-accent)", color: "white", fontSize: "1rem", padding: "0.6rem 1rem" }}
            onClick={() => {
              navigator.clipboard.writeText(postTitle + " " + currentUrl);
              alert("Link copied to clipboard!");
            }}
          >
            <FaCopy size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .verified-icon {
          color: #1da1f2; /* Twitter Blue */
          margin-left: 5px; /* Space between username and icon */
        }

        /* Mobile view: Smaller icon size and adjusted spacing */
        @media (max-width: 767px) {
          .verified-icon {
            font-size: 12px; /* Smaller icon size for mobile */
            margin-left: 3px; /* Reduced margin to fit better */
          }
        }
      `}</style>
    </>
  );
}
