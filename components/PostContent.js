import Link from "next/link"; 
import MarkdownPreview from "./MarkdownPreview"; 
import format from "date-fns/format"; 
import { useEffect, useState } from "react"; 
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa"; 
import ReadingProgressBar from "./ReadingProgressBar"; 

const TableOfContents = ({ headings, nightMode }) => { 
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => { 
    setIsExpanded(!isExpanded); 
  };

  return ( 
    <div style={{ 
      margin: "1rem 0", 
      border: nightMode ? "1px solid #444" : "1px solid #eaeaea", 
      borderRadius: "8px", 
      cursor: "pointer", 
      backgroundColor: isExpanded ? (nightMode ? "#444" : "#f8f8f8") : (nightMode ? "#ccc" : "#fff"), // Dark gray for expanded in night mode
      overflow: "hidden", 
    }} onClick={toggleExpand} > 
      <div style={{ 
        padding: "0.75rem 1rem", 
        fontWeight: "600", 
        backgroundColor: nightMode ? "#444" : "#f0f0f0", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
      }} > 
        <span style={{ color: nightMode ? "#fff" : "#000" }}>📚 Table of Contents</span> 
        <span style={{ 
          transition: "transform 0.2s", 
          transform: `rotate(${isExpanded ? 90 : 0}deg)`, 
          color: nightMode ? "#fff" : "#000" 
        }}> ▶ </span> 
      </div> 
      {isExpanded && ( 
        <div style={{ 
          padding: "1rem", 
          maxHeight: "400px", 
          overflowY: "auto", 
          backgroundColor: nightMode ? "#222" : "#fff", 
        }} > 
          {headings.map((heading, index) => ( 
            <a key={index} href={`#${heading.slug}`} style={{ 
              display: "block", 
              fontSize: "0.9rem", 
              padding: "0.3rem 0", 
              paddingLeft: `${(heading.level - 1) * 20}px`, 
              color: nightMode ? "#1e90ff" : "#0070f3", 
              textDecoration: "none", 
              transition: "all 0.2s", 
            }} onClick={(e) => e.stopPropagation()} onMouseOver={(e) => (e.target.style.color = nightMode ? "#ff0070" : "#ff0070")} onMouseOut={(e) => (e.target.style.color = nightMode ? "#1e90ff" : "#0070f3")} > 
              {heading.text} 
            </a> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
};

export default function PostContent({ post, nightMode }) { 
  const [currentUrl, setCurrentUrl] = useState(""); 
  const [postTags, setPostTags] = useState("{Uncategorized}"); 
  const [loading, setLoading] = useState(true); 
  const [headings, setHeadings] = useState([]); 
  const [greetingContent, setGreetingContent] = useState(""); 
  const [mainContent, setMainContent] = useState("");

  useEffect(() => { 
    if (typeof window !== "undefined") { 
      setCurrentUrl(window.location.href); 
    }

    if (post?.content) {
      // Process tags
      const tagMatch = post.content.match(/Tags:\s*([\w\s,]+)/i);
      if (tagMatch) {
        const tags = tagMatch[1]
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        setPostTags(tags.length > 0 ? `{${tags.slice(0, 2).join(", ")}}` : "{Uncategorized}");
      }

      // Process headings and split content
      const lines = post.content.split("\n");
      let firstHeadingIndex = -1; // Corrected variable name
      const extractedHeadings = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headingMatch = line.match(/^ {0,3}(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          if (firstHeadingIndex === -1) firstHeadingIndex = i;
          const level = headingMatch[1].length;
          const text = headingMatch[2].trim();
          const slug = text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
          extractedHeadings.push({ level, text, slug });
        }
      }

      setHeadings(extractedHeadings);

      if (firstHeadingIndex === -1) {
        setGreetingContent(post.content);
        setMainContent("");
      } else {
        const greetingLines = lines.slice(0, firstHeadingIndex);
        const mainLines = lines.slice(firstHeadingIndex);
        setGreetingContent(greetingLines.join("\n"));
        setMainContent(mainLines.join("\n"));
      }
    }

    setLoading(false);
  }, [post]);

  const getFormattedDate = () => {
    try {
      const createdAt = post?.createdAt ? (typeof post.createdAt === "number" ? new Date(post.createdAt) : post.createdAt.toDate()) : new Date();
      return format(createdAt, "eeee MMM dd, yyyy - h:mm a");
    } catch (e) {
      console.error(" Date formatting error:", e);
      return "[Invalid Date]";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <ReadingProgressBar />
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
        <MarkdownPreview content={greetingContent} />
        {headings.length > 0 && <TableOfContents headings={headings} nightMode={nightMode} />}
        <MarkdownPreview content={mainContent} />
      </div>
      <div className="card">
        <h3>Share This Post</h3>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
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
    </>
  ); 
}
