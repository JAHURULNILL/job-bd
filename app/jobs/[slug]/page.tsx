import { notFound } from "next/navigation";

import { JobDetails } from "@/components/job-details";
import { getJobBySlug } from "@/lib/jobs/queries";
import { siteConfig } from "@/lib/site";

type JobDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: JobDetailsPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: siteConfig.title,
    };
  }

  return {
    title: `${job.title} | ${job.company} | ${siteConfig.name}`,
    description: job.summaryBn,
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JobDetails job={job} />
    </div>
  );
}
