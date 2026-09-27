import Link from "next/link";
import type { PostSummary } from "@/lib/queries";

export default function TrendingList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-mist">No articles yet.</p>;
  }

  return (
    <ol className="space-y-3">
      {posts.map((post, index) => (
        <li key={post.id}>
          <Link
            href={`/post/${post.slug}`}
            className="group flex gap-3 rounded-lg p-1 transition hover:bg-soft"
          >
            <span className="w-5 shrink-0 text-lg font-black leading-none text-line group-hover:text-mint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-mint-bright">
              {post.title}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
