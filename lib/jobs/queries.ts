import { addDays, endOfDay, startOfDay } from "date-fns";

import { connectToDatabase } from "@/lib/db";
import { trustedSourceRegistry } from "@/lib/jobs/source-registry";
import type { JobRecord } from "@/lib/jobs/types";
import { JobModel } from "@/models/Job";

type JobSearchFilters = {
  q?: string;
  education?: string;
  experience?: string;
  location?: string;
  company?: string;
  companySlug?: string;
  deadline?: string;
  sourceChannel?: string;
};

function buildActiveJobQuery(filters: JobSearchFilters = {}) {
  const today = startOfDay(new Date());
  const query: Record<string, unknown> = {
    status: "active",
    deadline: { $gte: today },
  };

  if (filters.q) {
    query.$or = [
      { title: { $regex: filters.q, $options: "i" } },
      { company: { $regex: filters.q, $options: "i" } },
      { location: { $regex: filters.q, $options: "i" } },
      { summaryBn: { $regex: filters.q, $options: "i" } },
    ];
  }

  if (filters.education) {
    query.education = { $elemMatch: { $regex: filters.education, $options: "i" } };
  }

  if (filters.experience === "no-experience") {
    query.experience = {
      $elemMatch: {
        $regex:
          "No experience required|Freshers can apply|Zero year|Training provided|Experience not needed",
        $options: "i",
      },
    };
  }

  if (filters.location) {
    query.location = filters.location;
  }

  if (filters.company) {
    query.company = filters.company;
  }

  if (filters.companySlug) {
    query.companySlug = filters.companySlug;
  }

  if (filters.deadline === "soon") {
    query.deadline = {
      $gte: today,
      $lte: endOfDay(addDays(today, 7)),
    };
  }

  if (filters.sourceChannel) {
    query.sourceChannel = filters.sourceChannel;
  }

  return query;
}

export async function getLatestJobs(limit = 9) {
  const connection = await connectToDatabase();

  if (!connection) {
    return [] as JobRecord[];
  }

  return JobModel.find(buildActiveJobQuery())
    .sort({ updatedAt: -1, deadline: 1 })
    .limit(limit)
    .lean<JobRecord[]>();
}

export async function getActiveJobs(filters: JobSearchFilters = {}, limit?: number) {
  const connection = await connectToDatabase();

  if (!connection) {
    return [] as JobRecord[];
  }

  const query = JobModel.find(buildActiveJobQuery(filters)).sort({
    deadline: 1,
    updatedAt: -1,
  });

  if (limit) {
    query.limit(limit);
  }

  return query.lean<JobRecord[]>();
}

export async function getJobBySlug(slug: string) {
  const connection = await connectToDatabase();

  if (!connection) {
    return null;
  }

  return JobModel.findOne({
    slug,
    status: "active",
    deadline: { $gte: startOfDay(new Date()) },
  }).lean<JobRecord | null>();
}

export async function getCompanyDirectory() {
  const connection = await connectToDatabase();

  if (!connection) {
    return trustedSourceRegistry.map((source) => ({
      company: source.company,
      companySlug: source.companySlug,
      companyType: source.companyType,
      openJobs: 0,
      sourceName: source.sourceName,
    }));
  }

  const [jobCounts, sourceMap] = await Promise.all([
    JobModel.aggregate<{
      _id: string;
      company: string;
      companySlug: string;
      companyType: string;
      openJobs: number;
    }>([
      { $match: buildActiveJobQuery() },
      {
        $group: {
          _id: "$companySlug",
          company: { $first: "$company" },
          companySlug: { $first: "$companySlug" },
          companyType: { $first: "$companyType" },
          openJobs: { $sum: 1 },
        },
      },
      { $sort: { openJobs: -1, company: 1 } },
    ]),
    Promise.resolve(
      new Map(
        trustedSourceRegistry.map((source) => [
          source.companySlug,
          source.sourceName,
        ]),
      ),
    ),
  ]);

  const knownCompanies = new Map(
    trustedSourceRegistry.map((source) => [
      source.companySlug,
      {
        company: source.company,
        companySlug: source.companySlug,
        companyType: source.companyType,
        openJobs: 0,
        sourceName: source.sourceName,
      },
    ]),
  );

  jobCounts.forEach((entry) => {
    knownCompanies.set(entry.companySlug, {
      company: entry.company,
      companySlug: entry.companySlug,
      companyType: entry.companyType,
      openJobs: entry.openJobs,
      sourceName: sourceMap.get(entry.companySlug) || entry.company,
    });
  });

  return [...knownCompanies.values()].sort((a, b) => b.openJobs - a.openJobs || a.company.localeCompare(b.company));
}

export async function getFilterOptions() {
  const jobs = await getActiveJobs();

  const companies = [...new Set(jobs.map((job) => job.company))].sort();
  const locations = [...new Set(jobs.map((job) => job.location))].sort();
  const sourceChannels = [...new Set(jobs.map((job) => job.sourceChannel))].sort();

  return { companies, locations, sourceChannels };
}
