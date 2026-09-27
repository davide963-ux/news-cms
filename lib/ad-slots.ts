/** The ad slots the public site actually renders — keep in sync with the
 * <AdBanner slot="..."> calls in app/page.tsx and app/post/[slug]/page.tsx. */
export const AD_SLOTS = [
  { value: "homepage-top", label: "Homepage — top" },
  { value: "homepage-sidebar", label: "Homepage — sidebar" },
  { value: "article-inline", label: "Inside article" },
] as const;
