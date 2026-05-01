import type { JobRecord } from "@/lib/jobs/types";
import { getSourceChannelLabelBn } from "@/lib/jobs/source-channel";
import { formatDateBn } from "@/lib/utils";

type JobDetailsProps = {
  job: JobRecord;
};

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-700">{value}</p>
    </div>
  );
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-blue-700">{job.company}</p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span>{job.location}</span>
              <span>শেষ তারিখ: {formatDateBn(job.deadline)}</span>
              <span>{job.sourceName}</span>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6">
            <p className="text-sm leading-8 text-slate-700">{job.summaryBn}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailBlock
            label="Education"
            value={job.education.join(", ") || "উল্লেখ নেই"}
          />
          <DetailBlock
            label="Experience"
            value={job.experience.join(", ") || "উল্লেখ নেই"}
          />
          <DetailBlock label="Location" value={job.location} />
          <DetailBlock label="Deadline" value={formatDateBn(job.deadline)} />
          <DetailBlock
            label="Source Type"
            value={getSourceChannelLabelBn(job.sourceChannel)}
          />
          <DetailBlock label="Job Type" value={job.jobType || "উল্লেখ নেই"} />
          <DetailBlock label="Salary" value={job.salary || "উল্লেখ নেই"} />
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
          <p className="text-lg font-semibold text-slate-900">আবেদনের নিয়ম</p>
          <p className="mt-4 text-sm leading-8 text-slate-700">{job.applyRulesBn}</p>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            সতর্কতা: শুধুমাত্র অফিসিয়াল source/apply link ব্যবহার করে আবেদন করুন।
          </p>
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Deadline
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDateBn(job.deadline)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Source
              </p>
              <p className="mt-2 text-sm text-slate-700">{job.sourceName}</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Verified Source
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Now
            </a>

            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Original Source
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
