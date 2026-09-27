import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/queries";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-black/10 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition duration-200 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        {post.categories ? (
          <span className="inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-brand">
            {post.categories.name}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold leading-snug group-hover:text-brand">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-black/60">{post.excerpt}</p>
        ) : null}
        <div className="flex items-center gap-3 text-xs text-black/40">
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.views} shikime</span>
        </div>
      </div>
    </Link>
  );
}
