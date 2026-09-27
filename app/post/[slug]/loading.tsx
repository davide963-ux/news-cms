function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton animate-shimmer rounded-xl ${className}`} />;
}

export default function PostLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
      <article className="space-y-6">
        <Block className="h-5 w-24" />
        <Block className="h-10 w-full" />
        <Block className="h-4 w-64" />
        <Block className="aspect-[16/9] w-full" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Block key={i} className="h-4 w-full" />
          ))}
        </div>
      </article>
      <aside className="space-y-4">
        <Block className="h-56" />
        <Block className="h-40" />
      </aside>
    </div>
  );
}
