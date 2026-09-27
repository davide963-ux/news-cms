import { categoryBadgeClass } from "@/lib/category-style";

export default function CategoryBadge({
  name,
  slug,
  className = "",
}: {
  name: string;
  slug?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${categoryBadgeClass(slug)} ${className}`}
    >
      {name}
    </span>
  );
}
