"use client";

import { SearchIcon } from "@/components/icons";

/** Visual-only — there's no search index/backend behind this yet, so
 * submitting is a no-op. Wire this to a real query (Postgres full-text
 * search on `posts`, or an external index) when you're ready. */
export default function SearchBox({ className = "" }: { className?: string }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 transition focus-within:border-mint ${className}`}
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-mist" />
      <input
        type="search"
        placeholder="Search news..."
        className="w-full bg-transparent text-sm text-ink placeholder:text-mist/60 focus:outline-none"
      />
    </form>
  );
}
