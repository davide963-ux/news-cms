import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Pagination from "@/components/Pagination";
import { getPostsByCategory, getCategories, getTrendingPosts } from "@/lib/queries";
import { getCryptoTicker } from "@/lib/crypto";

const PAGE_SIZE = 9;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { page?: string };
}) {
  const { slug } = await params;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [{ category, posts, total }, categories, trending, ticker] =
    await Promise.all([
      getPostsByCategory(slug, PAGE_SIZE, (page - 1) * PAGE_SIZE),
      getCategories(),
      getTrendingPosts(5),
      getCryptoTicker(),
    ]);

  if (!category) notFound();

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr_300px]">
      <aside className="hidden lg:block">
        <LeftSidebar categories={categories} />
      </aside>

      <div className="space-y-6">
        <h1 className="border-b-2 border-mint pb-2 text-2xl font-black uppercase tracking-wide text-ink">
          {category.name}
        </h1>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-line bg-panel p-6 text-mist">
            No articles in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination
          basePath={`/kategori/${slug}`}
          page={page}
          totalPages={totalPages}
        />
      </div>

      <aside>
        <RightSidebar trending={trending} ticker={ticker} />
      </aside>
    </div>
  );
}
