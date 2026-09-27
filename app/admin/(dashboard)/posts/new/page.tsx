import PostForm from "@/components/admin/PostForm";
import { createPost } from "@/lib/actions/posts";
import { getCategories } from "@/lib/queries";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Lajm i ri</h1>
      <PostForm categories={categories} action={createPost} />
    </div>
  );
}
