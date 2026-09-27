export type CryptoTick = {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
  group: "major" | "meme";
};

const COINS: { id: string; symbol: string; group: "major" | "meme" }[] = [
  { id: "bitcoin", symbol: "BTC", group: "major" },
  { id: "ethereum", symbol: "ETH", group: "major" },
  { id: "binancecoin", symbol: "BNB", group: "major" },
  { id: "solana", symbol: "SOL", group: "major" },
  { id: "ripple", symbol: "XRP", group: "major" },
  { id: "dogecoin", symbol: "DOGE", group: "meme" },
  { id: "shiba-inu", symbol: "SHIB", group: "meme" },
  { id: "pepe", symbol: "PEPE", group: "meme" },
];

/**
 * Live prices for the header ticker and the "Market Overview" / "Trending
 * Memecoins" sidebar widgets, from CoinGecko's public API (no key needed).
 * Cached by Next.js for 60s so we never call the origin more than once a
 * minute regardless of traffic. Never throws — every page in the app renders
 * through the root layout, so a flaky price API must degrade to an empty
 * ticker, not a 500.
 */
export async function getCryptoTicker(): Promise<CryptoTick[]> {
  try {
    const ids = COINS.map((c) => c.id).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return [];

    const data: Record<string, { usd?: number; usd_24h_change?: number }> =
      await res.json();

    return COINS.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      group: coin.group,
      price: data[coin.id]?.usd ?? 0,
      change24h: data[coin.id]?.usd_24h_change ?? 0,
    })).filter((tick) => tick.price > 0);
  } catch {
    return [];
  }
}

export function formatCryptoPrice(price: number): string {
  const decimals = price >= 1 ? 2 : price >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}
