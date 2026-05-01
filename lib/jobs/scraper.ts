import pLimit from "p-limit";
import { startOfDay } from "date-fns";

import { connectToDatabase } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { calculateConfidenceScore } from "@/lib/jobs/scoring";
import {
  getSourceById,
  trustedSourceRegistry,
} from "@/lib/jobs/source-registry";
import { evaluateDeadline, evaluateEducation, evaluateExperience } from "@/lib/jobs/filters";
import { createRawTextHash, shortHash } from "@/lib/jobs/hashing";
import { getActiveJobs } from "@/lib/jobs/queries";
import { buildBanglaSummary, APPLY_RULES_BN } from "@/lib/jobs/summarizer";
import { scrapeGenericOfficialCareer } from "@/lib/jobs/source-adapters/generic-official-career";
import { scrapeGovtPortalTable } from "@/lib/jobs/source-adapters/govt-portal-table";
import { scrapeLandingOnly } from "@/lib/jobs/source-adapters/landing-only";
import { scrapePathaoJobs } from "@/lib/jobs/source-adapters/pathao";
import type {
  JobRecord,
  ScrapedJobCandidate,
  SourceRegistryEntry,
  SyncRunSummary,
} from "@/lib/jobs/types";
import { isTrustedApplyUrl, isTrustedSourceUrl } from "@/lib/jobs/url";
import { JobModel } from "@/models/Job";
import { createSlug, normalizeWhitespace } from "@/lib/utils";

type NormalizedCandidate = JobRecord;

const env = getEnv();

const adapterMap = {
  pathaoWordPress: scrapePathaoJobs,
  genericOfficialCareer: scrapeGenericOfficialCareer,
  govtPortalTable: scrapeGovtPortalTable,
  landingOnly: scrapeLandingOnly,
} as const;

function dedupeCandidates(candidates: ScrapedJobCandidate[]) {
  const seen = new Set<string>();
  const uniqueCandidates: ScrapedJobCandidate[] = [];

  candidates.forEach((candidate) => {
    const key = [
      candidate.sourceUrl,
      candidate.applyUrl,
      createRawTextHash(candidate.rawText),
    ].join("|");

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    uniqueCandidates.push(candidate);
  });

  return uniqueCandidates;
}

function buildRejectionReasons(
  sourceTrusted: boolean,
  applyTrusted: boolean,
  deadlineResult: ReturnType<typeof evaluateDeadline>,
) {
  const reasons: string[] = [];

  if (!sourceTrusted) {
    reasons.push("Untrusted source URL");
  }

  if (!applyTrusted) {
    reasons.push("Suspicious or unsupported apply URL");
  }

  if (!deadlineResult.eligible) {
    reasons.push("Deadline is missing, invalid, or already expired");
  }

  return reasons;
}

