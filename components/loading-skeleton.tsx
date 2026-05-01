export function LoadingSkeleton({
  cards = 6,
}: {
  cards?: number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6"
        >
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="mt-5 h-7 w-4/5 rounded-full bg-slate-200" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-2/3 rounded-full bg-slate-100" />
            <div className="h-4 w-1/2 rounded-full bg-slate-100" />
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 rounded-full bg-slate-100" />
            <div className="h-8 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
