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
  "vacancy",
  "opening",
  "position",
];

export async function scrapeGenericOfficialCareer(source: SourceRegistryEntry) {
  const $ = await fetchCheerio(source.listingUrl, source);
  const detailUrls = new Set<string>();

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

    detailUrls.add(absoluteUrl);
  });

  const limitedUrls = [...detailUrls].slice(0, 20);
  const results = await Promise.all(
    limitedUrls.map(async (detailUrl) => {
      const detail$ = await fetchCheerio(detailUrl, source);
      const blocks = extractJsonLdBlocks(detail$);
      const jobPosting = findJobPostingJsonLd(blocks);
      const title = normalizeWhitespace(
        jobPosting?.title || detail$("h1").first().text(),
      );
      const body = sanitizeScrapedText(detail$("main").text() || detail$("body").text());

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
