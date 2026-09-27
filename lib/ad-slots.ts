/** The ad slots the public site actually renders — keep in sync with the
 * <AdBanner slot="..."> calls in app/page.tsx and app/post/[slug]/page.tsx. */
export const AD_SLOTS = [
  { value: "homepage-top", label: "Faqja kryesore — lart" },
  { value: "homepage-sidebar", label: "Faqja kryesore — anash" },
  { value: "article-inline", label: "Brenda artikullit" },
] as const;
