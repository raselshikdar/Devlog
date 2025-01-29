import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import s from "./PostFeed.module.css";

export default function PostFeed({ posts, admin }) {
  return (
    <div className={s.container}>
      {posts?.map(post => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </div>
  );
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  const daysAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="card">
      <div className={s.postHeader}>
        <Link href={`/${post.username}`}>
          <a>
            <strong>By @{post.username}</strong>
          </a>
        </Link>
        <span className={s.daysAgo}>{daysAgo}</span> {/* Days ago added here */}
      </div>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💖 {post.heartCount || 0} Hearts</span>
      </footer>

      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
