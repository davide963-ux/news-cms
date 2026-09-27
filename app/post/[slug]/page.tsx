import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CategoryBadge from "@/components/CategoryBadge";
import Byline from "@/components/Byline";
import SocialShare from "@/components/SocialShare";
import PostCard from "@/components/PostCard";
import RightSidebar from "@/components/RightSidebar";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import {
  getPostBySlug,
  incrementPostViews,
  getRelatedPosts,
  getAdjacentPosts,
  getTrendingPosts,
} from "@/lib/queries";
import { getCryptoTicker } from "@/lib/crypto";
import { estimateReadingTime } from "@/lib/format";

/**
 * Post bodies are stored as plain text (no HTML) — rendered through JSX text
 * nodes (never dangerouslySetInnerHTML), so nothing an author types can run
 * as HTML. A few plain-text conventions get special styling:
 *   "> "  at the start of a paragraph  -> blockquote
 *   "## " at the start of a paragraph  -> subheading
 *   "!! " at the start of a paragraph  -> highlighted info box
 */
function PostBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="prose-crypto space-y-5 text-lg leading-relaxed text-ink/85">
      {paragraphs.map((paragraph, i) => {
        const lines = paragraph.split("\n");
        const text = (
          <>
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </>
        );

        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-2 text-2xl font-black text-ink">
              {paragraph.slice(3)}
            </h2>
          );
        }
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote key={i}>
              {lines.map((l) => l.replace(/^>\s?/, "")).join(" ")}
            </blockquote>
          );
        }
        if (paragraph.startsWith("!! ")) {
          return (
            <div key={i} className="highlight-box">
              <p className="text-base text-ink">{paragraph.slice(3)}</p>
            </div>
          );
        }
        return <p key={i}>{text}</p>;
      })}
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Fire-and-forget: don't make the reader wait on the counter write.
  incrementPostViews(post.id).catch(() => {});

  const [related, adjacent, trending, ticker] = await Promise.all([
    getRelatedPosts(post.categories?.id, post.id, 4),
    getAdjacentPosts(post.published_at),
    getTrendingPosts(5),
    getCryptoTicker(),
  ]);

  const readingMinutes = estimateReadingTime(post.body);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://" + (process.env.VERCEL_URL || "example.com")}/post/${post.slug}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
      <article className="min-w-0 space-y-6">
        <header className="space-y-3">
          {post.categories ? (
            <CategoryBadge name={post.categories.name} slug={post.categories.slug} />
          ) : null}
          <h1 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <Byline
              publishedAt={post.published_at}
              views={post.views + 1}
              readingMinutes={readingMinutes}
            />
            <SocialShare url={shareUrl} title={post.title} />
          </div>
        </header>

        {post.cover_image_url ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-soft">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>
        ) : null}

        <PostBody body={post.body} />

        {post.post_images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {post.post_images.map((image) => (
              <figure key={image.id} className="space-y-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-soft">
                  <Image
                    src={image.image_url}
                    alt={image.caption ?? post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="text-sm text-mist">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        <AdBanner slot="article-inline" className="aspect-[6/1] w-full" />

        {/* Previous / Next */}
        <nav className="grid grid-cols-1 gap-3 border-y border-line py-6 sm:grid-cols-2">
          {adjacent.prev ? (
            <Link
              href={`/post/${adjacent.prev.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-line bg-panel p-3 transition hover:border-mint/40"
            >
              <ArrowLeftIcon className="h-4 w-4 shrink-0 text-mist" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-mist">
                  Previous
                </p>
                <p className="line-clamp-1 text-sm font-semibold text-ink group-hover:text-mint-bright">
                  {adjacent.prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {adjacent.next ? (
            <Link
              href={`/post/${adjacent.next.slug}`}
              className="group flex items-center justify-end gap-3 rounded-xl border border-line bg-panel p-3 text-right transition hover:border-mint/40"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-mist">
                  Next
                </p>
                <p className="line-clamp-1 text-sm font-semibold text-ink group-hover:text-mint-bright">
                  {adjacent.next.title}
                </p>
              </div>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-mist" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {related.length > 0 ? (
          <section className="space-y-4">
            <h2 className="border-b-2 border-mint pb-2 text-lg font-black uppercase tracking-wide text-ink">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <aside>
        <RightSidebar trending={trending} ticker={ticker} />
      </aside>
    </div>
  );
}
