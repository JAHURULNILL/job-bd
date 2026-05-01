import Link from "next/link";

import { getSourceChannelLabel } from "@/lib/jobs/source-channel";
import type { JobRecord } from "@/lib/jobs/types";
import { formatDateBn, formatDeadlineTag } from "@/lib/utils";

type JobCardProps = {
  job: JobRecord;
};

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
      {label}
    </span>
  );
}

export function JobCard({ job }: JobCardProps) {
  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{job.company}</p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {formatDeadlineTag(job.deadline)}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900">
        <Link href={`/jobs/${job.slug}`} className="transition group-hover:text-blue-700">
          {job.title}
        </Link>
      </h3>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>লোকেশন: {job.location}</p>
        <p>শেষ তারিখ: {formatDateBn(job.deadline)}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.education.map((item) => (
          <Badge key={item} label={item} />
        ))}
        <Badge label="No Experience" />
        <Badge label="Verified Source" />
        <Badge label={getSourceChannelLabel(job.sourceChannel)} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">{job.sourceName}</p>
        <Link
          href={`/jobs/${job.slug}`}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
        >
          বিস্তারিত দেখুন
        </Link>
      </div>
    </article>
  );
}
