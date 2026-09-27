function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton animate-shimmer rounded-xl ${className}`} />;
}

export default function HomeLoading() {
  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Block className="aspect-[16/9] lg:col-span-2" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="aspect-[16/9]" />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr_300px]">
        <div className="hidden space-y-4 lg:block">
          <Block className="h-40" />
          <Block className="h-32" />
        </div>
        <div className="space-y-4">
          <Block className="h-6 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Block className="h-56" />
          <Block className="h-40" />
        </div>
      </div>
    </div>
  );
}
