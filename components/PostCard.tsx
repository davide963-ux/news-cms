import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import CategoryBadge from "@/components/CategoryBadge";

export default function PostCard({
  post,
  variant = "vertical",
}: {
  post: PostSummary;
  variant?: "vertical" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/post/${post.slug}`}
        className="group flex gap-4 overflow-hidden rounded-xl border border-line bg-panel p-3 transition hover:border-mint/40"
      >
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-soft sm:w-36">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="150px"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col justify-center gap-1.5 py-1">
          {post.categories ? (
            <CategoryBadge
              name={post.categories.name}
              slug={post.categories.slug}
            />
          ) : null}
          <h3 className="line-clamp-2 font-bold leading-snug text-ink group-hover:text-mint-bright">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-mist">
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{post.views.toLocaleString("en-US")} views</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-mint/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-soft">
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
          <div className="absolute left-3 top-3">
            <CategoryBadge
              name={post.categories.name}
              slug={post.categories.slug}
              className="border-none bg-base/80 backdrop-blur"
            />
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-mint-bright">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-mist">{post.excerpt}</p>
        ) : null}
        <div className="flex items-center gap-3 border-t border-line pt-2 text-xs font-medium text-mist">
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.views.toLocaleString("en-US")} views</span>
        </div>
      </div>
    </Link>
  );
}
