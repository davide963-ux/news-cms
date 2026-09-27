import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-4 border-b border-black/10 pb-4 text-sm font-medium">
        <Link href="/admin" className="hover:text-brand">
          Paneli
        </Link>
        <Link href="/admin/posts/new" className="hover:text-brand">
          Lajm i ri
        </Link>
        <Link href="/admin/ads" className="hover:text-brand">
          Reklamat
        </Link>
        <Link href="/" className="hover:text-brand" target="_blank">
          Shiko faqen
        </Link>
        <form action={signOut} className="ml-auto">
          <button type="submit" className="text-black/50 hover:text-brand">
            Dil
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
