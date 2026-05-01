import { compactStrings, sanitizeScrapedText } from "@/lib/jobs/text";
import { extractJsonLdBlocks, findJobPostingJsonLd } from "@/lib/jobs/extractors";
import { fetchCheerio } from "@/lib/jobs/fetcher";
import type { ScrapedJobCandidate, SourceRegistryEntry } from "@/lib/jobs/types";
import { isTrustedSourceUrl, toAbsoluteUrl } from "@/lib/jobs/url";
import { normalizeWhitespace } from "@/lib/utils";

const pathHints = [
  "/job",
  "/jobs",
  "career-opportunities",
  "career-opportunity",
  "career-list",
  "current-openings",
  "vacancy",
  "opening",
  "openings",
  "position",
  "circular",
  "circulars",
  "available_jobs",
  "dtlsjob",
  "jobdetails",
];

function collectRelevantUrls(
  $: Awaited<ReturnType<typeof fetchCheerio>>,
  baseUrl: string,
  source: SourceRegistryEntry,
) {
  const urls = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    const absoluteUrl = toAbsoluteUrl(href, source.listingUrl);
    const looksRelevant = pathHints.some((hint) =>
      absoluteUrl.toLowerCase().includes(hint),
    );

    if (!looksRelevant || !isTrustedSourceUrl(absoluteUrl, source)) {
      return;
    }

    if (absoluteUrl === source.listingUrl || absoluteUrl === source.careersUrl) {
      return;
    }

    urls.add(absoluteUrl);
  });

  return [...urls];
}

async function expandRelevantUrls(
  seedUrls: string[],
  source: SourceRegistryEntry,
) {
  const expandedUrls = new Set<string>();

  for (const seedUrl of seedUrls.slice(0, 18)) {
    try {
      const nested$ = await fetchCheerio(seedUrl, source);
      const nestedUrls = collectRelevantUrls(nested$, seedUrl, source).filter(
        (url) =>
          url !== seedUrl && url !== source.listingUrl && url !== source.careersUrl,
      );

      if (nestedUrls.length > 0) {
        nestedUrls.slice(0, 12).forEach((url) => expandedUrls.add(url));
        continue;
      }
    } catch {
      // Ignore one bad nested page and continue crawling the rest.
    }

    expandedUrls.add(seedUrl);
  }

  return [...expandedUrls];
}

export async function scrapeGenericOfficialCareer(source: SourceRegistryEntry) {
  const $ = await fetchCheerio(source.listingUrl, source);
  const firstPassUrls = collectRelevantUrls($, source.listingUrl, source);
  const detailUrls =
    firstPassUrls.length > 0
      ? await expandRelevantUrls(firstPassUrls, source)
      : [source.listingUrl];

  const limitedUrls = [...new Set(detailUrls)].slice(0, 30);
  const results = await Promise.all(
    limitedUrls.map(async (detailUrl) => {
      const detail$ = await fetchCheerio(detailUrl, source);
      const blocks = extractJsonLdBlocks(detail$);
      const jobPosting = findJobPostingJsonLd(blocks);
      const title = normalizeWhitespace(
        jobPosting?.title ||
          detail$("h1").first().text() ||
          detail$("h2").first().text(),
      );
      const body = sanitizeScrapedText(
        detail$("main").text() ||
          detail$(".container").text() ||
          detail$(".content").text() ||
          detail$("body").text(),
      );

      if (!title || body.length < 80) {
        return null;
      }

      return {
        sourceId: source.id,
        sourceName: source.sourceName,
        sourceUrl: detailUrl,
        applyUrl: detailUrl,
        title,
        company: source.company,
        companyType: source.companyType,
        location: "বাংলাদেশ",
        educationText: body,
        experienceText: body,
        deadlineText: compactStrings([jobPosting?.validThrough, body]).join(" "),
        rawText: compactStrings([title, body, jobPosting?.description]).join(" "),
        fetchedAt: new Date().toISOString(),
      } satisfies ScrapedJobCandidate;
    }),
  );

  return results.filter(Boolean) as ScrapedJobCandidate[];
}
