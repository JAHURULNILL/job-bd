import * as cheerio from "cheerio";

import { normalizeWhitespace, sanitizePlainText } from "@/lib/utils";

export function extractTextFromHtml(html: string) {
  const $ = cheerio.load(html);
  return normalizeWhitespace($.root().text());
}

export function extractFirstText(value?: string | null) {
  return value ? normalizeWhitespace(value) : "";
}

export function sanitizeScrapedText(value: string) {
  return sanitizePlainText(value);
}

export function compactStrings(values: Array<string | null | undefined>) {
  return values.map((value) => (value ? normalizeWhitespace(value) : "")).filter(Boolean);
}
