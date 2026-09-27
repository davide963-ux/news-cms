import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getPostsByCategory } from "@/lib/queries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, posts } = await getPostsByCategory(slug);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <h1 className="border-b-2 border-brand pb-2 text-2xl font-black uppercase tracking-wide text-ink">
        {category.name}
      </h1>

      {posts.length === 0 ? (
        <p className="text-ink/50">Ende nuk ka lajme në këtë kategori.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