function normalizeCandidate(
  candidate: ScrapedJobCandidate,
  source: SourceRegistryEntry,
): NormalizedCandidate {
  const sourceTrusted = isTrustedSourceUrl(candidate.sourceUrl, source);
  const applyUrl = candidate.applyUrl || candidate.sourceUrl;
  const applyTrusted = isTrustedApplyUrl(applyUrl, source);
  const combinedText = normalizeWhitespace(
    [
      candidate.title,
      candidate.educationText,
      candidate.experienceText,
      candidate.deadlineText,
      candidate.rawText,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const educationResult = evaluateEducation(combinedText);
  const experienceResult = evaluateExperience(combinedText);
  const deadlineResult = evaluateDeadline(candidate.deadlineText || combinedText);
  const confidenceScore = calculateConfidenceScore({
    trustedSource: sourceTrusted,
    trustedApplyUrl: applyTrusted,
    educationMatched: educationResult.matched.length,
    educationDisallowed: educationResult.disallowed.length,
    experienceMatched: experienceResult.matched.length,
    experienceDisallowed: experienceResult.disallowed.length,
    hasValidDeadline: deadlineResult.eligible,
  });
  const rejectionReasons = buildRejectionReasons(
    sourceTrusted,
    applyTrusted,
    deadlineResult,
  );
  const status = rejectionReasons.length === 0 ? "active" : "rejected";
  const deadline = deadlineResult.deadline || new Date(0);
  const jobSlugBase = `${candidate.title} ${candidate.company}`;
  const rawTextHash = createRawTextHash(combinedText);
  const slug = `${createSlug(jobSlugBase)}-${shortHash(candidate.sourceUrl || rawTextHash)}`;

  return {
    title: normalizeWhitespace(candidate.title),
    company: source.company,
    companySlug: source.companySlug,
    companyType: source.companyType,
    location: candidate.location || "বাংলাদেশ",
    education: educationResult.matched,
    experience: experienceResult.matched,
    deadline,
    salary: candidate.salary || null,
    jobType: candidate.jobType || null,
    sourceUrl: candidate.sourceUrl,
    applyUrl,
    sourceName: source.sourceName,
    sourceId: source.id,
    sourceChannel: source.sourceChannel,
    summaryBn: buildBanglaSummary({
      company: source.company,
      title: candidate.title,
      location: candidate.location || "বাংলাদেশ",
      deadline,
      education: educationResult.matched,
      experience: experienceResult.matched,
      jobType: candidate.jobType,
      salary: candidate.salary,
    }),
    applyRulesBn: APPLY_RULES_BN,
    rawTextHash,
    confidenceScore,
    verificationStatus: status === "active" ? "verified" : "rejected",
    slug,
    status,
    rejectionReasons,
  };
}

async function upsertJob(job: JobRecord) {
  const dedupeFilters = [
    { sourceUrl: job.sourceUrl },
    { applyUrl: job.applyUrl },
    { rawTextHash: job.rawTextHash },
  ];

  const existing = await JobModel.findOne({ $or: dedupeFilters })
    .select("_id slug")
    .lean<{ _id: string; slug: string } | null>();

  const payload = {
    ...job,
    slug: existing?.slug || job.slug,
  };

  if (existing?._id) {
    await JobModel.findByIdAndUpdate(existing._id, payload, { new: true });
    return payload;
  }

  await JobModel.create(payload);
  return payload;
}

async function crawlSource(source: SourceRegistryEntry) {
  const adapter = adapterMap[source.adapter];
  return adapter(source);
}

export async function runJobSync(): Promise<SyncRunSummary> {
  const connection = await connectToDatabase();

  if (!connection) {
    throw new Error("MONGODB_URI is required to run the job sync.");
  }

  const enabledSources = trustedSourceRegistry.filter((source) => source.enabled);
  const limit = pLimit(env.MAX_SCRAPE_CONCURRENCY);
  const errors: string[] = [];
  const crawledCandidates: ScrapedJobCandidate[] = [];

  const crawlResults = await Promise.allSettled(
    enabledSources.map((source) =>
      limit(async () => {
        const result = await crawlSource(source);
        crawledCandidates.push(...result);
      }),
    ),
  );

  crawlResults.forEach((result, index) => {
    if (result.status === "rejected") {
      const source = enabledSources[index];
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : "Unknown crawl error";
      errors.push(`${source.company}: ${message}`);
      logger.error({ source: source.id, err: result.reason }, "Source crawl failed");
    }
  });

  const normalizedCandidates = dedupeCandidates(crawledCandidates)
    .map((candidate) => {
      const source = getSourceById(candidate.sourceId);
      return source ? normalizeCandidate(candidate, source) : null;
    })
    .filter(Boolean) as NormalizedCandidate[];

  let activeJobs = 0;
  let rejectedJobs = 0;

  for (const job of normalizedCandidates) {
    await upsertJob(job);

    if (job.status === "active") {
      activeJobs += 1;
    } else {
      rejectedJobs += 1;
    }
  }

  const expiredResult = await JobModel.updateMany(
    {
      status: "active",
      deadline: { $lt: startOfDay(new Date()) },
    },
    {
      $set: { status: "expired" },
    },
  );

  logger.info(
    {
      crawledSources: enabledSources.length,
      totalCandidates: normalizedCandidates.length,
      activeJobs,
      rejectedJobs,
      expiredJobs: expiredResult.modifiedCount,
      errors,
    },
    "Job sync complete",
  );

  return {
    crawledSources: enabledSources.length,
    totalCandidates: normalizedCandidates.length,
    activeJobs,
    rejectedJobs,
    expiredJobs: expiredResult.modifiedCount,
    errors,
  };
}

export async function getPublicHealthSnapshot() {
  const activeJobs = await getActiveJobs({}, 100);
  return {
    activeJobs: activeJobs.length,
    sources: trustedSourceRegistry.length,
  };
}
