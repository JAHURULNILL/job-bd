import { compactStrings, sanitizeScrapedText } from "@/lib/jobs/text";
import { fetchCheerio } from "@/lib/jobs/fetcher";
import type { ScrapedJobCandidate, SourceRegistryEntry } from "@/lib/jobs/types";
import { toAbsoluteUrl } from "@/lib/jobs/url";
import { normalizeWhitespace } from "@/lib/utils";

async function scrapeGovtPortalDetail(
  detailUrl: string,
  source: SourceRegistryEntry,
  fallbackTitle: string,
  fallbackDate: string,
) {
  const $ = await fetchCheerio(detailUrl, source);
  const title = normalizeWhitespace(
    $(".title-with-image-content-widget h2").first().text() ||
      $("h1").first().text() ||
      $("h2").first().text() ||
      fallbackTitle,
  );
  const chipText = normalizeWhitespace($(".chips").text());
  const body = sanitizeScrapedText(
    $(".title-with-image-content-widget").text() || $("main").text() || $("body").text(),
  );
  const firstFileUrl =
    $('.title-with-image-content-widget-content-files a[href*=".pdf"]').first().attr("href") ||
    $('a[href*=".pdf"]').first().attr("href") ||
    detailUrl;

  if (!title || body.length < 40) {
    return null;
  }

  return {
    sourceId: source.id,
    sourceName: source.sourceName,
    sourceUrl: detailUrl,
    applyUrl: firstFileUrl ? toAbsoluteUrl(firstFileUrl, detailUrl) : detailUrl,
    title,
    company: source.company,
    companyType: source.companyType,
    location: "বাংলাদেশ",
    educationText: compactStrings([title, chipText, body]).join(" "),
    experienceText: compactStrings([title, chipText, body]).join(" "),
    deadlineText: compactStrings([chipText, fallbackDate, body]).join(" "),
    rawText: compactStrings([title, chipText, body, fallbackDate]).join(" "),
    fetchedAt: new Date().toISOString(),
  } satisfies ScrapedJobCandidate;
}

export async function scrapeGovtPortalTable(source: SourceRegistryEntry) {
  const $ = await fetchCheerio(source.listingUrl, source);
  const rows = $("table#noticeTable tbody tr.table-tr").toArray();
  const candidates: ScrapedJobCandidate[] = [];

  for (const row of rows) {
    const rowNode = $(row);

    if (rowNode.hasClass("toggle-hidden")) {
      continue;
    }

    const title = normalizeWhitespace(rowNode.find('td[data-column="title"]').text());
    const dateText = normalizeWhitespace(
      rowNode.find('td[data-column="publish_date"]').text(),
    );
    const detailHref = rowNode.find("td.centered a[href]").attr("href");

    if (!title || !detailHref) {
      continue;
    }

    const detailUrl = toAbsoluteUrl(detailHref, source.listingUrl);
    const candidate = await scrapeGovtPortalDetail(
      detailUrl,
      source,
      title,
      dateText,
    );

    if (candidate) {
      candidates.push(candidate);
    }
  }

  return candidates;
}
