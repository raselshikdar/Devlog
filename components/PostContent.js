import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";
import PostShare from "./PostShare"; // Import the PostShare component

// UI component for main post content
export default function PostContent({ post }) {
  let createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  createdAt = format(createdAt, "eeee MMM dd, yyyy - h:mm a");

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
        <MarkdownPreview content={post?.content} />
      </div>

      {/* Post sharing feature added in a separate card */}
      <div className="card share-card">
        <PostShare
          postUrl={typeof window !== "undefined" ? window.location.href : ""}
          postTitle={post?.title}
        />
      </div>
    </>
  );
}
