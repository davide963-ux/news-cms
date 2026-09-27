import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  views: number;
  categories: Category | null;
};

export type PostImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

export type PostDetail = PostSummary & {
  body: string;
  post_images: PostImage[];
  status?: string;
};

export type Ad = {
  id: string;
  advertiser_name: string;
  image_url: string;
  link_url: string;
};

/** All categories, for the nav bar. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

/** Latest published posts, newest first, with pagination. */
export async function getLatestPosts(
  limit = 20,
  offset = 0
): Promise<{ posts: PostSummary[]; total: number }> {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { posts: (data as any) ?? [], total: count ?? 0 };
}

/** Published posts in one category, newest first, with pagination. */
export async function getPostsByCategory(
  categorySlug: string,
  limit = 30,
  offset = 0
): Promise<{ category: Category | null; posts: PostSummary[]; total: number }> {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) return { category: null, posts: [], total: 0 };

  const { data, error, count } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)",
      { count: "exact" }
    )
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { category, posts: (data as any) ?? [], total: count ?? 0 };
}

/** Most-viewed published posts — powers "Trending" / "Most Read" widgets. */
export async function getTrendingPosts(limit = 5): Promise<PostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)"
    )
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as any) ?? [];
}

/** One published post by slug, with its gallery images. */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, body, cover_image_url, published_at, views, categories(id, name, slug), post_images(id, image_url, caption)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data as any;
}

/** Other published posts in the same category — for the article page's
 * "Related Articles" section. */
export async function getRelatedPosts(
  categoryId: string | undefined,
  excludePostId: string,
  limit = 4
): Promise<PostSummary[]> {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)"
    )
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludePostId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as any) ?? [];
}

/** The published post immediately before/after this one by publish date —
 * for the article page's Previous/Next navigation. */
export async function getAdjacentPosts(
  publishedAt: string | null
): Promise<{ prev: PostSummary | null; next: PostSummary | null }> {
  if (!publishedAt) return { prev: null, next: null };
  const supabase = await createClient();

  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)"
      )
      .eq("status", "published")
      .lt("published_at", publishedAt)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, published_at, views, categories(id, name, slug)"
      )
      .eq("status", "published")
      .gt("published_at", publishedAt)
      .order("published_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return { prev: (prevData as any) ?? null, next: (nextData as any) ?? null };
}

/**
 * Best ad for a slot right now: active ads whose optional date range covers
 * today, highest placement priority first. Ad counts per slot are small
 * (a handful), so filtering the date range in JS after the fetch is simpler
 * and more reliable than fighting PostgREST's embedded-resource filter syntax.
 */
export async function getAdForSlot(slotName: string): Promise<Ad | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("ad_placements")
    .select(
      "priority, ads!inner(id, advertiser_name, image_url, link_url, active, starts_at, ends_at)"
    )
    .eq("slot_name", slotName)
    .eq("ads.active", true)
    .order("priority", { ascending: false });

  if (error) throw error;

  const candidate = (data as any[] | null)?.find(({ ads }) => {
    const startsOk = !ads.starts_at || ads.starts_at <= today;
    const endsOk = !ads.ends_at || ads.ends_at >= today;
    return startsOk && endsOk;
  });

  if (!candidate) return null;

  const ad = candidate.ads;
  return {
    id: ad.id,
    advertiser_name: ad.advertiser_name,
    image_url: ad.image_url,
    link_url: ad.link_url,
  };
}

export async function incrementPostViews(postId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_post_views", { p_post_id: postId });
}

export async function incrementAdImpressions(adId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_ad_impressions", { p_ad_id: adId });
}

/**
 * Fetch a post by id regardless of status (draft included) — for the admin
 * editor only. Bypasses the "published only" restriction that
 * getPostBySlug applies for the public site.
 */
export async function getPostForAdmin(postId: string): Promise<PostDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, body, cover_image_url, published_at, views, status, categories(id, name, slug), post_images(id, image_url, caption)"
    )
    .eq("id", postId)
    .maybeSingle();

  if (error) throw error;
  return data as any;
}
