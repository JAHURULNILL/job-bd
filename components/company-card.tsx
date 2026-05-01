import Link from "next/link";

type CompanyCardProps = {
  company: string;
  companySlug: string;
  companyType: string;
  openJobs: number;
  sourceName: string;
};

export function CompanyCard({
  company,
  companySlug,
  companyType,
  openJobs,
  sourceName,
}: CompanyCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">{company}</p>
          <p className="mt-2 text-sm text-slate-500">{companyType}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {openJobs} Active Job{openJobs === 1 ? "" : "s"}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">
        Source: {sourceName}
      </p>

      <Link
        href={`/companies/${companySlug}`}
        className="mt-6 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
      >
        কোম্পানির চাকরি দেখুন
      </Link>
    </article>
  );
}
