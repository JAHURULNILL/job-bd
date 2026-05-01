import { EmptyState } from "@/components/empty-state";
import { FilterChips } from "@/components/filter-chips";
import { JobCard } from "@/components/job-card";
import { SearchBar } from "@/components/search-bar";
import { getActiveJobs, getFilterOptions } from "@/lib/jobs/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: `সব verified job | ${siteConfig.name}`,
  description:
    "বাংলাদেশের trusted source থেকে সংগ্রহ করা active verified job list, যেখানে search ও filter ব্যবহার করা যায়।",
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const q =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const education =
    typeof resolvedSearchParams.education === "string"
      ? resolvedSearchParams.education
      : undefined;
  const experience =
    typeof resolvedSearchParams.experience === "string"
      ? resolvedSearchParams.experience
      : undefined;
  const location =
    typeof resolvedSearchParams.location === "string"
      ? resolvedSearchParams.location
      : undefined;
  const company =
    typeof resolvedSearchParams.company === "string"
      ? resolvedSearchParams.company
      : undefined;
  const deadline =
    typeof resolvedSearchParams.deadline === "string"
      ? resolvedSearchParams.deadline
      : undefined;
  const sourceChannel =
    typeof resolvedSearchParams.sourceChannel === "string"
      ? resolvedSearchParams.sourceChannel
      : undefined;

  const [jobs, filterOptions] = await Promise.all([
    getActiveJobs({
      q,
      education,
      experience,
      location,
      company,
      deadline,
      sourceChannel,
    }),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-700">All Active Jobs</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            trusted source থেকে verified active job
          </h1>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            এখানে trusted source থেকে পাওয়া active job দেখানো হয়। SSC, HSC, No Experience,
            company, location এবং source type filter ব্যবহার করে প্রয়োজনমতো shortlist করতে পারবেন।
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <SearchBar action="/jobs" query={q} />
          <FilterChips pathname="/jobs" searchParams={resolvedSearchParams} />
        </div>

        <form
          action="/jobs"
          className="mt-6 grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.1fr_1fr_1fr_1fr_1fr_auto]"
        >
          <input type="hidden" name="q" value={q} />
          <select
            name="education"
            defaultValue={education || ""}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="">Education</option>
            <option value="SSC">SSC</option>
            <option value="HSC">HSC</option>
          </select>

          <select
            name="location"
            defaultValue={location || ""}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="">Location</option>
            {filterOptions.locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="company"
            defaultValue={company || ""}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="">Company</option>
            {filterOptions.companies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="sourceChannel"
            defaultValue={sourceChannel || ""}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="">Source Type</option>
            <option value="career">Career Source</option>
            <option value="verified-board">Other Verified Source</option>
          </select>

          <select
            name="deadline"
            defaultValue={deadline || ""}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="">Deadline</option>
            <option value="soon">Deadline Soon</option>
          </select>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Apply Filter
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {jobs.length}টি active verified job পাওয়া গেছে
          </p>
        </div>

        {jobs.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}
