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

  return (
    <html lang="sq">
      <body className="min-h-screen">
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
            <Link href="/" className="text-xl font-bold text-brand">
              {process.env.NEXT_PUBLIC_SITE_NAME || "Lajme Ditore"}
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm font-medium text-black/70">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="hover:text-brand"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-black/10 py-8 text-center text-sm text-black/40">
          © {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_SITE_NAME || "Lajme Ditore"}
        </footer>
      </body>
    </html>
  );
}
