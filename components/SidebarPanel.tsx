export default function SidebarPanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-panel p-4 ${className}`}>
      <h2 className="mb-3 border-b border-line pb-2 text-xs font-black uppercase tracking-widest text-mint-bright">
        {title}
      </h2>
      {children}
    </div>
  );
}
