import { compactStrings } from "@/lib/jobs/text";
import { extractJsonLdBlocks, findJobPostingJsonLd } from "@/lib/jobs/extractors";
import { fetchCheerio } from "@/lib/jobs/fetcher";
import type { ScrapedJobCandidate, SourceRegistryEntry } from "@/lib/jobs/types";
import { toAbsoluteUrl } from "@/lib/jobs/url";
import { normalizeWhitespace } from "@/lib/utils";

async function scrapePathaoDetail(
  detailUrl: string,
  source: SourceRegistryEntry,
): Promise<ScrapedJobCandidate | null> {
  const $ = await fetchCheerio(detailUrl, source);
  const blocks = extractJsonLdBlocks($);
  const jobPosting = findJobPostingJsonLd(blocks);

  const title =
    normalizeWhitespace(jobPosting?.title || $("h1").first().text()) || "";
  const contentText = normalizeWhitespace($(".awsm-job-content").text());
  const location = normalizeWhitespace(
    $(".awsm-job-specification-job-location .awsm-job-specification-term")
      .first()
      .text(),
  );
  const jobType = normalizeWhitespace(
    $(".awsm-job-specification-job-type .awsm-job-specification-term")
      .first()
      .text(),
  );
  const applyUrl =
    $(".awsm-job-content a[href]").last().attr("href") || detailUrl;

  if (!title || !contentText) {
    return null;
  }

  const rawText = compactStrings([
    title,
    contentText,
    jobPosting?.description,
    location,
    jobType,
    jobPosting?.validThrough,
  ]).join(" ");

  return {
    sourceId: source.id,
    sourceName: source.sourceName,
    sourceUrl: detailUrl,
    applyUrl,
    title,
    company: source.company,
    companyType: source.companyType,
    location: location || "বাংলাদেশ",
    educationText: rawText,
    experienceText: rawText,
    deadlineText: rawText,
    jobType: jobType || undefined,
    rawText,
    fetchedAt: new Date().toISOString(),
  };
}

export async function scrapePathaoJobs(source: SourceRegistryEntry) {
  const $ = await fetchCheerio(source.listingUrl, source);
  const detailUrls = new Set<string>();

  $('a[href*="/jobs/"]').each((_, element) => {
    const href = $(element).attr("href");

    if (!href || href === "/jobs/" || href.endsWith("/jobs/")) {
      return;
    }

    detailUrls.add(toAbsoluteUrl(href, source.listingUrl));
  });

  const results = await Promise.all(
    [...detailUrls].map((detailUrl) => scrapePathaoDetail(detailUrl, source)),
  );

  return results.filter(Boolean) as ScrapedJobCandidate[];
}
