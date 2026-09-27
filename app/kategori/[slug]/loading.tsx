function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton animate-shimmer rounded-xl ${className}`} />;
}

export default function CategoryLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr_300px]">
      <div className="hidden space-y-4 lg:block">
        <Block className="h-40" />
      </div>
      <div className="space-y-5">
        <Block className="h-8 w-40" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Block key={i} className="aspect-[16/9]" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Block className="h-56" />
        <Block className="h-40" />
      </div>
    </div>
  );
}
