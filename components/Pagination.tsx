import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

export default function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4">
      <Link
        href={pageHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright ${page <= 1 ? "pointer-events-none opacity-30" : ""}`}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition ${
            p === page
              ? "border-mint bg-mint text-base"
              : "border-line text-ink hover:border-mint hover:text-mint-bright"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={pageHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright ${page >= totalPages ? "pointer-events-none opacity-30" : ""}`}
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </nav>
  );
}
