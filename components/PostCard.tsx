import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block overflow-hidden rounded-xl border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        {post.categories ? (
          <span className="absolute left-3 top-3 rounded bg-brand px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
            {post.categories.name}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-brand">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>
        ) : null}
        <div className="flex items-center gap-3 text-xs font-medium text-ink/40">
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.views} shikime</span>
        </div>
      </div>
    </Link>
  );
}
