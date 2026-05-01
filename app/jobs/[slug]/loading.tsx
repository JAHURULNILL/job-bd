export default function JobDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-8">
            <div className="h-4 w-28 rounded-full bg-slate-200" />
            <div className="mt-5 h-10 w-3/4 rounded-full bg-slate-200" />
            <div className="mt-4 h-4 w-2/3 rounded-full bg-slate-100" />
            <div className="mt-8 h-36 rounded-3xl bg-slate-100" />
          </div>
        </div>
        <div className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="h-4 w-20 rounded-full bg-slate-200" />
          <div className="mt-4 h-8 w-40 rounded-full bg-slate-100" />
          <div className="mt-6 h-12 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
