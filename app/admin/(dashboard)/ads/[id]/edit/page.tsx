import { notFound } from "next/navigation";
import AdForm from "@/components/admin/AdForm";
import { updateAd, deleteAd } from "@/lib/actions/ads";
import { createClient } from "@/lib/supabase/server";

export default async function EditAdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: ad }, { data: placements }] = await Promise.all([
    supabase.from("ads").select("*").eq("id", id).maybeSingle(),
    supabase.from("ad_placements").select("slot_name, priority").eq("ad_id", id),
  ]);

  if (!ad) notFound();

  const updateAdBound = updateAd.bind(null, id);
  const deleteAdBound = deleteAd.bind(null, id);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Ndrysho reklamën</h1>

      <AdForm
        action={updateAdBound}
        showActiveToggle
        defaultValues={{
          ...ad,
          selectedSlots: (placements ?? []).map((p) => p.slot_name),
          priority: placements?.[0]?.priority ?? 0,
        }}
      />

      <section className="max-w-xl border-t border-black/10 pt-6">
        <form action={deleteAdBound}>
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Fshi këtë reklamë përgjithmonë
          </button>
        </form>
      </section>
    </div>
  );
}
