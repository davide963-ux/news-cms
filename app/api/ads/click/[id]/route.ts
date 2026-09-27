import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * GET /api/ads/click/[id]
 * Every ad's <a href> points here instead of straight to the advertiser.
 * We increment the click counter, then 307-redirect the visitor on to the
 * real destination — so tracking never adds a visible delay or a "click
 * here to continue" interstitial.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ad, error } = await supabase
    .from("ads")
    .select("link_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !ad) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  await supabase.rpc("increment_ad_clicks", { p_ad_id: id });

  return NextResponse.redirect(ad.link_url, { status: 307 });
}
