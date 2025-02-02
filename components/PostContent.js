import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";

export default function PostContent({ post }) {
  let createdAt = typeof post?.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate();
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const tagMatch = post?.content.match(/Tags:\s*([\w\s,]+)/i);
    if (tagMatch) {
      const tags = tagMatch[1].split(",").map(tag => tag.trim()).filter(tag => tag);
      if (tags.length > 0) {
        setPostTags(`{${tags.slice(0, 2).join(", ")}}`);
      }
    }
  }, [post]);

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a,");
  const postTitle = post?.title;

  // Copy Link to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(postTitle + " " + currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="card">
        <h1>{post?.title}</h1>
        <span className="text-sm">
          Written by{" "}
          <Link href={`/${post.username}/`} className="text-info">@{post.username}</Link>{" "}
          on {createdAt} {postTags}
        </span>
        <hr style={{ border: "2px solid #1dd1a1", margin: "0 0 1rem 0" }} />
        <MarkdownPreview content={post?.content} />
      </div>

      {/* Share Section */}
      <div className="card">
        <h3>Share This Post</h3>
        <div className="share-buttons">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(postTitle)}&u=${encodeURIComponent(currentUrl)}`}
            className="btn fb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={18} /> Facebook
          </a>

          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={18} /> Twitter
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(postTitle + " " + currentUrl)}`}
            className="btn whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={18} /> WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            className="btn telegram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram size={18} /> Telegram
          </a>

          <button className="btn copy" onClick={handleCopy}>
            <FaCopy size={18} /> {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .share-buttons {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          transition: 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .fb { background-color: #3b5998; }
        .twitter { background-color: #1DA1F2; }
        .whatsapp { background-color: #25D366; }
        .telegram { background-color: #0088cc; }
        .copy { background-color: var(--color-accent); }
        .btn:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
}
