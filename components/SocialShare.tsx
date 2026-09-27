"use client";

import { useState } from "react";
import { TwitterIcon, TelegramIcon, LinkIcon } from "@/components/icons";

export default function SocialShare({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard permission denied — not worth surfacing an error for */
    }
  }

  const buttonClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-mint hover:text-mint-bright";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-mist">
        Share
      </span>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={buttonClass}
      >
        <TwitterIcon className="h-4 w-4" />
      </a>
      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Telegram"
        className={buttonClass}
      >
        <TelegramIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className={buttonClass}
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      {copied ? (
        <span className="text-xs font-medium text-mint-bright">Copied!</span>
      ) : null}
    </div>
  );
}
