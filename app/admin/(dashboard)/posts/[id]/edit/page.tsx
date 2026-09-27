import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import GalleryManager from "@/components/admin/GalleryManager";
import { updatePost, deletePost } from "@/lib/actions/posts";
import { getCategories, getPostForAdmin } from "@/lib/queries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, post] = await Promise.all([
    getCategories(),
    getPostForAdmin(id),
  ]);

  if (!post) notFound();

  const updatePostBound = updatePost.bind(null, id);
  const deletePostBound = deletePost.bind(null, id);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ndrysho lajmin</h1>
        {post.slug ? (
          <a
            href={`/post/${post.slug}`}
            target="_blank"
            className="text-sm text-brand hover:underline"
          >
            Shiko lajmin →
          </a>
        ) : null}
      </div>

      <PostForm
        categories={categories}
        action={updatePostBound}
        defaultValues={post}
        showStatus
      />

      <section className="max-w-2xl space-y-3 border-t border-black/10 pt-6">
        <h2 className="text-lg font-semibold">Galeria e fotove</h2>
        <GalleryManager postId={id} images={post.post_images} />
      </section>

      <section className="max-w-2xl border-t border-black/10 pt-6">
        <form action={deletePostBound}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Fshi këtë lajm përgjithmonë
          </button>
        </form>
      </section>
    </div>
  );
}
