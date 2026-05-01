type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "এই মুহূর্তে কোনো verified SSC/HSC no experience job পাওয়া যায়নি। পরে আবার দেখুন।",
  description = "শুধুমাত্র trusted source থেকে eligibility clear হলে job প্রকাশ করা হয়।",
}: EmptyStateProps) {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-[0_12px_32px_rgba(15,23,42,0.03)]">
      <p className="mx-auto max-w-2xl text-lg font-semibold leading-8 text-slate-900">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
