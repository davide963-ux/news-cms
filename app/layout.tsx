import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Lajme Ditore",
  description: "Lajmet e fundit nga qyteti dhe vendi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Lajme Ditore";

  return (
    <html lang="sq">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <div className="border-b border-ink/10 bg-ink py-1.5 text-center text-[11px] font-medium uppercase tracking-wider text-white/60">
          {new Intl.DateTimeFormat("sq-AL", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </div>

        <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
            <Link
              href="/"
              className="shrink-0 text-2xl font-black uppercase tracking-tight text-ink"
            >
              <span className="text-brand">{siteName.slice(0, 1)}</span>
              {siteName.slice(1)}
            </Link>

            <nav className="no-scrollbar flex flex-1 items-center gap-5 overflow-x-auto text-[13px] font-bold uppercase tracking-wide text-ink/60">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="shrink-0 border-b-2 border-transparent py-1 transition hover:border-brand hover:text-brand"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-ink/10 bg-ink py-10">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-lg font-black uppercase tracking-tight text-white">
              <span className="text-brand">{siteName.slice(0, 1)}</span>
              {siteName.slice(1)}
            </p>
            <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wide text-white/50">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            <p className="mt-6 text-xs text-white/30">
              © {new Date().getFullYear()} {siteName}. Të gjitha të drejtat e
              rezervuara.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
