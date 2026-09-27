import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import AdBanner from "@/components/AdBanner";
import { getLatestPosts } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const posts = await getLatestPosts(21);
  const [featured, ...rest] = posts;

  return (
    <div className="space-y-10">
      <AdBanner slot="homepage-top" className="aspect-[6/1] w-full" />

      {featured ? (
        <Link
          href={`/post/${featured.slug}`}
          className="group relative block overflow-hidden rounded-2xl bg-ink"
        >
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
            {featured.cover_image_url ? (
              <Image
                src={featured.cover_image_url}
                alt={featured.title}
                fill
                priority
                className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                sizes="100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-10">
            {featured.categories ? (
              <span className="inline-block rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {featured.categories.name}
              </span>
            ) : null}
            <h1 className="max-w-3xl text-2xl font-black leading-tight text-white sm:text-4xl">
              {featured.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-medium text-white/60">
              <span>{formatDate(featured.published_at)}</span>
              <span>·</span>
              <span>{featured.views} shikime</span>
            </div>
          </div>
        </Link>
      ) : (
        <p className="text-ink/50">Ende nuk ka lajme të publikuara.</p>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          {rest.length > 0 ? (
            <h2 className="border-b-2 border-brand pb-2 text-lg font-black uppercase tracking-wide text-ink">
              Lajmet e fundit
            </h2>
          ) : null}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <AdBanner slot="homepage-sidebar" className="aspect-square w-full" />
        </aside>
      </div>
    </div>
  );
}
