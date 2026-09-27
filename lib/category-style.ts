/** Per-category accent color for badges — falls back to the site's default
 * mint accent for any category not in this list (so new/renamed categories
 * never break). */
const STYLES: Record<string, string> = {
  bitcoin: "bg-[#F2A65A]/15 text-[#F2A65A] border-[#F2A65A]/30",
  altcoins: "bg-[#6FA8DC]/15 text-[#6FA8DC] border-[#6FA8DC]/30",
  memecoins: "bg-[#E39BD6]/15 text-[#E39BD6] border-[#E39BD6]/30",
  "market-analysis": "bg-mint/15 text-mint-bright border-mint/30",
  guides: "bg-mist/15 text-mist border-mist/30",
};

const DEFAULT_STYLE = "bg-mint/15 text-mint-bright border-mint/30";

export function categoryBadgeClass(slug: string | undefined): string {
  if (!slug) return DEFAULT_STYLE;
  return STYLES[slug] ?? DEFAULT_STYLE;
}
