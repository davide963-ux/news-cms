"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { addPostImage, deletePostImage } from "@/lib/actions/posts";
import type { PostImage } from "@/lib/queries";

export default function GalleryManager({
  postId,
  images,
}: {
  postId: string;
  images: PostImage[];
}) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const addImageBound = addPostImage.bind(null, postId);

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image) => {
            const deleteImageBound = deletePostImage.bind(null, image.id, postId);
            return (
              <div key={image.id} className="space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.image_url}
                  alt={image.caption ?? ""}
                  className="aspect-square w-full rounded object-cover"
                />
                <form action={deleteImageBound}>
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Fshi
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-black/40">Ende s'ka foto shtesë.</p>
      )}

      <form
        action={addImageBound}
        className="space-y-2 rounded border border-dashed border-black/20 p-3"
      >
        <ImageUploader label="Shto foto" folder="posts" onUploaded={setNewImageUrl} />
        <input type="hidden" name="image_url" value={newImageUrl} />
        <input
          type="text"
          name="caption"
          placeholder="Përshkrim (opsional)"
          className="w-full rounded border border-black/20 px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={!newImageUrl}
          className="rounded bg-black/80 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Shto në galeri
        </button>
      </form>
    </div>
  );
}
