import { getAdForSlot, incrementAdImpressions } from "@/lib/queries";

/**
 * Server component: fetches the highest-priority active ad for a slot,
 * counts the impression (this render = one view of the banner), and renders
 * it as a plain <img> wrapped in a link to our click-tracking redirect route
 * (so a click increments `ads.clicks` before sending the visitor onward).
 *
 * Renders nothing if no ad is scheduled for this slot right now — callers
 * don't need to special-case an empty slot.
 */
export default async function AdBanner({
  slot,
  className,
}: {
  slot: string;
  className?: string;
}) {
  const ad = await getAdForSlot(slot);
  if (!ad) return null;

  // Fire-and-forget: don't block rendering on the counter write.
  incrementAdImpressions(ad.id).catch(() => {
    /* impression counts are best-effort, never worth failing a page over */
  });

  return (
    <a
      href={`/api/ads/click/${ad.id}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block overflow-hidden rounded-lg border border-black/10 bg-white ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.image_url}
        alt={ad.advertiser_name}
        className="h-full w-full object-cover"
      />
      <span className="block px-2 py-1 text-center text-[10px] uppercase tracking-wide text-black/40">
        Reklamë
      </span>
    </a>
  );
}
