import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import CategoryBadge from "@/components/CategoryBadge";
import Byline from "@/components/Byline";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Pagination from "@/components/Pagination";
import {
  getLatestPosts,
  getCategories,
  getTrendingPosts,
  getPostsByCategory,
} from "@/lib/queries";
import { getCryptoTicker } from "@/lib/crypto";

const HERO_COUNT = 5;
const PAGE_SIZE = 6;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [heroResult, categories, trending, ticker, memecoins, marketAnalysis] =
    await Promise.all([
      getLatestPosts(HERO_COUNT, 0),
      getCategories(),
      getTrendingPosts(5),
      getCryptoTicker(),
      getPostsByCategory("memecoins", 4),
      getPostsByCategory("market-analysis", 4),
    ]);

  const [hero, ...smallerFeatured] = heroResult.posts;
  const remainingTotal = Math.max(0, heroResult.total - HERO_COUNT);
  const totalPages = Math.max(1, Math.ceil(remainingTotal / PAGE_SIZE));
  const { posts: latestNews } = await getLatestPosts(
    PAGE_SIZE,
    HERO_COUNT + (page - 1) * PAGE_SIZE
  );

  return (
    <div className="space-y-12">
      {/* ---------- Featured section ---------- */}
      {hero ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Link
            href={`/post/${hero.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-line bg-panel lg:col-span-2"
          >
            <div className="relative aspect-[16/9] w-full">
              {hero.cover_image_url ? (
                <Image
                  src={hero.cover_image_url}
                  alt={hero.title}
                  fill
                  priority
                  className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
              {hero.categories ? (
                <CategoryBadge name={hero.categories.name} slug={hero.categories.slug} />
              ) : null}
              <h1 className="max-w-2xl text-2xl font-black leading-tight text-ink sm:text-3xl">
                {hero.title}
              </h1>
              <Byline publishedAt={hero.published_at} views={hero.views} />
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {smallerFeatured.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-line bg-panel p-6 text-mist">
          No published news yet.
        </p>
      )}

      {/* ---------- Three-column editorial layout ---------- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr_300px]">
        <aside className="hidden lg:block">
          <LeftSidebar categories={categories} />
        </aside>

        <div className="space-y-12">
          <section id="latest-news" className="space-y-5 scroll-mt-32">
            <h2 className="border-b-2 border-mint pb-2 text-lg font-black uppercase tracking-wide text-ink">
              Latest News
            </h2>
            <div className="space-y-4">
              {latestNews.map((post, index) =>
                index % 3 === 0 ? (
                  <PostCard key={post.id} post={post} />
                ) : (
                  <PostCard key={post.id} post={post} variant="horizontal" />
                )
              )}
              {latestNews.length === 0 ? (
                <p className="text-mist">No more articles.</p>
              ) : null}
            </div>
            <Pagination basePath="/" page={page} totalPages={totalPages} />
          </section>

          {memecoins.posts.length > 0 ? (
            <section id="memecoin-spotlight" className="space-y-5 scroll-mt-32">
              <h2 className="border-b-2 border-mint pb-2 text-lg font-black uppercase tracking-wide text-ink">
                Memecoin Spotlight
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {memecoins.posts.map((post) => (
                  <PostCard key={post.id} post={post} variant="horizontal" />
                ))}
              </div>
            </section>
          ) : null}

          {marketAnalysis.posts.length > 0 ? (
            <section id="market-analysis" className="space-y-5 scroll-mt-32">
              <h2 className="border-b-2 border-mint pb-2 text-lg font-black uppercase tracking-wide text-ink">
                Market Analysis
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {marketAnalysis.posts.map((post) => (
                  <PostCard key={post.id} post={post} variant="horizontal" />
                ))}
              </div>
            </section>
          ) : null}

          {trending.length > 0 ? (
            <section id="editors-picks" className="space-y-5 scroll-mt-32">
              <h2 className="border-b-2 border-mint pb-2 text-lg font-black uppercase tracking-wide text-ink">
                Editor&apos;s Picks
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {trending.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside>
          <RightSidebar trending={trending} ticker={ticker} />
        </aside>
      </div>
    </div>
  );
}
