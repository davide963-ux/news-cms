import Link from "next/link";
import type { Category } from "@/lib/queries";
import SidebarPanel from "@/components/SidebarPanel";
import { TwitterIcon, TelegramIcon, DiscordIcon } from "@/components/icons";

export default function LeftSidebar({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-5">
      <SidebarPanel title="Categories">
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${category.slug}`}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-ink/80 transition hover:bg-soft hover:text-mint-bright"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      {/* No separate tags table in the schema yet — reusing categories as a
          lightweight "popular tags" strip until a real tag system exists. */}
      <SidebarPanel title="Popular Tags">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-mist transition hover:border-mint hover:text-mint-bright"
            >
              #{category.slug.replace(/-/g, "")}
            </Link>
          ))}
        </div>
      </SidebarPanel>

      <SidebarPanel title="Quick Navigation">
        <ul className="space-y-1.5 text-sm font-semibold">
          <li>
            <Link href="/" className="text-ink/80 hover:text-mint-bright">
              Home
            </Link>
          </li>
          <li>
            <Link href="/#latest-news" className="text-ink/80 hover:text-mint-bright">
              Latest News
            </Link>
          </li>
          <li>
            <Link href="/#editors-picks" className="text-ink/80 hover:text-mint-bright">
              Editor&apos;s Picks
            </Link>
          </li>
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Community">
        <div className="flex items-center gap-2">
          <a
            href="#"
            aria-label="X (Twitter)"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Telegram"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
          >
            <TelegramIcon className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Discord"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright"
          >
            <DiscordIcon className="h-4 w-4" />
          </a>
        </div>
      </SidebarPanel>
    </div>
  );
}
