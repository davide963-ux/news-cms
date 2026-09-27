"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { AD_SLOTS } from "@/lib/ad-slots";

export type AdFormValues = {
  advertiser_name?: string;
  image_url?: string;
  link_url?: string;
  active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  priority?: number;
  selectedSlots?: string[];
};

export default function AdForm({
  action,
  defaultValues,
  showActiveToggle = false,
}: {
  action: (formData: FormData) => void;
  defaultValues?: AdFormValues;
  showActiveToggle?: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url ?? "");
  const selectedSlots = new Set(defaultValues?.selectedSlots ?? []);

  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Emri i reklamuesit</label>
        <input
          name="advertiser_name"
          required
          defaultValue={defaultValues?.advertiser_name}
          className="w-full rounded border border-black/20 px-3 py-2"
          placeholder="p.sh. Blue Wave"
        />
      </div>

      <ImageUploader label="Banderola (imazhi)" folder="ads" onUploaded={setImageUrl} />
      <input type="hidden" name="image_url" value={imageUrl} />
      {defaultValues?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={defaultValues.image_url}
          alt=""
          className="h-20 rounded border border-black/10 object-cover"
        />
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Link ku çon reklama
        </label>
        <input
          name="link_url"
          required
          type="url"
          defaultValue={defaultValues?.link_url}
          className="w-full rounded border border-black/20 px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium">
          Ku shfaqet kjo reklamë
        </legend>
        {AD_SLOTS.map((slot) => (
          <label key={slot.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="slots"
              value={slot.value}
              defaultChecked={selectedSlots.has(slot.value)}
            />
            {slot.label}
          </label>
        ))}
      </fieldset>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Prioriteti (numër më i lartë = shfaqet i pari nëse ka disa reklama)
        </label>
        <input
          name="priority"
          type="number"
          defaultValue={defaultValues?.priority ?? 0}
          className="w-32 rounded border border-black/20 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Fillon (opsional)
          </label>
          <input
            name="starts_at"
            type="date"
            defaultValue={defaultValues?.starts_at ?? ""}
            className="w-full rounded border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Mbaron (opsional)
          </label>
          <input
            name="ends_at"
            type="date"
            defaultValue={defaultValues?.ends_at ?? ""}
            className="w-full rounded border border-black/20 px-3 py-2"
          />
        </div>
      </div>

      {showActiveToggle ? (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaultValues?.active ?? true}
          />
          Aktive
        </label>
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
