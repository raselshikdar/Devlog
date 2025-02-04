import Head from "next/head";
import { cleanDescription, getAbsoluteImageUrl } from "@/lib/utils";  // Correct alias after jsconfig.json is added

export default function Metatags({
  title = "Devlog - Developer Community Blog.",
  description = "Devlog is a dynamic blogging platform where developers share insights, codes, and ideas. Engage with articles and grow together in a thriving tech community.",
  image = "/featured.png",
  url = "",  // Ensure this URL is relative, like "/rasel/about-us"
  type = "article",
  author = "Devlog Team",
}) {
  const canonicalUrl = url ? `https://devlog.rweb.site${url}` : "https://devlog.rweb.site";
  const metaDescription = cleanDescription(description);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={metaDescription} />
      <meta name="author" content={author} />
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={getAbsoluteImageUrl(image)} />
      <meta property="og:site_name" content="Devlog" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@raselshikdar_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={getAbsoluteImageUrl(image)} />

      {/* Google Search Verification */}
      <meta name="google-site-verification" content="QL7oyxAB-xfJ0bzZYvQAU9CnGNnbyUx8k7fGG5n7Srk" />
    </Head>
  );
}
