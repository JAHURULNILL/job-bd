import type { SourceRegistryEntry } from "@/lib/jobs/types";

function normalizeHost(hostname: string) {
  return hostname.replace(/^www\./, "").toLowerCase();
}

function hostMatches(hostname: string, allowedHost: string) {
  const normalizedHost = normalizeHost(hostname);
  const normalizedAllowed = normalizeHost(allowedHost);

  return (
    normalizedHost === normalizedAllowed ||
    normalizedHost.endsWith(`.${normalizedAllowed}`)
  );
}

export function isSafeHttpUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function toAbsoluteUrl(value: string, baseUrl: string) {
  return new URL(value, baseUrl).toString();
}

export function isTrustedSourceUrl(url: string, source: SourceRegistryEntry) {
  if (!isSafeHttpUrl(url)) {
    return false;
  }

  const hostname = new URL(url).hostname;
  return source.allowHosts.some((allowed) => hostMatches(hostname, allowed));
}

export function isTrustedApplyUrl(url: string, source: SourceRegistryEntry) {
  if (!isSafeHttpUrl(url)) {
    return false;
  }

  const hostname = new URL(url).hostname;
  const allowedHosts = source.allowedApplyHosts?.length
    ? source.allowedApplyHosts
    : source.allowHosts;

  return allowedHosts.some((allowed) => hostMatches(hostname, allowed));
}
