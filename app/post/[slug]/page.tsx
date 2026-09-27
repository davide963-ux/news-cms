import { notFound } from "next/navigation";
import Image from "next/image";
import AdBanner from "@/components/AdBanner";
import { getPostBySlug, incrementPostViews } from "@/lib/queries";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

/**
 * Post bodies are stored as plain text (no HTML) — a blank line starts a new
 * paragraph. Rendering through JSX text nodes (never dangerouslySetInnerHTML)
 * means there's nothing here an author could inject that would run as HTML.
 */
function PostBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-lg leading-relaxed text-black/80">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>
          {paragraph.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
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

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        {post.categories ? (
          <span className="inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-brand">
            {post.categories.name}
          </span>
        ) : null}
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-black/40">
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.views + 1} shikime</span>
        </div>
      </header>

      {post.cover_image_url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/5">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      ) : null}

      <PostBody body={post.body} />

      {post.post_images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {post.post_images.map((image) => (
            <figure key={image.id} className="space-y-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/5">
                <Image
                  src={image.image_url}
                  alt={image.caption ?? post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {image.caption ? (
                <figcaption className="text-sm text-black/50">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      <AdBanner slot="article-inline" className="aspect-[6/1] w-full" />
    </article>
  );
}
