import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCategories, getLatestPosts } from "@/lib/queries";
import { getCryptoTicker, formatCryptoPrice } from "@/lib/crypto";
import BreakingTicker from "@/components/BreakingTicker";
import SearchBox from "@/components/SearchBox";
import { TwitterIcon, TelegramIcon, DiscordIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "CryptoWire",
  description: "Breaking crypto news, market analysis, and guides.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, latest, ticker] = await Promise.all([
    getCategories(),
    getLatestPosts(6, 0),
    getCryptoTicker(),
  ]);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "CryptoWire";
  const majors = ticker.filter((t) => t.group === "major");

  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-ink antialiased">
        {/* Utility bar: live spot prices. Not sticky — scrolls away, the
            header + breaking ticker below it stay pinned. */}
        {majors.length > 0 ? (
          <div className="no-scrollbar flex items-center gap-4 overflow-x-auto border-b border-line bg-soft px-4 py-1.5 text-[11px] font-medium">
            {majors.map((coin) => {
              const up = coin.change24h >= 0;
              return (
                <span key={coin.id} className="flex shrink-0 items-center gap-1.5">
                  <span className="font-bold text-ink">{coin.symbol}</span>
                  <span className="tabular-nums text-mist">
                    {formatCryptoPrice(coin.price)}
                  </span>
                  <span
                    className={`tabular-nums font-semibold ${up ? "text-mint-bright" : "text-red-400"}`}
                  >
                    {up ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        ) : null}

        <div className="sticky top-0 z-50">
          <header className="border-b border-line bg-base/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
              <Link
                href="/"
                className="shrink-0 text-xl font-black uppercase tracking-tight text-ink"
              >
                <span className="text-mint-bright">{siteName.slice(0, 1)}</span>
                {siteName.slice(1)}
              </Link>

              <nav className="no-scrollbar hidden flex-1 items-center gap-5 overflow-x-auto text-[13px] font-bold uppercase tracking-wide text-ink/60 md:flex">
                <Link href="/" className="shrink-0 transition hover:text-mint-bright">
                  Home
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/kategori/${category.slug}`}
                    className="shrink-0 border-b-2 border-transparent py-1 transition hover:border-mint hover:text-mint-bright"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-3">
                <SearchBox className="hidden w-48 lg:flex" />
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright sm:flex"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Telegram"
                  className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright sm:flex"
                >
                  <TelegramIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Discord"
                  className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright sm:flex"
                >
                  <DiscordIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Category nav, mobile only (desktop shows it inline above). */}
            <nav className="no-scrollbar flex items-center gap-5 overflow-x-auto border-t border-line px-4 py-2 text-[13px] font-bold uppercase tracking-wide text-ink/60 md:hidden">
              <Link href="/" className="shrink-0 hover:text-mint-bright">
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="shrink-0 hover:text-mint-bright"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </header>

          <BreakingTicker posts={latest.posts} />
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-line bg-soft py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-lg font-black uppercase tracking-tight text-ink">
                <span className="text-mint-bright">{siteName.slice(0, 1)}</span>
                {siteName.slice(1)}
              </p>
              <p className="mt-3 text-sm text-mist">
                Independent crypto news, market analysis, and guides.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Telegram"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
                >
                  <TelegramIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Discord"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
                >
                  <DiscordIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-mint-bright">
                Categories
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-mist">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/kategori/${category.slug}`}
                      className="hover:text-ink"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-mint-bright">
                Company
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-mist">
                <li><Link href="/" className="hover:text-ink">About</Link></li>
                <li><Link href="/" className="hover:text-ink">Contact</Link></li>
                <li><Link href="/" className="hover:text-ink">Advertise</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-mint-bright">
                Legal
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-mist">
                <li><Link href="/" className="hover:text-ink">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-ink">Terms of Use</Link></li>
                <li><Link href="/" className="hover:text-ink">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl border-t border-line px-4 pt-6 text-xs text-mist">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Not
            financial advice.
          </div>
        </footer>
      </body>
    </html>
  );
}
