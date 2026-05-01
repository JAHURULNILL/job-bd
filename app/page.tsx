import Link from "next/link";

import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { FilterChips } from "@/components/filter-chips";
import { JobCard } from "@/components/job-card";
import { SearchBar } from "@/components/search-bar";
import { getCompanyDirectory, getLatestJobs } from "@/lib/jobs/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [jobs, companies] = await Promise.all([
    getLatestJobs(9),
    getCompanyDirectory(),
  ]);

  const featuredCompanies = companies.slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-[36px] border border-slate-200 bg-white px-6 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:px-10 sm:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            trusted source থেকে verified active job
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            বাংলাদেশের trusted source থেকে publish হওয়া চাকরি এক জায়গায় দেখুন
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            HSC Jobs BD এখন trusted company career page এবং verified job source থেকে active job সংগ্রহ করে।
            SSC, HSC, No Experience বা Deadline Soon filter ব্যবহার করে প্রয়োজনমতো job আলাদা করে দেখতে পারবেন।
          </p>
        </div>

        <div className="mt-8 max-w-4xl space-y-4">
          <SearchBar action="/jobs" />
          <FilterChips pathname="/jobs" searchParams={{}} />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Latest Jobs</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              নতুন verified job
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            সব চাকরি দেখুন
          </Link>
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

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-blue-700">Trusted Companies</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            verified source registry
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.companySlug} {...company} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
          <p className="text-sm font-semibold text-blue-700">কীভাবে কাজ করে</p>
          <div className="mt-4 space-y-4 text-sm leading-8 text-slate-600">
            <p>
              প্রতিদিন cron run trusted source page crawl করে। এরপর title, company,
              location, deadline, education, experience এবং apply link extract করা হয়।
            </p>
            <p>
              deadline valid থাকলে এবং source/apply link trusted হলে job public page-এ
              দেখানো হয়। SSC, HSC, No Experience-এর মতো criteria filter হিসেবে আলাদা
              করে ব্যবহার করা যায়।
            </p>
            <p>
              public page-এ শুধু active verified job থাকে। expired job automatically
              hide হয়ে যায়।
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-8 text-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-blue-200">SEO Content</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Bangladesh verified job source aggregator
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-300">
            এখানে trusted source থেকে publish হওয়া চাকরির সাথে original source link দেওয়া
            থাকে। search এবং filter ব্যবহার করে SSC pass jobs, HSC pass jobs,
            fresher jobs, no experience jobs বা company-wise jobs আলাদা করে দেখা যায়।
          </p>
        </div>
      </section>
    </div>
  );
}
