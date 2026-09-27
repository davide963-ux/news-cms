import { formatDate } from "@/lib/format";
import { AUTHOR_NAME } from "@/lib/site";

export default function Byline({
  publishedAt,
  views,
  readingMinutes,
  className = "",
}: {
  publishedAt: string | null;
  views?: number;
  readingMinutes?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-mist ${className}`}
    >
      <span className="font-semibold text-ink/80">{AUTHOR_NAME}</span>
      <span>·</span>
      <span>{formatDate(publishedAt)}</span>
      {readingMinutes ? (
        <>
          <span>·</span>
          <span>{readingMinutes} min read</span>
        </>
      ) : null}
      {typeof views === "number" ? (
        <>
          <span>·</span>
          <span>{views.toLocaleString("en-US")} views</span>
        </>
      ) : null}
    </div>
  );
}
