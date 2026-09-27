import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdsListPage() {
  const supabase = await createClient();
  const { data: ads } = await supabase
    .from("ads")
    .select("id, advertiser_name, active, impressions, clicks, image_url")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reklamat</h1>
        <Link
          href="/admin/ads/new"
          className="rounded bg-brand px-3 py-1.5 text-sm font-medium text-white"
        >
          + Reklamë e re
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-black/50">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Reklamuesi</th>
              <th className="px-4 py-2">Statusi</th>
              <th className="px-4 py-2">Shfaqje</th>
              <th className="px-4 py-2">Klikime</th>
              <th className="px-4 py-2">CTR</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(ads ?? []).map((ad) => {
              const ctr =
                ad.impressions > 0
                  ? ((ad.clicks / ad.impressions) * 100).toFixed(1) + "%"
                  : "—";
              return (
                <tr key={ad.id} className="border-t border-black/5">
                  <td className="px-4 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.image_url}
                      alt=""
                      className="h-10 w-16 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{ad.advertiser_name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        ad.active
                          ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-700"
                          : "rounded bg-black/10 px-2 py-0.5 text-xs text-black/50"
                      }
                    >
                      {ad.active ? "aktive" : "joaktive"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{ad.impressions}</td>
                  <td className="px-4 py-2">{ad.clicks}</td>
                  <td className="px-4 py-2">{ctr}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/ads/${ad.id}/edit`}
                      className="text-brand hover:underline"
                    >
                      Ndrysho
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(ads ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-black/40">
                  Ende s'ke shtuar asnjë reklamë.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
