import { useState } from "react";

export default function PostShare({ postUrl, postTitle }) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`,
    telegram: `https://t.me/share/url?url=${postUrl}&text=${postTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`,
    email: `mailto:?subject=${postTitle}&body=${postUrl}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card share-card">
      <h3>Share this post</h3>
      <div className="share-buttons">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href={shareLinks.email}>Email</a>
        <button onClick={copyLink}>{copied ? "Copied!" : "Copy Link"}</button>
      </div>
    </div>
  );
}
