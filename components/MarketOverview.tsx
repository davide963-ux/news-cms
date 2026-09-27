import type { CryptoTick } from "@/lib/crypto";
import { formatCryptoPrice } from "@/lib/crypto";

export default function MarketOverview({ ticks }: { ticks: CryptoTick[] }) {
  if (ticks.length === 0) {
    return <p className="text-sm text-mist">Prices unavailable right now.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {ticks.map((coin) => {
        const up = coin.change24h >= 0;
        return (
          <li key={coin.id} className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-ink">{coin.symbol}</span>
            <span className="flex items-center gap-2 tabular-nums">
              <span className="text-sm text-ink/90">
                {formatCryptoPrice(coin.price)}
              </span>
              <span
                className={`text-xs font-semibold ${up ? "text-mint-bright" : "text-red-400"}`}
              >
                {up ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
