import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";

// UI component for main post content
export default function PostContent({ post }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const tagMatch = post?.content.match(/Tags:\s*([\w\s,]+)/i);
    if (tagMatch) {
      const tags = tagMatch[1]
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
      setPostTags(`{${tags.slice(0, 2).join(", ")}}`);
    }
  }, [post]);

  const createdAt = post?.createdAt ? format(new Date(post.createdAt), "eeee MMM dd, yyyy - h:mm a,") : "";
  const postTitle = post?.title || "Untitled Post";

  return (
    <>
      <div className="card">
        <h1>{postTitle}</h1>
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
          <SocialShareButton
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(postTitle)}&u=${encodeURIComponent(currentUrl)}`}
            style="facebook-btn"
            Icon={FaFacebook}
            label="Facebook"
          />
          <SocialShareButton
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            style="twitter-btn"
            Icon={FaTwitter}
            label="Twitter"
          />
          <SocialShareButton
            href={`https://wa.me/?text=${encodeURIComponent(postTitle + " " + currentUrl)}`}
            style="whatsapp-btn"
            Icon={FaWhatsapp}
            label="WhatsApp"
          />
          <SocialShareButton
            href={`https://t.me/share/url?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
            style="telegram-btn"
            Icon={FaTelegram}
            label="Telegram"
          />
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
    </>
  );
}

const SocialShareButton = ({ href, style, Icon, label }) => (
  <a href={href} className={`btn ${style}`} target="_blank" rel="noopener noreferrer">
    <Icon size={16} />
  </a>
);
