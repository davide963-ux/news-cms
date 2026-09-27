import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();

  const [{ data: posts }, { data: ads }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, status, views, published_at, categories(name)")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("ads").select("impressions, clicks"),
  ]);

  const totalViews = (posts ?? []).reduce((sum, p) => sum + p.views, 0);
  const totalImpressions = (ads ?? []).reduce((s, a) => s + a.impressions, 0);
  const totalClicks = (ads ?? []).reduce((s, a) => s + a.clicks, 0);

  return { posts: posts ?? [], totalViews, totalImpressions, totalClicks };
}

export default async function AdminDashboard() {
  const { posts, totalViews, totalImpressions, totalClicks } = await getStats();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Lajme (30 fundit)" value={posts.length} />
        <StatCard label="Shikime gjithsej" value={totalViews} />
        <StatCard label="Shfaqje reklamash" value={totalImpressions} />
        <StatCard label="Klikime reklamash" value={totalClicks} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lajmet e fundit</h2>
          <Link
            href="/admin/posts/new"
            className="rounded bg-brand px-3 py-1.5 text-sm font-medium text-white"
          >
            + Lajm i ri
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 text-black/50">
              <tr>
                <th className="px-4 py-2">Titulli</th>
                <th className="px-4 py-2">Kategoria</th>
                <th className="px-4 py-2">Statusi</th>
                <th className="px-4 py-2">Shikime</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id} className="border-t border-black/5">
                  <td className="px-4 py-2 font-medium">{post.title}</td>
                  <td className="px-4 py-2 text-black/60">
                    {post.categories?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        post.status === "published"
                          ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-700"
                          : "rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700"
                      }
                    >
                      {post.status === "published" ? "publikuar" : "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{post.views}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-brand hover:underline"
                    >
                      Ndrysho
                    </Link>
                  </td>
                </tr>
              ))}
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-black/40">
                    Ende s'ke shkruar asnjë lajm.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-black/50">{label}</div>
    </div>
  );
}
