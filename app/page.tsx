import PostCard from "@/components/PostCard";
import AdBanner from "@/components/AdBanner";
import { getLatestPosts } from "@/lib/queries";

export default async function HomePage() {
  const posts = await getLatestPosts(21);
  const [featured, ...rest] = posts;

  return (
    <div className="space-y-8">
      <AdBanner slot="homepage-top" className="aspect-[6/1] w-full" />

      {featured ? (
        <section>
          <PostCard post={featured} />
        </section>
      ) : (
        <p className="text-black/50">Ende nuk ka lajme të publikuara.</p>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>

        <aside className="space-y-6">
          <AdBanner slot="homepage-sidebar" className="aspect-square w-full" />
        </aside>
      </div>
    </div>
  );
}
