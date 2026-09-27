"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a chosen file straight to the "media" storage bucket from the
 * browser (using the logged-in admin's session, which storage RLS allows to
 * write), then reports back the public URL via onUploaded. Keeping upload
 * client-side avoids passing large file blobs through a Server Action.
 */
export default function ImageUploader({
  label,
  onUploaded,
  folder = "uploads",
}: {
  label: string;
  onUploaded: (url: string) => void;
  folder?: string;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const supabase = createClient();
    const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);

    setPreview(publicUrl);
    setStatus("idle");
    onUploaded(publicUrl);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-white"
      />
      {status === "uploading" ? (
        <p className="text-sm text-black/50">Duke ngarkuar...</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-600">Ngarkimi dështoi, provo përsëri.</p>
      ) : null}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Parashikim" className="h-32 rounded object-cover" />
      ) : null}
    </div>
  );
}
