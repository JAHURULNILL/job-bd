import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { JobCard } from "@/components/job-card";
import { getActiveJobs } from "@/lib/jobs/queries";
import { getSourceByCompanySlug } from "@/lib/jobs/source-registry";
import { siteConfig } from "@/lib/site";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: CompanyPageProps) {
  const { slug } = await params;
  const source = getSourceByCompanySlug(slug);

  return {
    title: source
      ? `${source.company} Jobs | ${siteConfig.name}`
      : siteConfig.title,
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const source = getSourceByCompanySlug(slug);

  if (!source) {
    notFound();
  }

  const jobs = await getActiveJobs({ companySlug: slug });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
        <p className="text-sm font-semibold text-blue-700">{source.sourceName}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {source.company}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          এই পেজে {source.company}-এর official source থেকে পাওয়া active verified চাকরি
          দেখানো হয়।
        </p>
      </section>

      {jobs.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </section>
      ) : (
        <EmptyState
          title={`এই মুহূর্তে ${source.company}-এর কোনো verified SSC/HSC no experience job পাওয়া যায়নি।`}
        />
      )}
    </div>
  );
}
