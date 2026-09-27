"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import type { Category } from "@/lib/queries";

export type PostFormValues = {
  title?: string;
  excerpt?: string | null;
  body?: string;
  category_id?: string | null;
  cover_image_url?: string | null;
  status?: string;
};

export default function PostForm({
  categories,
  action,
  defaultValues,
  showStatus = false,
}: {
  categories: Category[];
  action: (formData: FormData) => void;
  defaultValues?: PostFormValues;
  showStatus?: boolean;
}) {
  const [coverImageUrl, setCoverImageUrl] = useState(
    defaultValues?.cover_image_url ?? ""
  );

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Titulli</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded border border-black/20 px-3 py-2"
          placeholder="p.sh. Kryeministri firmosi marrëveshjen e re"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Kategoria</label>
        <select
          name="category_id"
          defaultValue={defaultValues?.category_id ?? ""}
          className="w-full rounded border border-black/20 px-3 py-2"
        >
          <option value="">— pa kategori —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Përmbledhje e shkurtër
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt ?? ""}
          className="w-full rounded border border-black/20 px-3 py-2"
          placeholder="Shfaqet nën titull në listat e lajmeve"
        />
      </div>

      <ImageUploader
        label="Foto kryesore"
        folder="posts"
        onUploaded={setCoverImageUrl}
      />
      <input type="hidden" name="cover_image_url" value={coverImageUrl} />

      <div>
        <label className="mb-1 block text-sm font-medium">Përmbajtja</label>
        <textarea
          name="body"
          required
          rows={14}
          defaultValue={defaultValues?.body}
          className="w-full rounded border border-black/20 px-3 py-2 font-mono text-sm"
          placeholder="Shkruaj lajmin këtu. Lër një rresht bosh mes paragrafëve."
        />
      </div>

      {showStatus ? (
        <div>
          <label className="mb-1 block text-sm font-medium">Statusi</label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "draft"}
            className="w-full rounded border border-black/20 px-3 py-2"
          >
            <option value="draft">Draft (jo publik)</option>
            <option value="published">Publikuar</option>
          </select>
        </div>
      ) : null}

      <button
        type="submit"
        className="rounded bg-brand px-4 py-2 font-medium text-white"
      >
        Ruaj
      </button>
    </form>
  );
}
