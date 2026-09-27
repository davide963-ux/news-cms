export type CryptoTick = {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
};

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "solana", symbol: "SOL" },
  { id: "ripple", symbol: "XRP" },
  { id: "dogecoin", symbol: "DOGE" },
];

/**
 * Live prices for the header ticker, from CoinGecko's public API (no key
 * needed). Cached by Next.js for 60s so we never call the origin more than
 * once a minute regardless of traffic. Never throws — every page in the app
 * renders through the root layout, so a flaky price API must degrade to an
 * empty ticker, not a 500.
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
      price: data[coin.id]?.usd ?? 0,
      change24h: data[coin.id]?.usd_24h_change ?? 0,
    })).filter((tick) => tick.price > 0);
  } catch {
    return [];
  }
}

export function formatCryptoPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 1 ? 2 : 4,
  }).format(price);
}
