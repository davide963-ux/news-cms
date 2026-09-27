"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AD_SLOTS } from "@/lib/ad-slots";

async function setPlacements(adId: string, formData: FormData) {
  const supabase = await createClient();
  const selectedSlots = formData.getAll("slots") as string[];
  const priority = Number(formData.get("priority") || 0);

  // Simplest consistent state: wipe this ad's placements and re-insert the
  // ones currently checked. Cheap because one ad has at most a few slots.
  await supabase.from("ad_placements").delete().eq("ad_id", adId);

  if (selectedSlots.length > 0) {
    const { error } = await supabase.from("ad_placements").insert(
      selectedSlots.map((slot_name) => ({ ad_id: adId, slot_name, priority }))
    );
    if (error) throw error;
  }
}

export async function createAd(formData: FormData) {
  const supabase = await createClient();

  const advertiser_name = String(formData.get("advertiser_name") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const link_url = String(formData.get("link_url") || "").trim();

  if (!advertiser_name || !image_url || !link_url) {
    throw new Error("Emri, imazhi dhe linku janë të detyrueshëm");
  }

  const starts_at = (formData.get("starts_at") as string) || null;
  const ends_at = (formData.get("ends_at") as string) || null;

  const { data, error } = await supabase
    .from("ads")
    .insert({ advertiser_name, image_url, link_url, starts_at, ends_at })
    .select("id")
    .single();

  if (error) throw error;

  await setPlacements(data.id, formData);

  revalidatePath("/admin/ads");
  revalidatePath("/");
  redirect("/admin/ads");
}

export async function updateAd(adId: string, formData: FormData) {
  const supabase = await createClient();

  const advertiser_name = String(formData.get("advertiser_name") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const link_url = String(formData.get("link_url") || "").trim();
  const active = formData.get("active") === "on";
  const starts_at = (formData.get("starts_at") as string) || null;
  const ends_at = (formData.get("ends_at") as string) || null;

  const { error } = await supabase
    .from("ads")
    .update({ advertiser_name, image_url, link_url, active, starts_at, ends_at })
    .eq("id", adId);

  if (error) throw error;

  await setPlacements(adId, formData);

  revalidatePath("/admin/ads");
  revalidatePath("/");
}

export async function deleteAd(adId: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("ads").delete().eq("id", adId);
  if (error) throw error;

  revalidatePath("/admin/ads");
  revalidatePath("/");
}
