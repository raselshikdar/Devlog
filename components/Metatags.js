// components/Metatags.js

import Head from "next/head";

export default function Metatags({
  title = "Devlog",
  description = "Devlog is a dynamic blogging platform where developers share insights, codes, and ideas. Engage with articles and grow together in a thriving tech community.",
  image = "/featured.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@raselshikdar_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="google-site-verification" content="QL7oyxAB-xfJ0bzZYvQAU9CnGNnbyUx8k7fGG5n7Srk" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
