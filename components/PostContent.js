import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";

export default function PostContent({ post }) {
  let createdAt = typeof post?.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate();
  const [currentUrl, setCurrentUrl] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a");

  const postTitle = post?.title;

  // Extract TOC from Markdown content
  useEffect(() => {
    if (post?.content) {
      const headings = post.content.match(/^#{2,4} .+/gm); // Matches ##, ###, #### headings
      if (headings) {
        const toc = headings.map((heading) => {
          const level = heading.split(" ")[0].length; // Count the number of #
          const text = heading.replace(/^#{2,4} /, "").trim(); // Remove ##
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-"); // Create an ID
          return { level, text, id };
        });
        setTableOfContents(toc);
      }
    }
  }, [post?.content]);

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

        {/* Horizontal Line */}
        <hr />

        {/* Table of Contents */}
        {tableOfContents.length > 0 && (
          <div className="table-of-contents card">
            <h3>Table of Contents</h3>
            <ul>
              {tableOfContents.map((item, index) => (
                <li key={index} style={{ marginLeft: (item.level - 2) * 10 }}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blog Content */}
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
            href={`https://twitter.com/share?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`}
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
    </>
  );
}
