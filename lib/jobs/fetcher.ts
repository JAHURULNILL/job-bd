import axios from "axios";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { SourceRegistryEntry } from "@/lib/jobs/types";

const env = getEnv();
const http = axios.create({
  timeout: env.SCRAPE_TIMEOUT_MS,
  headers: {
    "User-Agent": env.SCRAPE_USER_AGENT,
    Accept: "text/html,application/xhtml+xml",
  },
});

const robotsCache = new Map<string, ReturnType<typeof robotsParser>>();
const hostDelayCache = new Map<string, number>();

async function waitForPoliteDelay(url: string) {
  const hostname = new URL(url).hostname;
  const nextAllowedAt = hostDelayCache.get(hostname) ?? 0;
  const now = Date.now();

  if (nextAllowedAt > now) {
    await new Promise((resolve) => setTimeout(resolve, nextAllowedAt - now));
  }

  hostDelayCache.set(hostname, Date.now() + env.SCRAPE_DELAY_MS);
}

async function loadRobots(origin: string) {
  if (robotsCache.has(origin)) {
    return robotsCache.get(origin)!;
  }

  try {
    const response = await http.get(`${origin}/robots.txt`);
    const parsed = robotsParser(`${origin}/robots.txt`, response.data);
    robotsCache.set(origin, parsed);
    return parsed;
  } catch {
    const parsed = robotsParser(`${origin}/robots.txt`, "");
    robotsCache.set(origin, parsed);
    return parsed;
  }
}

export async function assertCanFetch(
  url: string,
  source: SourceRegistryEntry,
) {
  const origin = new URL(url).origin;
  const robots = await loadRobots(origin);
  const canFetch = robots.isAllowed(url, env.SCRAPE_USER_AGENT);

  if (canFetch === false) {
    throw new Error(
      `Robots policy blocked crawling for ${source.sourceName}: ${url}`,
    );
  }
}

export async function fetchHtml(
  url: string,
  source: SourceRegistryEntry,
) {
  await assertCanFetch(url, source);
  await waitForPoliteDelay(url);

  logger.info({ source: source.id, url }, "Fetching source page");
  const response = await http.get<string>(url, { responseType: "text" });
  return response.data;
}

export async function fetchCheerio(
  url: string,
  source: SourceRegistryEntry,
) {
  const html = await fetchHtml(url, source);
  return cheerio.load(html);
}
