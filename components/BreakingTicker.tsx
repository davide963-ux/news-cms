import Link from "next/link";
import type { PostSummary } from "@/lib/queries";

/** Auto-scrolling strip of real, recently-published headlines — content is
 * duplicated once so the CSS marquee (translateX -50%) loops seamlessly. */
export default function BreakingTicker({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  const headlines = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.slug}`}
          className="whitespace-nowrap text-sm font-semibold text-ink/80 transition hover:text-mint-bright"
        >
          {post.title}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex items-center gap-3 overflow-hidden border-b border-line bg-soft px-4 py-2">
      <span className="flex shrink-0 items-center gap-1.5 rounded bg-red-500/15 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
        Live
      </span>
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee">
          {headlines}
          {headlines}
        </div>
      </div>
    </div>
  );
}
