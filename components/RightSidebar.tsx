import type { PostSummary } from "@/lib/queries";
import type { CryptoTick } from "@/lib/crypto";
import SidebarPanel from "@/components/SidebarPanel";
import TrendingList from "@/components/TrendingList";
import MarketOverview from "@/components/MarketOverview";
import NewsletterBox from "@/components/NewsletterBox";
import AdBanner from "@/components/AdBanner";

export default function RightSidebar({
  trending,
  ticker,
}: {
  trending: PostSummary[];
  ticker: CryptoTick[];
}) {
  const majors = ticker.filter((t) => t.group === "major");
  const memes = ticker.filter((t) => t.group === "meme");

  return (
    <div className="space-y-5">
      <SidebarPanel title="Most Read">
        <TrendingList posts={trending} />
      </SidebarPanel>

      <SidebarPanel title="Market Overview">
        <MarketOverview ticks={majors} />
      </SidebarPanel>

      {memes.length > 0 ? (
        <SidebarPanel title="Trending Memecoins">
          <MarketOverview ticks={memes} />
        </SidebarPanel>
      ) : null}

      <NewsletterBox />

      <SidebarPanel title="Sponsored">
        <AdBanner slot="homepage-sidebar" className="aspect-square w-full" />
      </SidebarPanel>
    </div>
  );
}
