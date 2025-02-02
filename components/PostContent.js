import Link from "next/link";
import PropTypes from "prop-types";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp, FaCopy } from "react-icons/fa";

const PostContent = ({ post }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [postTags, setPostTags] = useState("{Uncategorized}");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) setCurrentUrl(window.location.href);

    if (post?.content) {
      const tagMatch = post.content.match(/Tags:\s*([^\n]+)/i);
      const extractedTags = tagMatch?.[1]?.split(/,|\s/)
        ?.map(tag => tag.trim().replace(/[^a-zA-Z0-9]/g, ''))
        ?.filter(Boolean)
        ?.slice(0, 2);

      setPostTags(extractedTags?.length ? `{${extractedTags.join(', ')}}` : "{Uncategorized}");
    }

    setLoading(false);
  }, [post]);

  const getFormattedDate = () => {
    try {
      const createdAt = post?.createdAt ? 
        (typeof post.createdAt === "number" ? 
          new Date(post.createdAt) : 
          post.createdAt.toDate()) : 
        new Date();
      
      return format(createdAt, "eeee MMM dd, yyyy - h:mm a,");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown date";
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const shareButtons = [
    {
      platform: "Facebook",
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(post.title)}&u=${encodeURIComponent(currentUrl)}`
    },
    {
      platform: "Twitter",
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      platform: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${currentUrl}`)}`
    },
    {
      platform: "Telegram",
      icon: <FaTelegram />,
      url: `https://t.me/share/url?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`
    }
  ];

  return (
    <>
      <article className="card">
        <h1>{post.title || "Untitled Post"}</h1>
        <div className="post-meta">
          <span className="text-sm">
            Written by{" "}
            <Link href={`/${post.username}/`} legacyBehavior>
              <a className="author-link">@{post.username}</a>
            </Link>{" "}
            <time dateTime={post.createdAt?.toISOString?.()}>
              on {getFormattedDate()}
            </time> {postTags}
          </span>
        </div>

        <hr className="post-divider" />

        <MarkdownPreview content={post.content} />
      </article>

      <section className="share-section card">
        <h2>Share This Post</h2>
        <div className="share-buttons">
          {shareButtons.map(({ platform, icon, url }) => (
            <a
              key={platform}
              href={url}
              className={`share-button ${platform.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${platform}`}
            >
              {icon}
            </a>
          ))}
          
          <button
            className="share-button copy-button"
            onClick={() => {
              navigator.clipboard.writeText(`${post.title} ${currentUrl}`);
              alert("Link copied to clipboard!");
            }}
            aria-label="Copy post link"
          >
            <FaCopy />
          </button>
        </div>
      </section>

      <style jsx>{`
        .loading, .error {
          padding: 2rem;
          text-align: center;
        }
        
        .post-meta {
          margin: 1rem 0;
          color: #666;
        }
        
        .post-divider {
          border: 2px solid #1dd1a1;
          margin: 0 0 1rem 0;
        }
        
        .share-buttons {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }
        
        .share-button {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.2rem;
          border-radius: 4px;
          color: white;
          transition: opacity 0.2s;
        }
        
        .share-button:hover {
          opacity: 0.9;
        }
        
        .Facebook { background-color: #3b5998; }
        .Twitter { background-color: #1DA1F2; }
        .WhatsApp { background-color: #25D366; }
        .Telegram { background-color: #0088cc; }
        .copy-button { background-color: var(--color-accent); }
        
        .author-link {
          color: #1dd1a1;
          font-weight: 500;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

PostContent.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ]).isRequired
  })
};

export default PostContent;
