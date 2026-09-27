"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string, ignorePostId?: string) {
  const supabase = await createClient();
  let slug = slugify(base) || "lajme";
  let suffix = 1;

  // Keep trying candidate slugs until one isn't taken by another post.
  // Small dataset (a handful of posts a day), so a loop here is fine.
  while (true) {
    const query = supabase.from("posts").select("id").eq("slug", slug);
    const { data } = ignorePostId
      ? await query.neq("id", ignorePostId).maybeSingle()
      : await query.maybeSingle();

    if (!data) return slug;
    suffix += 1;
    slug = `${slugify(base)}-${suffix}`;
  }
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Titulli është i detyrueshëm");

  const slug = await uniqueSlug(title);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt: String(formData.get("excerpt") || "").trim() || null,
      body: String(formData.get("body") || ""),
      category_id: (formData.get("category_id") as string) || null,
      cover_image_url: (formData.get("cover_image_url") as string) || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/admin");
  redirect(`/admin/posts/${data.id}/edit`);
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Titulli është i detyrueshëm");

  const status = String(formData.get("status") || "draft");

  // Only stamp published_at the first time a post goes live, so re-saving
  // an already-published post doesn't bump it back to the top of the feed.
  const { data: existing } = await supabase
    .from("posts")
    .select("status, published_at, slug, title")
    .eq("id", postId)
    .single();

  const slug =
    existing && existing.title !== title
      ? await uniqueSlug(title, postId)
      : existing?.slug;

  const shouldStampPublishedAt =
    status === "published" && existing?.status !== "published";

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt: String(formData.get("excerpt") || "").trim() || null,
      body: String(formData.get("body") || ""),
      category_id: (formData.get("category_id") as string) || null,
      cover_image_url: (formData.get("cover_image_url") as string) || null,
      status,
      ...(shouldStampPublishedAt ? { published_at: new Date().toISOString() } : {}),
    })
    .eq("id", postId);

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
  if (slug) revalidatePath(`/post/${slug}`);
}

export async function deletePost(postId: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

// The last parameter is always the form's FormData — Next.js appends it
// automatically when a bound server action is used as a <form action>, even
// for deletePostImage below where nothing inside it is actually read.

export async function addPostImage(postId: string, formData: FormData) {
  const supabase = await createClient();
  const imageUrl = String(formData.get("image_url") || "");
  const caption = String(formData.get("caption") || "").trim();

  if (!imageUrl) return; // nothing uploaded yet, ignore the submit

  const { error } = await supabase.from("post_images").insert({
    post_id: postId,
    image_url: imageUrl,
    caption: caption || null,
  });
  if (error) throw error;

  revalidatePath(`/admin/posts/${postId}/edit`);
}

export async function deletePostImage(
  imageId: string,
  postId: string,
  _formData: FormData
) {
  const supabase = await createClient();
  const { error } = await supabase.from("post_images").delete().eq("id", imageId);
  if (error) throw error;

  revalidatePath(`/admin/posts/${postId}/edit`);
}
