import Head from "next/head";

export default function SchemaMarkup({ post }) {
  if (!post) return null;

  const postTitle = post.title || "Untitled Post";
  const postDescription = post.description || post.content || postTitle;
  const postImage = post.image || "/featured.png";
  const postUrl = `https://devlog.rweb.site/${post.username}/${post.slug}`;

  // BlogPosting Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postTitle,
    "description": postDescription,
    "image": postImage,
    "author": {
      "@type": "Person",
      "name": post.username,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Devlog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://devlog.rweb.site/logo.png",
      },
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  // FAQ Schema (if exists)
  const faqSchema = post.faq && Array.isArray(post.faq)
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      }
    : null;

  return (
    <Head>
      {/* Blog Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      {/* FAQ Schema (if exists) */}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </Head>
  );
}
