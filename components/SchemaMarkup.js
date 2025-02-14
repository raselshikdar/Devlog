import Head from "next/head";

export default function SchemaMarkup({ post }) {
  if (!post) return null;

  const postTitle = post.title || "Untitled Post";
  const postDescription = post.description || post.content || postTitle;
  const postImage = post.image || "/featured.png";
  const postUrl = `https://devlog.rweb.site/${post.username}/${post.slug}`;

  // Helper to format dates as ISO strings.
  const formatDate = (date) => {
    if (!date) return null;
    try {
      // If the date is a Firestore Timestamp, use toDate()
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toISOString();
    } catch (error) {
      return date;
    }
  };

  const publishedDate = formatDate(post.createdAt);
  const modifiedDate = formatDate(post.updatedAt) || publishedDate;

  // Include keywords if tags are available (assumes post.tags is an array)
  const keywords = post.tags && Array.isArray(post.tags) ? post.tags.join(", ") : undefined;

  // BlogPosting Schema (BlogPosting is a subtype of Article)
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postTitle,
    "description": postDescription,
    "image": postImage,
    ...(keywords && { "keywords": keywords }),
    "author": {
      "@type": "Person",
      "name": post.username,
      // Additional author details (e.g., URL or image) can be added here if available.
    },
    "publisher": {
      "@type": "Organization",
      "name": "Devlog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://devlog.rweb.site/logo.png",
      },
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  // BreadcrumbList Schema: Home > Username > Post Title
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://devlog.rweb.site"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.username,
        "item": `https://devlog.rweb.site/${post.username}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": postTitle,
        "item": postUrl
      }
    ]
  };

  // FAQ Schema (if the post contains FAQ data)
  const faqSchema =
    post.faq && Array.isArray(post.faq)
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
      {/* Blog Posting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* FAQ Schema (if exists) */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </Head>
  );
}
