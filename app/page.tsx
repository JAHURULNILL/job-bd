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
            শুধুমাত্র trusted source থেকে verified job
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            SSC/HSC pass এবং no experience চাকরি খুঁজুন, একদম clean ও trusted way-এ
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            HSC Jobs BD শুধু সেই চাকরি দেখায় যেখানে eligibility স্পষ্ট, source
            official, apply link real, এবং fresher candidate আবেদন করতে পারে।
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
              নতুন verified চাকরি
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
              প্রতিদিন নির্ধারিত cron run official source page crawl করে। এরপর title,
              company, location, deadline, education, experience, apply link বিশ্লেষণ
              করে।
            </p>
            <p>
              SSC/HSC বা equivalent level এবং no experience/fresher eligibility
              স্পষ্ট না হলে job reject হয়ে যায়। Bachelor, Masters, Honours বা 1+
              year experience লাগলে job কখনো publish হয় না।
            </p>
            <p>
              public page-এ শুধু active verified job থাকে। expired job
              automatically hide হয়ে যায়।
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-8 text-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-blue-200">SEO Content</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            বাংলাদেশে SSC/HSC pass no experience job খোঁজার trusted জায়গা
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-300">
            HSC Jobs BD তাদের জন্য তৈরি, যারা SSC pass jobs in Bangladesh, HSC pass
            jobs, fresher jobs, entry level jobs, এবং no experience jobs খুঁজছেন।
            এখানে প্রতিটি job-এর সাথে original source link দেওয়া থাকে।
          </p>
        </div>
      </section>
    </div>
  );
}
