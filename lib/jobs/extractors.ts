import * as cheerio from "cheerio";

export function extractJsonLdBlocks($: cheerio.CheerioAPI) {
  const blocks: unknown[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).contents().text();

    if (!raw.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else {
        blocks.push(parsed);
      }
    } catch {
      // Skip malformed JSON-LD blocks from third-party widgets.
    }
  });

  return blocks;
}

export function findJobPostingJsonLd(blocks: unknown[]) {
  return blocks.find((block) => {
    if (!block || typeof block !== "object") {
      return false;
    }

    const maybeType = (block as { ["@type"]?: string | string[] })["@type"];

    if (Array.isArray(maybeType)) {
      return maybeType.includes("JobPosting");
    }

    return maybeType === "JobPosting";
  }) as
    | {
        title?: string;
        description?: string;
        validThrough?: string;
        datePosted?: string;
      }
    | undefined;
}
